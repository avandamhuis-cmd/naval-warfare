export class Water {
  constructor(scene) {
    this.width = 1000;
    this.height = 1000;

    // Plane for water
    const geometry = new THREE.PlaneGeometry(this.width, this.height, 128, 128);
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
    this.time += 0.015;

    const pos = this.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);

      const waveHeight =
        Math.sin(x * 0.05 + this.time) * 1.2 +
        Math.cos(y * 0.05 + this.time * 0.8) * 1.2;

      pos.setZ(i, waveHeight);
    }
    pos.needsUpdate = true;
    this.geometry.computeVertexNormals();
  }

  // NEW: Get water height at a given world (x, z)
  getHeightAt(x, z) {
    return (
      Math.sin(x * 0.05 + this.time) * 1.2 +
      Math.cos(z * 0.05 + this.time * 0.8) * 1.2
    );
  }
}
