// Outputs

// Calculations

let rem25slots;
let rem35slots;
let arrayTotal;
let total25disks;
let total35disks;
let total25slots;
let total35slots;
let totalSlots

// Sets the configured array maximums
function updateOutputs(load) {

    if(load === false) {
      arrayTotal = parseInt(document.querySelector("#model").value);
      var dpe = parseInt(document.querySelector("#dpe").value); //value is disk quantity
      var shelf25 = parseInt(document.querySelector("#shelf25").value);
      var shelf35 = parseInt(document.querySelector("#shelf35").value);
      var arrayOut = modelName;
    } else if(load === true) {
      arrayTotal = parseInt(inputData.cConfig.maxDisk);
      var vault = inputData.cConfig.vault;
      var dpe = parseInt(inputData.cConfig.dpe);
      var shelf25 = parseInt(inputData.cConfig.dae25);
      var shelf35 = parseInt(inputData.cConfig.dae35);
      var arrayOut = inputData.cConfig.model;
      cConfig = new currentConfig(arrayOut, arrayTotal, dpe, vault, shelf25, shelf35);
    } 


    // Current configuration
    //Inputs

    // Sets the total configured slots >> NOTE: totals are not GLOBAL
    shelf25 = Number.isNaN(shelf25) ? 0 : shelf25;
    shelf35 = Number.isNaN(shelf35) ? 0 : shelf35;

 
    // Grab disk totals (current)
    total25disks = totalDiskSize("2.5", "false");
    total35disks = totalDiskSize("3.5", "false");

  
    // Grab disk totals from array
    total25slots = 0;
    total35slots = 0;
    if(dpe === 25) {
      total25slots = dpe + (shelf25 * 25);
      total35slots = shelf35 * 15;
    } else {
      total25slots = shelf25 * 25;
      total35slots = dpe + (shelf35 * 15);
    };

    // Current config calculations
    totalSlots = dpe + (shelf25 * 25) + (shelf35 * 15);
    let remSlots = arrayTotal - totalSlots;
    let totalConfigDisks = total25disks + total35disks;
    rem25slots = total25slots - total25disks;
    rem35slots = total35slots - total35disks;


    // Alert if over max config (current)
    if(remSlots <= 0){ 
      $.alert({
        title: 'System is over maximum!',
        content: 'Better check your sums...'
      })
    }


    //Outputs
    document.querySelector("#modelOut").innerHTML = arrayOut;
    document.querySelector("#dpeSizeOut").innerHTML = dpe;
    document.querySelector("#dae25Out").innerHTML = shelf25;
    document.querySelector("#dae35Out").innerHTML = shelf35;
    document.querySelector("#maxDiskOut").innerHTML = arrayTotal;
    document.querySelector("#currConfigSlots").innerHTML = totalSlots;
    document.querySelector("#currConfigDisks").innerHTML = totalConfigDisks;
    document.querySelector("#total25slots").innerHTML = total25slots;
    document.querySelector("#total25disks").innerHTML = total25disks;
    document.querySelector("#remain25slots").innerHTML = rem25slots;
    document.querySelector("#total35slots").innerHTML = total35slots;
    document.querySelector("#total35disks").innerHTML = total35disks;
    document.querySelector("#remain35slots").innerHTML = rem35slots;
    document.querySelector("#remConfigSlots").innerHTML = remSlots;



};



let exportText = '';

function upDateUpgrade() {

  // Upgrade configuration
    // Grab disk totals (upgrade)
    let total25disksUp = totalDiskSize("2.5", "true");
    let total35disksUp = totalDiskSize("3.5", "true");
    let totalDisksUp = total25disksUp + total35disksUp;
    let totalShelves25Up = 0;
    let totalShelves35Up = 0;
    let totalAddSlots25 = 0;
    let totalAddSlots35 = 0;

    // Additional slots required minus existing slots &
    //2.5 shelves required
    // If the total upgrade disks is less than one or the total 
    if(total25disksUp < 1 || (total25disksUp - rem25slots) < 1) {
      totalAddSlots25 = 0;
    } else {
      let req25slots = total25disksUp - rem25slots; 
      totalShelves25Up = Math.ceil(req25slots / 25);
      totalAddSlots25 = totalShelves25Up * 25;
    }

    
    //3.5 shelves required
    if(total35disksUp < 1 || (total35disksUp - rem35slots) < 1){
      totalAddSlots35 = 0;
    } else {
      let req35slots = total35disksUp - rem35slots;
      totalShelves35Up = Math.ceil(req35slots / 15);
      totalAddSlots35 = totalShelves35Up * 15; 
    }
    


    // New total slots
    let newTotalSlots = totalSlots + totalAddSlots25 + totalAddSlots35

    // Remaining slots 
    // 2.5
    let newTotal25slot = total25slots + totalAddSlots25;
    let newRem25slots = newTotal25slot - (total25disks + total25disksUp);
    // 3.5
    let newTotal35slot = total35slots + totalAddSlots35;
    let newRem35slots = newTotal35slot - (total35disks + total35disksUp);

    // Remaining upgrades
    let remSlotUpgrades = arrayTotal - newTotalSlots;

    //Alert 
    if(newTotalSlots > arrayTotal) { 
      // alert("BUST!!!")
      $.alert({
        title: 'System is over maximum!',
        content: 'Better check your sums...'
      })
    }

    //Outputs
    document.querySelector("#currConfigDisksUp").innerHTML = totalDisksUp;
    document.querySelector("#newShelves25").innerHTML = totalShelves25Up;
    document.querySelector("#newShelves35").innerHTML = totalShelves35Up;
    document.querySelector("#total25slotsUp").innerHTML = totalAddSlots25;
    document.querySelector("#total25disksUp").innerHTML = total25disksUp;
    document.querySelector("#remain25slotsUp").innerHTML = newRem25slots;
    document.querySelector("#total35slotsUp").innerHTML = totalAddSlots35;
    document.querySelector("#total35disksUp").innerHTML = total35disksUp;
    document.querySelector("#remain35slotsUp").innerHTML = newRem35slots;
    document.querySelector("#currConfigSlotsUp").innerHTML = newTotalSlots;
    document.querySelector("#remConfigSlotsUp").innerHTML = remSlotUpgrades;

    exportText = `
    Total new disks: ${totalDisksUp}
    Total new 2.5" 25x shelves: ${totalShelves25Up}
    New 2.5" slots: ${totalAddSlots25}
    New 2.5" disks: ${total25disksUp}
    Free 2.5" slots: ${newRem25slots}
    Total new 3.5" 15x shelves: ${totalShelves35Up}
    New 3.5" slots: ${totalAddSlots35}
    New 3.5" disks: ${total35disksUp}
    Free 3.5" slots: ${newRem35slots}
    Total configured slots: ${newTotalSlots}
    Slots that can be added: ${remSlotUpgrades}
    `


};




function resetOutputs(){
  document.querySelector("#maxDiskOut").innerHTML = 
    document.querySelector("#currConfigSlots").innerHTML = "";
    document.querySelector("#currConfigDisks").innerHTML = "";
    document.querySelector("#total25slots").innerHTML = "";
    document.querySelector("#total25disks").innerHTML = "";
    document.querySelector("#remain25slots").innerHTML = "";
    document.querySelector("#total35slots").innerHTML = "";
    document.querySelector("#total35disks").innerHTML = "";
    document.querySelector("#remain35slots").innerHTML = "";
    document.querySelector("#remConfigSlots").innerHTML = "";

    document.querySelector("#currConfigDisksUp").innerHTML = "";
    document.querySelector("#newShelves25").innerHTML = "";
    document.querySelector("#newShelves35").innerHTML = "";
    document.querySelector("#total25slotsUp").innerHTML = "";
    document.querySelector("#total25disksUp").innerHTML = "";
    document.querySelector("#remain25slotsUp").innerHTML = "";
    document.querySelector("#total35slotsUp").innerHTML = "";
    document.querySelector("#total35disksUp").innerHTML = "";
    document.querySelector("#remain35slotsUp").innerHTML = "";
    document.querySelector("#currConfigSlotsUp").innerHTML = "";
    document.querySelector("#remConfigSlotsUp").innerHTML = "";
}


// Total disk size function
function totalDiskSize(size, upgrade) {
  let total = 0;
  for (i in disksArr) {
    if (disksArr[i].size === size && disksArr[i].upgrade === upgrade) {
      total += disksArr[i].aQty;
      total += disksArr[i].hQty;
    };
  };
  return total;
};



// Add disks to table

function diskTableUpdate() {
  let html = "";

  disksArr.forEach(item => {
    html += `<tr id="itemId-${item.id}">
                 <td>${item.use}</td>   
                 <td>${item.aQty}</td>
                 <td>${item.hQty}</td> 
                 <td>${item.size}</td>
                 <td>${item.capacity}</td>
                 <td>${item.speed}</td>
                 <td>${item.upgrade}</td>
                 <td><i class="fa fa-trash-alt delete-item"></i></td>
                 </tr>
                 `;
  });
  // Insert disk times into table
  document.querySelector("#diskTable").innerHTML = html;
}



// // Show alert
// function showAlert(message, className) {
//   const div = document.createElement('div');

//   // Add classes
//   div.className = className;

//   // Add text
//   div.appendChild(document.createTextNode(message));

//   // Get parent
//   const disksAlrt = document.querySelector('.disk-alert');
//   disksAlrt.appendChild(div);

//   console.log(div);

//   // Time out
//   setTimeout(() => {
//     clearAlert();
//   }, 1000);
// }

// // clear alert
// function clearAlert() {
//   const currentAlert = document.querySelector('.alert');
//   if(currentAlert) {
//     currentAlert.remove();
//   }

// }



// Save config
function saveConfig() { 
  const allOut = {cConfig, disksArr};
  return allOut
}

