import * as THREE from 'three';
import { Player } from './player.js';
import { Musket } from './musket.js';
import { ShipSystem } from './ship.js';
import { Interaction } from './interaction.js';
import { Water } from './water.js';
import { StyleManager } from './style.js';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lights
const sun = new THREE.DirectionalLight(0xffffff, 1.2);
sun.position.set(50, 100, 50);
scene.add(sun);
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
scene.add(new THREE.HemisphereLight(0x87ceeb, 0x228B22, 0.4));

// Collidables
const collidables = [];

// Water
const water = new Water(scene);

// Island
const island = new THREE.Mesh(
  new THREE.BoxGeometry(20, 4, 20),
  new THREE.MeshPhongMaterial({ color: 0x228B22 })
);
island.position.y = 2;
scene.add(island);
collidables.push(island);

// Dock
const dock = new THREE.Mesh(
  new THREE.BoxGeometry(6, 0.5, 12),
  new THREE.MeshPhongMaterial({ color: 0x8B4513 })
);
dock.position.set(0, 0.25, 10);
scene.add(dock);
collidables.push(dock);

// NPC
const npc = new THREE.Mesh(
  new THREE.BoxGeometry(1.5, 2, 0.5),
  new THREE.MeshPhongMaterial({ color: 0x0000ff })
);
npc.position.set(0, 1, 12);
scene.add(npc);

// Player
const player = new Player(scene, camera, collidables, water);

// Musket
const musket = new Musket(scene, camera, player);

// Ship System
const shipSystem = new ShipSystem(scene, player, collidables, water);
window.shipSystem = shipSystem;

// Interaction
const interaction = new Interaction(player, shipSystem, npc);

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animate
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
