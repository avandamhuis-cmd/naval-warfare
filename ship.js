import * as THREE from 'three';

export class ShipSystem {
  constructor(scene, player, collidables, water){
    this.scene=scene;
    this.player=player;
    this.collidables=collidables;
    this.water=water;

    this.ships=[];
    this.boardedShip=null;
    this.speed=0.1;
  }

  spawnShip(position){
    const ship=new THREE.Mesh(
      new THREE.BoxGeometry(3,1,6),
      new THREE.MeshPhongMaterial({color:0x8b4513})
    );
    ship.position.copy(position);
    ship.position.y=this.water.getHeightAt(position.x,position.z)+0.5;
    this.scene.add(ship);
    this.ships.push(ship);
  }

  getShips(){ return this.ships; }

  boardShip(ship){
    this.boardedShip=ship;
    this.player.disableControls();
  }

  exitShip(){
    if(this.boardedShip){
      this.player.enableControls(this.boardedShip.position.clone().add(new THREE.Vector3(0,2,5)));
      this.boardedShip=null;
    }
  }

  update(){
    if(this.boardedShip){
      const dir=new THREE.Vector3();
      if(this.player.keys['KeyW']) dir.z=-1;
      if(this.player.keys['KeyS']) dir.z=1;
      if(this.player.keys['KeyA']) dir.x=-1;
      if(this.player.keys['KeyD']) dir.x=1;
      dir.normalize();
      this.boardedShip.position.add(dir.multiplyScalar(this.speed));
      this.boardedShip.position.y=this.water.getHeightAt(this.boardedShip.position.x,this.boardedShip.position.z)+0.5;
    }
  }
}
