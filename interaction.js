export class Interaction {
  constructor(player, shipSystem, npc) {
    this.player = player;
    this.shipSystem = shipSystem;
    this.npc = npc; // THREE.Mesh representing NPC/table
    this.text = document.getElementById("interactionText");
    this.marketUI = document.getElementById("market");
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
      this.text.style.display = "block";
      this.text.innerText = "Press E to open market";
      interacted = true;
      if (this.eDown) this.marketUI.style.display = "block";
    }

    // --- Ships Interaction ---
    for (const ship of this.shipSystem.getShips()) {
      const shipDist = playerPos.distanceTo(ship.position);
      if (shipDist < 4) {
        this.text.style.display = "block";

        if (!this.shipSystem.boardedShip) {
          this.text.innerText = "Press E to board ship";
          if (this.eDown) {
            this.shipSystem.boardShip(ship);
          }
        } else if (this.shipSystem.boardedShip === ship) {
          this.text.innerText = "Press E to exit ship";
          if (this.eDown) {
            this.shipSystem.exitShip();
          }
        }
        interacted = true;
      }
    }

    // --- Hide text if nothing nearby ---
    if (!interacted) {
      this.text.style.display = "none";
      this.marketUI.style.display = "none";
    }
  }

  buyShip() {
    if (this.playerGold < 50) {
      alert("Not enough gold!");
      return;
    }
    this.playerGold -= 50;
    window.playerGold = this.playerGold;

    // Spawn ship near dock
    const shipPos = new THREE.Vector3(0, 0, 20); // adjust dock coordinates
    this.shipSystem.spawnShip(shipPos);
    this.marketUI.style.display = "none";
  }
}
