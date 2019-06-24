// Declare input values here so I can use them again

let ghzRequired;
let coresRequired;
let ramRequired;
let growthPerYear;
let yearsInScope;
let haLevel;
let hostQty;
let cpuPerHost;
let coresPerCpu;
let ghzPerCore;
let ramPerHost;

// set inputs- value- used with loading from storage and upload but not the main function yet
function setInputs (inputObject) {
    document.getElementById('ghzRequired').value = inputObject.requirement.currentGhz;
    document.getElementById('coresRequired').value = inputObject.requirement.currentCores;
    document.getElementById('ramRequired').value = inputObject.requirement.currentRam;
    document.getElementById('growthPerYear').value = inputObject.requirement.growth;
    document.getElementById('yearsInScope').value = inputObject.requirement.yearsInScope;
    document.getElementById('haLevel').value = inputObject.requirement.haLevel;
    document.getElementById('hostQty').value = inputObject.serverConfig.quantyOfHosts;
    document.getElementById('cpuPerHost').value = inputObject.serverConfig.cpuPerHost;
    document.getElementById('coresPerCpu').value = inputObject.serverConfig.coresPerCpu;
    document.getElementById('ghzPerCore').value = inputObject.serverConfig.ghzPerCore;
    document.getElementById('ramPerHost').value = inputObject.serverConfig.ramPerHost;
}


// Checks local storage to see if a config has been stored previously and loads
document.addEventListener('DOMContentLoaded', function() {
    if(localStorage.getItem('config') === null) {
        console.log('No data in local storage');
    } else {
        const lastConfig = JSON.parse(localStorage.getItem('config'));
        setInputs(lastConfig);
    }
});

// form event listener
document.getElementById('runForm').addEventListener('submit', e =>{

    e.preventDefault();
    runCal();

});

// global scope 
let beenRun = false;

function runCal() {
 //Inputs- need to do something with this
 ghzRequired = parseInt(document.getElementById('ghzRequired').value);
 coresRequired = parseInt(document.getElementById('coresRequired').value);
 ramRequired = parseFloat(document.getElementById('ramRequired').value);
 growthPerYear = parseInt(document.getElementById('growthPerYear').value);
 yearsInScope = parseInt(document.getElementById('yearsInScope').value);
 haLevel = parseInt(document.getElementById('haLevel').value);
 hostQty = parseInt(document.getElementById('hostQty').value);
 cpuPerHost = parseInt(document.getElementById('cpuPerHost').value);
 coresPerCpu = parseInt(document.getElementById('coresPerCpu').value);
 ghzPerCore = parseFloat(document.getElementById('ghzPerCore').value);
 ramPerHost = parseInt(document.getElementById('ramPerHost').value);

 //Outputs
 //Deliverables- got this twice, need to reduce

 const reqCoresOut = document.getElementById('reqCoresOut');
 const delCoresOut = document.getElementById('delCoresOut');
 const coreDifOut = document.getElementById('coreDifOut');

 const reqGhzOut = document.getElementById('reqGhzOut');
 const delGhzOut = document.getElementById('delGhzOut');
 const ghzDifOut = document.getElementById('ghzDifOut');

 const reqRamOut = document.getElementById('reqRamOut');
 const delRamOut = document.getElementById('delRamOut');
 const ramDifOut = document.getElementById('ramDifOut');

 //Calculations
 // Check if RAM is in TiB or GiB
 if (ramRequired < 10) {
     ramRequired = (ramRequired * 1024).toFixed(2)
 };

 //Requirements plus growth
 const growthFactor = (yearsInScope * (growthPerYear / 100)) + 1;
 const ghzWithGrowth = Math.ceil(ghzRequired * growthFactor);
 const coresWithGrowth = Math.ceil(coresRequired * growthFactor);
 const ramWithGrowth = Math.ceil((ramRequired * growthFactor).toFixed(2));

 // Host deliverables
 const activeHosts = hostQty - haLevel;
 const activeCpu = activeHosts * cpuPerHost;
 const activeCores = activeCpu * coresPerCpu;
 const activeGhz = activeCores * ghzPerCore;
 const activeRam = activeHosts * ramPerHost;

 //Overheads
 const coreDif = activeCores - coresWithGrowth;
 const ghzDif = activeGhz - ghzWithGrowth;
 const ramDif = activeRam - ramWithGrowth;

 //Output to DOM
 reqCoresOut.innerHTML = coresWithGrowth;
 delCoresOut.innerHTML = activeCores;
 coreDifOut.innerHTML = coreDif;
 reqGhzOut.innerHTML = ghzWithGrowth;
 delGhzOut.innerHTML = (activeGhz).toFixed(2);
 ghzDifOut.innerHTML = (ghzDif).toFixed(2);
 reqRamOut.innerHTML = ramWithGrowth;
 delRamOut.innerHTML = activeRam;
 ramDifOut.innerHTML = ramDif;

 // checks
 coreDifOut.classList.remove("text-danger");
 ghzDifOut.classList.remove("text-danger");
 ramDifOut.classList.remove("text-danger");
 if(coreDif < 0) { coreDifOut.classList.add("text-danger")};
 if(ghzDif < 0) { ghzDifOut.classList.add("text-danger")};
 if(ramDif < 0) { ramDifOut.classList.add("text-danger")};

 // Enables the save button
 document.getElementById('saveBtn').disabled = false;

 // Toggles on the clear button if it hasn't been run before
 if(!beenRun) {
     document.getElementById('clearButton').classList.toggle('d-none')
     beenRun = true
 }

 //create a saveData object to be stored in local storage- saves this globally below
 saveData = { requirement:
     {currentGhz: ghzRequired, 
     currentCores: coresRequired, 
     currentRam: ramRequired, 
     growth: growthPerYear, 
     yearsInScope: yearsInScope, 
     haLevel: haLevel}, 
         serverConfig:
     {quantyOfHosts: hostQty,
     cpuPerHost: cpuPerHost,
     coresPerCpu: coresPerCpu,
     ghzPerCore: ghzPerCore,
     ramPerHost: ramPerHost} 
         };

 // save object to local storage
 localStorage.setItem('config', JSON.stringify(saveData));
}

// varible with save data held after tool is run
let saveData = {};

// varible with config data once the data has been loaded
let loadedData = {};

// Event listener on the upload buton, pulls data from 
document.getElementById('upLoadConfig').addEventListener('click', ()=> {  
    const loadedData = document.getElementById('serverConfig').value;
    try { 
        loadObject = JSON.parse(loadedData);
        setInputs(loadObject)
        Swal.fire({
            type: 'success',
            title: 'Success',
            text: 'Configuration Loaded!',
          });
          runCal();
    } catch (e) {
        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Invalid JSON!',
          });
    } 
   

});

// Deletes the previous config input, works on the load click
document.getElementById('loadBtn').addEventListener('click', ()=> {
    document.getElementById('serverConfig').value = '';
})



//Outputs the saveData object to a input box
document.getElementById('saveBtn').addEventListener('click', ()=> {

        saveData = { requirement:
                                {currentGhz: ghzRequired, 
                                currentCores: coresRequired, 
                                currentRam: ramRequired, 
                                growth: growthPerYear, 
                                yearsInScope: yearsInScope, 
                                haLevel: haLevel}, 
                        serverConfig:
                                {quantyOfHosts: hostQty,
                                cpuPerHost: cpuPerHost,
                                coresPerCpu: coresPerCpu,
                                ghzPerCore: ghzPerCore,
                                ramPerHost: ramPerHost}
                    };
    document.getElementById('saveOut').innerHTML = JSON.stringify(saveData);
});

// Copy button listener
document.getElementById('copyBtn').addEventListener('click', ()=> {
    var copyText = document.getElementById('saveOut');
    copyText.select();
    document.execCommand('copy');
    Swal.fire({
        type: 'success',
        title: 'Success',
        text: 'Data Copied to Clipboard',
      });
});

// clear button
document.getElementById('clearButton').addEventListener('click', ()=>{
    document.getElementById('runForm').reset();
    localStorage.clear();
    document.getElementById('clearButton').classList.toggle('d-none');
    document.getElementById('reqCoresOut').innerHTML = '';
    document.getElementById('delCoresOut').innerHTML = '';
    document.getElementById('coreDifOut').innerHTML = '';

    document.getElementById('reqGhzOut').innerHTML = '';
    document.getElementById('delGhzOut').innerHTML = '';
    document.getElementById('ghzDifOut').innerHTML = '';

    document.getElementById('reqRamOut').innerHTML = '';
    document.getElementById('delRamOut').innerHTML = '';
    document.getElementById('ramDifOut').innerHTML = '';
})