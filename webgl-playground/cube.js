/*Requires glMatrix to be installed (fails with mat4 => undefined line 116)*/
// const mat4 = require('./dist/gl-matrix-min.js');
const vertexShaderText = 
[
    'precision mediump float;',
    '',
    'attribute vec2 vertPosition;',
    'attribute vec3 vertColor;',
    'varying vec3 fragColor;',
    'uniform mat4 mWorld;',
    'uniform mat4 mView;',
    'uniform mat4 mProj;',
    '',
    'void main()',
    '{',
    ' fragColor = vertColor;',
    ' gl_Position = mProj * mView * mWorld * vec4(vertPosition, 0.0, 1.0);',
    '}'
].join('\n')

const fragmentShaderText = 
[
    'precision mediump float;',
    '',
    'varying vec3 fragColor;',
    'void main()',
    '{',
    ' gl_FragColor = vec4(fragColor, 1.0);',
    '}'
].join('\n')

const initDemo = () => {
    console.log('This is working')

    const canvas = document.getElementById('game-surface');
    const gl = canvas.getContext('webgl');

    if(!gl){
        gl = canvas.getContext('experimental-webgl')
        alert('Your browser does not support WebGL')
    }

    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    /*Create Shaders*/
    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    gl.compileShader(vertexShader);
    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
        console.error('ERROR compiling vertex shader!', gl.getShaderInit)
        return;
    }
    gl.compileShader(fragmentShader);
    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
        console.error('ERROR compiling vertex shader!', gl.getShaderInit)
        return;
    }

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('ERROR compiling vertex shader!', gl.getProgramInfoLog(program))
        return;
    }
    gl.validateProgram(program);
    if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
        console.error('ERROR compiling vertex shader!', gl.getProgramInfoLog(program))
        return;
    }

    /*Create Buffer*/
    const triangleVertices = [
        /*X, Y, Z*/    /*R, G, B*/
        0.0, 0.5, 0.0,   1.0, 1.0, 0.0,
        -0.5, -0.5, 0.0,  0.7, 0.0, 1.0,
        0.5, -0.5, 0.0,    0.1, 1.0, 0.6
    ];

    const triangleVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
    
    const positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    const colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        positionAttribLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT,
        0
    );
    gl.vertexAttribPointer(
        colorAttribLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT,
        3 * Float32Array.BYTES_PER_ELEMENT
    );
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);
    
    /*Tell OpenGL state machine which program should be active*/
    gl.useProgram(program)

    const matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
    const matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    const matProjUniformLocation = gl.getUniformLocation(program, 'mProj');
    
    const worldMatrix = new Float32Array(16);
    const viewMatrix = new Float32Array(16);
    const projMatrix = new Float32Array(16);
    mat4.identity(worldMatrix);    
    mat4.lookAt(viewMatrix, [0, 0, -5], [0, 0, 0], [0, 1, 0]);
    mat4.perspectve(projMatrix, glMatrix.toRadin(45), canvas.width / canvas.height, 0.1, 1000.0);

    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

    /*Render Loop*/
    let identityMatrix = new Float32Array(16);
    mat4.identity(idenityMatrix);
    let angle = 0;
    const loop = () => {
        angle = performance.now() / 1000 / 6 * 2 * Math.PI;
        mat4.rotate(worldMatrix, identityMatrix, angle, [0, 1, 0]);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

        gl.clearColor(0.75, 0.85, 0.8, 1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.FALSE, worldMatrix);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        requestAnimationFrameloop(loop);
    }
    requestAnimationFrame(loop)

    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;
    // gl.viewport(0, 0, window.innerWidth, window.innerHeight);
}