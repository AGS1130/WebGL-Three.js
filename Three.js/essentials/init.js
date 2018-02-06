const THREE = require("three");

const init = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / innerHeight, 0.1, 1000);
    camera.position.x = 15;
    camera.position.y = 16;
    camera.position.z = 13;

    camera.lookAt(scene.position);

    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;

    const render = () => {
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    document.body.appendChild(renderer.domElement);
    render();
}

window.onload = init;
