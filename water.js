import * as THREE from 'three';

export class Water{
  constructor(scene){
    this.scene=scene;
    const geometry=new THREE.PlaneGeometry(1000,1000,50,50);
    const material=new THREE.MeshPhongMaterial({color:0x1E90FF, side:THREE.DoubleSide});
    this.mesh=new THREE.Mesh(geometry, material);
    this.mesh.rotation.x=-Math.PI/2;
    scene.add(this.mesh);
  }

  getHeightAt(x,z){
    return 0; // flat water for simplicity
  }

  update(){
    // simple wave animation: bob the water slightly
    this.mesh.position.y=Math.sin(Date.now()*0.001)*0.1;
  }
}
