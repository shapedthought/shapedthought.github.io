// ADD DISKS TO ARRAY!


function addDisk(type) {

  // Disk type
  // Add new new if statment for vault disk type
  let diskType = "";
  let curUpgrade = "";
  let diskSelect = "";
  let aDisks = "";
  let sDisks = "";
  if (type === "cache") {
    diskType = "cache";
    curUpgrade = document.querySelector("#cacheCurUp").value;
    diskSelect = document.querySelector("#cDiskSelect").value;
    aDisks = parseInt(document.querySelector("#acDisks").value);
    sDisks = parseInt(document.querySelector("#scDisks").value);
    aDisks = Number.isNaN(aDisks) ? 0 : aDisks;
    sDisks = Number.isNaN(sDisks) ? 0 : sDisks;
  } else if(type === "data") {
    diskType = "data";
    curUpgrade = document.querySelector("#curUpgrade").value;
    diskSelect = document.querySelector("#diskSelect").value;
    aDisks = parseInt(document.querySelector("#aDisks").value);
    sDisks = parseInt(document.querySelector("#sDisks").value);
    aDisks = Number.isNaN(aDisks) ? 0 : aDisks;
    sDisks = Number.isNaN(sDisks) ? 0 : sDisks;
  } else if(type === "vault") {
    diskType = "vault";
    curUpgrade = "false";
    let vaultGrab = document.querySelector("#vault").value;
    let dpeGrab = document.querySelector("#dpe").value;
    let dpeToSize = (dpeGrab === "25")? "2.5" : "3.5";
    diskSelect = `${vaultGrab}-${dpeToSize}`;
    aDisks = 4;
    sDisks = 0;
  };




  // Assign ID
  let ID;
  if (disksArr.length > 0) {
    ID = disksArr[disksArr.length - 1].id + 1;
  } else {
    ID = 0;
  };

  // Extract disk cap, speed and size from string in option value
  const diskArr = diskSelect.split("-");
  const diskCap = diskArr[0];
  const diskSpeed = diskArr[1];
  const diskSize = diskArr[2];

  // Create new disk object
  const newDisk = new Disk(
    ID,
    aDisks,
    sDisks,
    diskCap,
    diskSpeed,
    diskSize,
    diskType,
    curUpgrade
  );

  // Check if disk is in array or not and add values if it is
  let objQty = 0;
  for (i in disksArr) {
    if (
      disksArr[i].upgrade === newDisk.upgrade &&
      disksArr[i].capacity === newDisk.capacity &&
      disksArr[i].speed === newDisk.speed &&
      disksArr[i].size === newDisk.size &&
      disksArr[i].use === newDisk.use
    ) {
      disksArr[i].aQty += newDisk.aQty;
      disksArr[i].hQty += newDisk.hQty;
    } else {
      // If it doesn't match add 1 to objQty varable
      objQty += 1;
    }
  }
  // Checks to see if the objQty varable matches the length of the array
  // If it does it adds the new disk to the array
  if (objQty === disksArr.length) {
    disksArr.push(newDisk);
  };

  // Updates the table in the DOM
  diskTableUpdate();

  // Checks what type of disk it is then runs the appropriate function
  if(newDisk.upgrade === "false"){
  // Updates the current config totals
  updateOutputs(false);
  } else if(newDisk.upgrade === "true"){
  // Update upgrade totals
  upDateUpgrade();
  }

  // Show alert
  showAlert('Disk Added', 'text-center alert alert-success mt-2')




};


// REMOVE DISKS FROM ARRAY

function deleteDisk(id) {
  //Maps array and returns only ids
  const getId = disksArr.map(function(item) {
    return item.id;
  });

  // Looks for the index of the id passed in from the click
  const index = getId.indexOf(id);

  // Splices out the item at the index
  disksArr.splice(index, 1);

  // Updates the current totals
  updateOutputs(false);

  // Update upgrade totals
  upDateUpgrade();

  // Redraws the table
  diskTableUpdate();

  const diskNumber = index + 1;

  // Show alert
  showAlert(`Disk ${diskNumber} deleted`, 'text-center alert alert-danger mt-2')

};


// RESETS THE WHOLE DAMN THING
function resetEverything(){
  disksArr = [];
  document.querySelector("#model").disabled = false;
  document.querySelector("#dpe").disabled = false;
  document.querySelector("#vault").disabled = false;
  document.querySelector("#shelf25").disabled = false;
  document.querySelector("#shelf35").disabled = false;
  document.querySelector("#configForm").reset();
  loadBtn.disabled = true;
  addCacheBtn.disabled = true;
  addDiskBtn.disabled = true;
  setArray.disabled = false;
  lo
  resetBtn.classList.add('d-none');
  // Updates the html table
  diskTableUpdate();

  // Resets the html outputs
  resetOutputs();
};




