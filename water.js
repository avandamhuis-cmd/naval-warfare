export class Water {
  constructor(scene) {
    const geometry = new THREE.PlaneGeometry(1000, 1000, 128, 128);
    const material = new THREE.MeshPhongMaterial({
      color: 0x1e90ff,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
      flatShading: true,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.rotation.x = -Math.PI / 2;
    scene.add(this.mesh);

    this.geometry = geometry;
    this.time = 0;
  }

  update() {
    this.time += 0.015; // slower waves

    const pos = this.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);

      // Larger wave height and smoother motion
      const waveHeight =
        Math.sin(x * 0.05 + this.time) * 1.2 +
        Math.cos(y * 0.05 + this.time * 0.8) * 1.2;

      pos.setZ(i, waveHeight);
    }
    pos.needsUpdate = true;
    this.geometry.computeVertexNormals();
  }
}
