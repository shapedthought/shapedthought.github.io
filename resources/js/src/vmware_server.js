// Declare inputs here so I can use them again

var ghzRequired;
var coresRequired;
var ramRequired;
var growthPerYear;
var yearsInScope;
var haLevel;
var hostQty;
var cpuPerHost;
var coresPerCpu;
var ghzPerCore;
var ramPerHost;

document.getElementById('runForm').addEventListener('submit', e =>{

    e.preventDefault();
    //Inputs
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
    //Deliverables

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
    const ghzDif = (activeGhz - ghzWithGrowth).toFixed(2);
    const ramDif = activeRam - ramWithGrowth;

    //Output to DOM
    reqCoresOut.innerHTML = coresWithGrowth;
    delCoresOut.innerHTML = activeCores;
    coreDifOut.innerHTML = coreDif;
    reqGhzOut.innerHTML = ghzWithGrowth;
    delGhzOut.innerHTML = (activeGhz).toFixed(2);
    ghzDifOut.innerHTML = ghzDif;
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
});

var loadedData = {};

document.getElementById('upLoadConfig').addEventListener('click', ()=> {
    const loadedData = document.getElementById('serverConfig').value;
    try { 
        loadObject = JSON.parse(loadedData);
    } catch (e) {
        alert('Invalid JSON');
    } 
    console.log(typeof(loadObject));
    document.getElementById('ghzRequired').value = loadObject.requirement.currentGhz;
    document.getElementById('coresRequired').value = loadObject.requirement.currentCores;
    document.getElementById('ramRequired').value = loadObject.requirement.currentRam;
    document.getElementById('growthPerYear').value = loadObject.requirement.growth;
    document.getElementById('yearsInScope').value = loadObject.requirement.yearsInScope;
    document.getElementById('haLevel').value = loadObject.requirement.haLevel;
    document.getElementById('hostQty').value = loadObject.serverConfig.coresPerCpu;
    document.getElementById('cpuPerHost').value = loadObject.serverConfig.cpuPerHost;
    document.getElementById('coresPerCpu').value = loadObject.serverConfig.coresPerCpu;
    document.getElementById('ghzPerCore').value = loadObject.serverConfig.ghzPerCore;
    document.getElementById('ramPerHost').value = loadObject.serverConfig.ramPerHost;
});

var saveData = {};

document.getElementById('saveBtn').addEventListener('click', ()=> {
        // saveData.requirement.currentGhz = ghzRequired;
        // saveData.requirement.currentCores = coresRequired;
        // saveData.requirement.currentRam = ramRequired;
        // saveData.requirement.growth = growthPerYear;
        // saveData.requirement.yearsInScope = yearsInScope;
        // saveData.requirement.haLevel = haLevel;
        // saveData.serverConfig.quantyOfHosts = hostQty;
        // saveData.serverConfig.cpuPerHost = cpuPerHost;
        // saveData.serverConfig.coresPerCpu = coresPerCpu;
        // saveData.serverConfig.ghzPerCore = ghzPerCore;
        // saveData.serverConfig.ramPerHost = ramPerHost;
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
