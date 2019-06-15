
document.getElementById('runForm').addEventListener('submit', e =>{

    e.preventDefault();
    //Inputs
    const ghzRequired = parseInt(document.getElementById('ghzRequired').value);
    const coresRequired = parseInt(document.getElementById('coresRequired').value);
    var ramRequired = parseFloat(document.getElementById('ramRequired').value);
    const growthPerYear = parseInt(document.getElementById('growthPerYear').value);
    const yearsInScope = parseInt(document.getElementById('yearsInScope').value);
    const haLevel = parseInt(document.getElementById('haLevel').value);
    const hostQty = parseInt(document.getElementById('hostQty').value);
    const cpuPerHost = parseInt(document.getElementById('cpuPerHost').value);
    const coresPerCpu = parseInt(document.getElementById('coresPerCpu').value);
    const ghzPerCore = parseFloat(document.getElementById('ghzPerCore').value);
    const ramPerHost = parseInt(document.getElementById('ramPerHost').value);

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

    //Host Spec
    const totalHostsOut = document.getElementById('totalHostsOut');
    const cpuPerHostOut = document.getElementById('cpuPerHostOut');
    const ghzPerCoreOut = document.getElementById('ghzPerCoreOut');
    const ramPerHostOut = document.getElementById('ramPerHostOut');

    //Calculations
    // Check if RAM is in TiB or GiB
    if (ramRequired < 10) {
        ramRequired = (ramRequired * 1024).toFixed(2)
    };


    //Requirements plus growth
    const growthFactor = (yearsInScope * (growthPerYear / 100)) + 1;
    const ghzWithGrowth = ghzRequired * growthFactor;
    const coresWithGrowth = coresRequired * growthFactor;
    const ramWithGrowth = (ramRequired * growthFactor).toFixed(2);

    // Host deliverables
    const activeHosts = hostQty - haLevel;
    const activeCpu = activeHosts * cpuPerHost;
    const activeCores = activeCpu * coresPerCpu;
    const activeGhz = activeCores * ghzPerCore;
    const activeRam = activeHosts * ramPerHost;

    //Overheads
    const coreDif = (activeCores - coresWithGrowth).toFixed(2);
    const ghzDif = (activeGhz - ghzWithGrowth).toFixed(2);
    const ramDif = (activeRam - ramWithGrowth).toFixed(2);

    //Output to DOM
    reqCoresOut.innerHTML = coresWithGrowth;
    delCoresOut.innerHTML = activeCores;
    coreDifOut.innerHTML = coreDif;
    reqGhzOut.innerHTML = ghzWithGrowth;
    delGhzOut.innerHTML = activeGhz;
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
});