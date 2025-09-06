import { StyleManager } from './style.js';

export class Interaction {
  constructor(player, shipSystem, npc) {
    this.player = player;
    this.shipSystem = shipSystem;
    this.npc = npc;

    // Use StyleManager for UI
    this.style = new StyleManager();

    this.playerGold = 100;
    window.playerGold = this.playerGold;

    this.eDown = false;
    window.addEventListener("keydown", (e) => { if (e.code === "KeyE") this.eDown = true; });
    window.addEventListener("keyup", (e) => { if (e.code === "KeyE") this.eDown = false; });
  }

  update() {
    let interacted = false;
    const playerPos = this.player.yaw.position;

    // --- NPC Interaction ---
    const npcDist = playerPos.distanceTo(this.npc.position);
    if (npcDist < 3) {
      this.style.showInteraction("Press E to open market");
      interacted = true;
      if (this.eDown) this.style.showMarket();
    }

    // --- Ships Interaction ---
    for (const ship of this.shipSystem.getShips()) {
      const shipDist = playerPos.distanceTo(ship.position);
      if (shipDist < 4) {
        interacted = true;
        if (!this.shipSystem.boardedShip) {
          this.style.showInteraction("Press E to board ship");
          if (this.eDown) this.shipSystem.boardShip(ship);
        } else if (this.shipSystem.boardedShip === ship) {
          this.style.showInteraction("Press E to exit ship");
          if (this.eDown) this.shipSystem.exitShip();
        }
      }
    }

    // --- Hide text/market if nothing nearby ---
    if (!interacted) {
      this.style.hideInteraction();
      this.style.hideMarket();
    }

    // Update gold in HUD
    this.style.updateGold(this.playerGold);
  }

  buyShip() {
    if (this.playerGold < 50) {
      alert("Not enough gold!");
      return;
    }
    this.playerGold -= 50;
    window.playerGold = this.playerGold;

    // Spawn ship near dock
    const shipPos = new THREE.Vector3(0, 0, 20); // adjust as needed
    this.shipSystem.spawnShip(shipPos);
    this.style.hideMarket();
  }
}
