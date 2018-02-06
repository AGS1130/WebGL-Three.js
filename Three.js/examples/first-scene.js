const THREE = require("three");

/*Scene, Camera, and Renderer*/
const scene = new THREE.Scene();
//FOV: How much is shown, Aspect Ratio: You almost always want to use the width of the element divided by the height
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 ); 

/*Sets the canvas size and appends it to the HTML */
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight ); //Third param is bool that if false => lower res.
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 ); //W, H, Depth
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material ); // geometry + material
scene.add( cube ); //the thing we add will be added to the coordinates (0,0,0)

camera.position.z = 5; //The camera and the cube will be inside each other. To avoid this, we move the camera out a bit.

const animate = () => {
    requestAnimationFrame( animate ); //draw the scene every time the screen is refreshed

    cube.rotation.x += 0.1;
    cube.rotation.y += 0.1;

    renderer.render(scene, camera);
};

animate();
