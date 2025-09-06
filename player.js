import * as THREE from 'three';

export class Player {
  constructor(scene, camera, collidables = [], water) {
    this.scene = scene;
    this.camera = camera;
    this.collidables = collidables;
    this.water = water;

    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();
    this.moveSpeed = 0.2;
    this.jumpSpeed = 0.35;
    this.swimSpeed = 0.15;
    this.canJump = true;
    this.isSwimming = false;
    this.enabled = true;

    this.pitch = 0;
    this.yaw = 0;

    document.body.addEventListener('click', () => { document.body.requestPointerLock(); });
    document.addEventListener('pointerlockchange', () => {
      if (document.pointerLockElement === document.body) {
        document.addEventListener('mousemove', this.onMouseMove);
      } else { document.removeEventListener('mousemove', this.onMouseMove); }
    });

    this.keys = {};
    window.addEventListener('keydown', (e) => { this.keys[e.code] = true; });
    window.addEventListener('keyup', (e) => { this.keys[e.code] = false; });

    this.camera.position.set(0, 2, 0);
  }

  disableControls() { this.enabled = false; }
  enableControls(position) { this.enabled = true; this.camera.position.copy(position); }

  onMouseMove = (event) => {
    if (!this.enabled) return;
    const movementX = event.movementX || 0;
    const movementY = event.movementY || 0;
    this.yaw -= movementX * 0.002;
    this.pitch -= movementY * 0.002;
    this.pitch = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.pitch));
    this.camera.rotation.set(this.pitch, this.yaw, 0);
  };

  update() {
    if (!this.enabled) return;
    const waterHeight = this.water.getHeightAt(this.camera.position.x, this.camera.position.z);
    this.isSwimming = this.camera.position.y < waterHeight + 1.5;

    const speed = this.isSwimming ? this.swimSpeed : this.moveSpeed;

    this.direction.set(0,0,0);
    if(this.keys['KeyW']) this.direction.z -= 1;
    if(this.keys['KeyS']) this.direction.z += 1;
    if(this.keys['KeyA']) this.direction.x -= 1;
    if(this.keys['KeyD']) this.direction.x += 1;
    this.direction.normalize();

    const angle = this.yaw;
    const dx = this.direction.x * Math.cos(angle) - this.direction.z * Math.sin(angle);
    const dz = this.direction.x * Math.sin(angle) + this.direction.z * Math.cos(angle);

    this.velocity.x = dx * speed;
    this.velocity.z = dz * speed;

    if(this.keys['Space']){
      if(this.isSwimming) this.velocity.y = 0.1;
      else if(this.canJump){ this.velocity.y = this.jumpSpeed; this.canJump=false; }
    }

    if(!this.isSwimming) this.velocity.y -= 0.02;
    else this.velocity.y *= 0.9;

    this.camera.position.add(this.velocity);

    if(!this.isSwimming && this.camera.position.y<2){ this.velocity.y=0; this.camera.position.y=2; this.canJump=true; }

    if(this.isSwimming){
      const targetY = waterHeight + 1.2 + Math.sin(Date.now()*0.005)*0.2;
      this.camera.position.y += (targetY - this.camera.position.y)*0.1;
    }
  }
}
