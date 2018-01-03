const WIDTH = 640,
      HEIGHT = 360;

const FOV = 75, //Field of View
      ASPECT = WIDTH / HEIGHT, //Diffrence between Horizontal and Vertical FOV
      NEAR = 0.1, // Minimum distance from camera
      FAR = 2000; //What we want to see

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(FOV, ASPECT, NEAR, FAR);

camera.position.z = 5;

const renderer = new THREE.WebGLRenderer(); //Used to display scene
renderer.setSize(WIDTH, HEIGHT);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({color: 0xff0000});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const animate = () => {
    /*Callback to continue animating*/
    requestAnimationFrame(animate); //Notifies browser we want to perfrom an animation

    cube.rotation.x += 0.1;
    cube.rotation.y += 0.1;
    
    renderer.render(scene, camera);
};

animate();