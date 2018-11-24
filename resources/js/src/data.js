// DATA STRUCTURE!!

// Disk constructor

const Disk = function(id, aQty, hQty, capacity, speed, size, use, upgrade) {
    this.id = id;
    this.aQty = aQty;
    this.hQty = hQty;
    this.capacity = capacity;
    this.speed = speed;
    this.size = size;
    this.use = use;
    this.upgrade = upgrade;
  };
  
  // Disks array
  
  let disksArr = [];

  // Current configuration class

class currentConfig {
  constructor(model, maxDisk, dpe, vault, dae25, dae35) {
    this.model = model;
    this.maxDisk = maxDisk;
    this.dpe = dpe;
    this.vault = vault; 
    this.dae25 = dae25; 
    this.dae35 = dae35;
  };
}

