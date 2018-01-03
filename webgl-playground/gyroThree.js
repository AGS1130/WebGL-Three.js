this.update = function () {
 
	var offset = new THREE.Vector3();
 
	var lastGamma = 0,
		lastBeta = 0;
 
	// so camera.up is the orbit axis
	var quat = new THREE.Quaternion().setFromUnitVectors( object.up, new THREE.Vector3( 0, 1, 0 ) );
	var quatInverse = quat.clone().inverse();
 
	var lastPosition = new THREE.Vector3();
	var lastQuaternion = new THREE.Quaternion();
 
	return function update() {
 
		var position = scope.object.position;
 
		offset.copy( position ).sub( scope.target );
 
		// rotate offset to "y-axis-is-up" space
		offset.applyQuaternion( quat );
 
		// angle from z-axis around y-axis
		spherical.setFromVector3( offset );
 
		if ( scope.autoRotate && state === STATE.NONE ) {
 
			rotateLeft( getAutoRotationAngle() );
 
		}
 
		spherical.theta += sphericalDelta.theta;
		spherical.phi += sphericalDelta.phi;
 
		// restrict theta to be between desired limits
		spherical.theta = Math.max( scope.minAzimuthAngle, Math.min( scope.maxAzimuthAngle, spherical.theta ) );
 
		// restrict phi to be between desired limits
		spherical.phi = Math.max( scope.minPolarAngle, Math.min( scope.maxPolarAngle, spherical.phi ) );
 
		spherical.makeSafe();
 
 
		spherical.radius *= scale;
 
		// restrict radius to be between desired limits
		spherical.radius = Math.max( scope.minDistance, Math.min( scope.maxDistance, spherical.radius ) );
 
		// move target to panned location
		scope.target.add( panOffset );
 
		offset.setFromSpherical( spherical );
 
		// rotate offset back to "camera-up-vector-is-up" space
		offset.applyQuaternion( quatInverse );
 
		position.copy( scope.target ).add( offset );
 
		scope.object.lookAt( scope.target );
 
		if ( scope.enableDamping === true ) {
 
			sphericalDelta.theta *= ( 1 - scope.dampingFactor );
			sphericalDelta.phi *= ( 1 - scope.dampingFactor );
 
		} else {
 
			sphericalDelta.set( 0, 0, 0 );
 
		}
 
		scale = 1;
		panOffset.set( 0, 0, 0 );
 
		// update condition is:
		// min(camera displacement, camera rotation in radians)^2 > EPS
		// using small-angle approximation cos(x/2) = 1 - x^2 / 8
 
		if ( zoomChanged ||
			lastPosition.distanceToSquared( scope.object.position ) > EPS ||
			8 * ( 1 - lastQuaternion.dot( scope.object.quaternion ) ) > EPS ) {
 
			scope.dispatchEvent( changeEvent );
 
			lastPosition.copy( scope.object.position );
			lastQuaternion.copy( scope.object.quaternion );
			zoomChanged = false;
 
			return true;
 
		}
 
		// Gyroscope Additions
		if ('undefined' === typeof scope.deviceOrientation) {
			return false;
		}
 
		var alpha = scope.deviceOrientation.alpha ? THREE.Math.degToRad(scope.deviceOrientation.alpha) : 0;
		var beta = scope.deviceOrientation.beta ? THREE.Math.degToRad(scope.deviceOrientation.beta) : 0;
		var gamma = scope.deviceOrientation.gamma ? THREE.Math.degToRad(scope.deviceOrientation.gamma) : 0;
		var orient = scope.screenOrientation ? THREE.Math.degToRad(scope.screenOrientation) : 0;
 
		var currentQ = new THREE.Quaternion().copy(scope.object.quaternion);
 
		setObjectQuaternion(currentQ, alpha, beta, gamma, orient);
		var currentAngle = Quat2Angle(currentQ.x, currentQ.y, currentQ.z, currentQ.w);
		var radDeg = 180 / Math.PI;
 
		rotateLeft(lastGamma - currentAngle.z);
		lastGamma = currentAngle.z;
 
		rotateUp(lastBeta - currentAngle.y);
		lastBeta = currentAngle.y;
 
		return false;
 
	};
 
}();