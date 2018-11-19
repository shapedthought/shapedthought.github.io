// BUTTONS CLICK EVENTS

// Buttons
const setArray = document.querySelector('#setArray');
const addCacheBtn = document.querySelector("#addCacheBtn");
const addDiskBtn = document.querySelector("#addDiskBtn");
const resetBtn = document.querySelector("#resetBtn");
const exportBtn = document.querySelector("#exportBtn");


// Set array button
setArray.addEventListener("click",function(e) {
    let model = document.querySelector("#model").value;
    let dpe = document.querySelector("#dpe").value;
    let vault = document.querySelector("#vault").value;
    let shelf25 = document.querySelector("#shelf25").value;
    let shelf35 = document.querySelector("#shelf35").value;
  
    if(model.length === 0 || dpe.length === 0 || vault === 0) {
      alert('Enter values in the Array config drop downs');
    } else {
      addDisk("vault");
      addCacheBtn.disabled = false;
      addDiskBtn.disabled = false;
      setArray.disabled = true;
      document.querySelector("#model").disabled = true;
      document.querySelector("#dpe").disabled = true;
      document.querySelector("#vault").disabled = true;
      document.querySelector("#shelf25").disabled = true;
      document.querySelector("#shelf35").disabled = true;
      resetBtn.classList.remove('d-none');
    }; 
    e.preventDefault();
  });
  
  
  // Add cache button
  addCacheBtn.addEventListener("click", function(e) {
    // Check that values have been added to drop downs to avoid NaN
    let cache = document.querySelector("#cacheCurUp").value;
    let cDisk = document.querySelector("#cDiskSelect").value;
    if(cache.length === 0 || cDisk.length === 0) {
      // Need to change these to 
      alert('Enter values in cache drop downs')
    } else {
      let acDisks = parseInt(document.querySelector("#acDisks").value);
      if(acDisks % 2 === 0) {
        addDisk("cache");
      } else {
        alert('Cache value needs to be even!')
      };
    };
    e.preventDefault();
  });
  
  // Add disk button
  addDiskBtn.addEventListener("click", function(e) {
    // Check that values have been added to drop downs
    let disk = document.querySelector("#curUpgrade").value;
    let cDisk = document.querySelector("#diskSelect").value;
    if(disk.length === 0 || cDisk.length === 0){
      alert('Enter values in the disk drop downs');
    } else {
      addDisk("data");
    };
    e.preventDefault();
  });
  
  // Delete disk table icon
  document.querySelector("#diskTable").addEventListener("click", function(e) {
    if (e.target.classList.contains("delete-item")) {
      const idString = e.target.parentNode.parentNode.id;
      const idArr = idString.split("-");
      const id = parseInt(idArr[1]);
      deleteDisk(id);
    }
    e.preventDefault();
  });
  
  // Reset config
  resetBtn.addEventListener("click", function(e) {
    resetEverything();
    e.preventDefault();
  })

  // Export config
  exportBtn.addEventListener("click", exportConfig);