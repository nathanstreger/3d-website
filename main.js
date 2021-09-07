import "./style.css";
import * as THREE from "three";
import moonUrl from "./images/moon.jpg";
import nathanUrl from "./images/nathan.jpg";
import spaceUrl from "./images/space.jpg";
import normalUrl from "./images/normal.jpg";

// Setup

const fSmallScreen = window.innerWidth < 900;
const scene = new THREE.Scene();

const initalCameraPositionX = fSmallScreen ? 2.0 : 0;
const initalCameraPositionY = fSmallScreen ? -1.5 : 0;
const initalCameraPositionZ = fSmallScreen ? 0 : 0;

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / (fSmallScreen ? window.outerHeight : window.innerHeight),
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setY(initalCameraPositionY);

renderer.render(scene, camera);

// Torus

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshPhongMaterial({ color: 0xff6347 });
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

// Lights

//point light adds inner torus brightness
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

//ambient light to light up the whole scene
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Stars
const Stars = [];

const addStar = () => {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.PointsMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  Stars.push(star);
  scene.add(star);
};

Array(100).fill().forEach(addStar);

// Background

const spaceTexture = new THREE.TextureLoader().load(spaceUrl);
scene.background = spaceTexture;

// Avatar

const NathanTexture = new THREE.TextureLoader().load(nathanUrl);

const Nathan = new THREE.Mesh(
  fSmallScreen
    ? new THREE.BoxGeometry(2, 2, 2)
    : new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: NathanTexture })
);

scene.add(Nathan);

// Moon

const moonTexture = new THREE.TextureLoader().load(moonUrl);
const normalTexture = new THREE.TextureLoader().load(normalUrl);

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshPhongMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

scene.add(moon);

moon.position.z = 25;
moon.position.setX(-10);

Nathan.position.z = -5;
Nathan.position.x = 2;

// Scroll Animation

const moveCamera = () => {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.005;
  moon.rotation.y += 0.0075;
  moon.rotation.z += 0.005;

  Nathan.rotation.y = t * -0.001;
  Nathan.rotation.z = t * -0.001;

  camera.position.z = initalCameraPositionZ + t * -0.01;
  camera.position.x = initalCameraPositionX + t * -0.0002;
  camera.rotation.y = t * -0.0002;
};

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop

const animate = () => {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  moon.rotation.x += 0.005;

  renderer.render(scene, camera);
};

animate();
