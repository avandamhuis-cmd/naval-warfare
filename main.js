import { Player } from './player.js';
import { Musket } from './musket.js';
import { ShipSystem } from './ship.js';
import { Interaction } from './interaction.js';
import { Water } from './water.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // sky blue

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const sun = new THREE.DirectionalLight(0xffffff, 1.2);
sun.position.set(50, 100, 50);
scene.add(sun);
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
scene.add(new THREE.HemisphereLight(0x87ceeb, 0x228B22, 0.4));

// Collidable objects (dock, islands, ships, etc.)
const collidables = [];

// Water
const water = new Water(scene);

// Player
const player = new Player(scene, camera, collidables, water);

// Musket
const musket = new Musket(scene, camera, player);

// Ships
const shipSystem = new ShipSystem(scene, player, collidables, water);

// NPC + Market interaction
const interaction = new Interaction(player, shipSystem);

// Handle resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Game loop
function animate() {
  requestAnimationFrame(animate);

  water.update();
  player.update();
  shipSystem.update();
  musket.update(shipSystem.getShips());
  interaction.update();

  renderer.render(scene, camera);
}
animate();
