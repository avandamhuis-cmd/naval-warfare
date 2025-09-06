export class ShipSystem {
  constructor(scene, player, collidables, water) {
    this.scene = scene;
    this.player = player;
    this.collidables = collidables;
    this.water = water;

    this.ships = [];
    this.boardedShip = null;
    this.keyState = {};

    // Track key presses
    window.addEventListener("keydown", (e) => (this.keyState[e.code] = true));
    window.addEventListener("keyup", (e) => (this.keyState[e.code] = false));
  }

  spawnShip(position = new THREE.Vector3(0, 0, 20)) {
    // Simple brown ship (rectangular base)
    const geometry = new THREE.BoxGeometry(6, 1.5, 12);
    const material = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
    const ship = new THREE.Mesh(geometry, material);
    ship.position.copy(position);
    ship.position.y = 0.75; // Sit on water
    ship.castShadow = true;
    ship.receiveShadow = true;

    this.scene.add(ship);
    this.ships.push(ship);
    this.collidables.push(ship);

    return ship;
  }

  boardShip(ship) {
    if (this.boardedShip) return;

    this.boardedShip = ship;
    this.player.disableControls(); // freeze FPS controls
    this.player.camera.position.set(
      ship.position.x,
      ship.position.y + 3,
      ship.position.z - 8
    );
    this.player.camera.lookAt(ship.position);
    document.getElementById("interactionText").innerText = "Press E to Exit Ship";
    document.getElementById("interactionText").style.display = "block";
  }

  exitShip() {
    if (!this.boardedShip) return;

    const exitPos = this.boardedShip.position.clone();
    exitPos.x += 5; // Drop player beside ship
    exitPos.y = 2;

    this.player.enableControls(exitPos);
    this.boardedShip = null;
    document.getElementById("interactionText").style.display = "none";
  }

  update() {
    if (this.boardedShip) {
      // Ship controls (WASD) when boarded
      if (this.keyState["KeyW"]) {
        this.boardedShip.translateZ(-0.2);
      }
      if (this.keyState["KeyS"]) {
        this.boardedShip.translateZ(0.2);
      }
      if (this.keyState["KeyA"]) {
        this.boardedShip.rotation.y += 0.02;
      }
      if (this.keyState["KeyD"]) {
        this.boardedShip.rotation.y -= 0.02;
      }

      // Keep ship floating on waves
      const waterHeight = this.water.getHeightAt(
        this.boardedShip.position.x,
        this.boardedShip.position.z
      );
      this.boardedShip.position.y = waterHeight + 0.75;

      // Update camera to follow ship
      this.player.camera.position.lerp(
        new THREE.Vector3(
          this.boardedShip.position.x,
          this.boardedShip.position.y + 3,
          this.boardedShip.position.z - 8
        ),
        0.1
      );
      this.player.camera.lookAt(this.boardedShip.position);

      // Exit ship
      if (this.keyState["KeyE"]) {
        this.exitShip();
      }
    }
  }

  getShips() {
    return this.ships;
  }
}
