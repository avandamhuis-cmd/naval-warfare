import * as THREE from 'three';

export class Musket {
  constructor(scene, camera, player) {
    this.scene = scene;
    this.camera = camera;
    this.player = player;

    this.equipped = false;
    this.reloading = false;
    this.ammo = 1;
    this.reloadTime = 7000;

    this.createMusketModel();

    this.aiming = false;
    window.addEventListener('mousedown', (e)=>{
      if(this.equipped){
        if(e.button===0) this.fire();
        if(e.button===2) this.aiming=true;
      }
    });
    window.addEventListener('mouseup',(e)=>{ if(e.button===2) this.aiming=false; });
    window.addEventListener('keydown',(e)=>{
      if(e.code==='KeyR') this.reload();
      if(e.code==='Digit1') this.toggleEquip();
    });
  }

  createMusketModel(){
    this.musketGroup=new THREE.Group();

    const barrelGeom=new THREE.CylinderGeometry(0.08,0.08,2,16);
    const barrelMat=new THREE.MeshPhongMaterial({color:0x555555});
    const barrel=new THREE.Mesh(barrelGeom,barrelMat);
    barrel.rotation.z=Math.PI/2;
    barrel.position.set(0.6,-0.2,0);
    this.musketGroup.add(barrel);

    const stockGeom=new THREE.CylinderGeometry(0.12,0.12,1.5,16);
    const stockMat=new THREE.MeshPhongMaterial({color:0x8b4513});
    const stock=new THREE.Mesh(stockGeom,stockMat);
    stock.rotation.z=Math.PI/2;
    stock.position.set(-0.2,-0.35,0);
    this.musketGroup.add(stock);

    this.musketGroup.visible=false;
    this.camera.add(this.musketGroup);
  }

  toggleEquip(){ this.equipped=!this.equipped; this.musketGroup.visible=this.equipped; }

  fire(){
    if(!this.ammo || this.reloading) return;

    const bulletGeom=new THREE.SphereGeometry(0.05,8,8);
    const bulletMat=new THREE.MeshBasicMaterial({color:0x333333});
    const bullet=new THREE.Mesh(bulletGeom,bulletMat);
    bullet.position.copy(this.camera.position);
    const direction=new THREE.Vector3();
    this.camera.getWorldDirection(direction);
    bullet.userData={velocity:direction.clone().multiplyScalar(2)};
    this.scene.add(bullet);

    const smokeGeom=new THREE.SphereGeometry(0.1,8,8);
    const smokeMat=new THREE.MeshBasicMaterial({color:0xaaaaaa,transparent:true,opacity:0.6});
    const smoke=new THREE.Mesh(smokeGeom,smokeMat);
    smoke.position.copy(this.camera.position).add(direction.clone().multiplyScalar(0.5));
    this.scene.add(smoke);
    setTimeout(()=>this.scene.remove(smoke),500);

    this.camera.rotation.x-=0.05;
    this.ammo=0;
  }

  reload(){
    if(this.reloading || this.ammo>0) return;
    this.reloading=true;

    const down={y:this.musketGroup.position.y};
    const tweenDown=new TWEEN.Tween(down)
      .to({y:down.y-0.2},this.reloadTime/2)
      .onUpdate(()=>{ this.musketGroup.position.y=down.y; });
    const tweenUp=new TWEEN.Tween(down)
      .to({y:0},this.reloadTime/2)
      .onUpdate(()=>{ this.musketGroup.position.y=down.y; })
      .onComplete(()=>{ this.ammo=1; this.reloading=false; });
    tweenDown.chain(tweenUp); tweenDown.start();
  }

  update(bulletsTarget=[]){
    this.scene.children.forEach(child=>{
      if(child.userData && child.userData.velocity){
        child.position.add(child.userData.velocity);
        bulletsTarget.forEach(target=>{
          if(child.position.distanceTo(target.position)<1) this.scene.remove(child);
        });
        if(child.position.length()>500) this.scene.remove(child);
      }
    });

    if(this.aiming){ this.camera.fov=50; this.camera.updateProjectionMatrix(); }
    else { this.camera.fov=75; this.camera.updateProjectionMatrix(); }

    if(typeof TWEEN!=='undefined') TWEEN.update();
  }
}
