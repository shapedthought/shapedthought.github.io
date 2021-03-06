document.getElementById('runForm').addEventListener('submit', e =>{

    e.preventDefault();
    //Inputs
    const sourceData = parseInt(document.getElementById('sourceData').value);
    const vmQuantity = parseInt(document.getElementById('vmQuantity').value);
    const fullBackupType = parseInt(document.getElementById('fullBackupType').value);
    const incrBackupType = parseInt(document.getElementById('incBackupType').value);
    const fullBackuptime = parseInt(document.getElementById('fullBackuptime').value);
    const increBackuptime = parseInt(document.getElementById('increBackuptime').value);
    const change = parseInt(document.getElementById('changeRate').value);
    const reduction = parseInt(document.getElementById('reduction').value);
    const growth = parseInt(document.getElementById('growth').value);
    const scope = parseInt(document.getElementById('scope').value);
    const block = parseInt(document.getElementById('block').value);

    //Outputs
    const cpuReqFull = document.getElementById('cpuReqFull');
    const ramReqFull = document.getElementById('ramReqFull');
    const cpuReqInc = document.getElementById('cpuReqInc');
    const ramReqInc = document.getElementById('ramReqInc');
    const fullMb = document.getElementById('fullMb');
    const incMb = document.getElementById('incMb');
    const iopsFull = document.getElementById('iopsFull');
    const iopsInc = document.getElementById('iopsInc');
    const iopsFullPr = document.getElementById('iopsFullPr');
    const iopsIncPr = document.getElementById('iopsIncPr');


    //Calculations
    //Capacity with growth
    const datawithGrowth = ((sourceData * ((100 - reduction) / 100)) * (1 + ((growth / 100) * scope )));

    //Backup server
    const backServCores = buCores(vmQuantity);
    const buRamDel = buRam(vmQuantity);


    //Proxy server

    //IO METHOD
    // Cores required for full backup T/100 >> IO Method
    const proxyCoresFull = fullCores(datawithGrowth, fullBackuptime);
    // Cores required for incremental backup (T X CR)/25
    const proxyCoresInc = increCores(datawithGrowth, increBackuptime, change);

    // Rule of thumb method for cores
    const rotCoresFull = Math.ceil(vmQuantity/30);

    // Throughput requirements
    const fullMbDel = ((datawithGrowth * Math.pow(1024, 2)) / (fullBackuptime * Math.pow(60, 2)));
    const incMbDel = (((datawithGrowth * Math.pow(1024, 2)) / (increBackuptime * Math.pow(60, 2)))*(change / 100));
    

    //Exports
    cpuReqFull.innerHTML = Math.ceil(proxyCoresFull + backServCores);
    cpuReqInc.innerHTML = Math.ceil(proxyCoresInc + backServCores);
    //Full RAM for both Backup server and Proxy
    if((buRamDel + (proxyCoresFull * 2)) < 8) {
        ramReqFull.innerHTML = 8;
    } else {
        ramReqFull.innerHTML = Math.ceil(buRamDel + (proxyCoresFull * 2));
    };
    //Inc RAM for both Backup server and Proxy
    if((buRamDel + (proxyCoresInc * 2)) < 8) {
        ramReqInc.innerHTML = 8;
    } else {
        ramReqInc.innerHTML = Math.ceil(buRamDel + (proxyCoresFull * 2));
    }

    
    // IO Calculations
    const rawFullIops = (fullMbDel * 1024) / block;
    const fullIopsWithOverhead = rawFullIops * fullBackupType;
    const rawIncrIops = (incMbDel * 1024) / block;
    const incrIopsWithOverhead = rawIncrIops * incrBackupType;


    fullMb.innerHTML = (fullMbDel).toFixed(2);
    incMb.innerHTML = (incMbDel).toFixed(2);


    iopsFull.innerHTML = (fullIopsWithOverhead).toFixed(2);
    iopsInc.innerHTML = (incrIopsWithOverhead).toFixed(2);
    iopsFullPr.innerHTML = (fullIopsWithOverhead * 6).toFixed(2);
    // Should really strip out those additional reads here...
    iopsIncPr.innerHTML = (incrIopsWithOverhead * 6).toFixed(2);

    });

function fullCores(sourceData, backupWindow) {
    const throughput = ((sourceData * Math.pow(1024, 2)) / (backupWindow * Math.pow(60, 2)));
    const cores = throughput / 100;
    return cores;
}

function increCores(sourceData, backupWindow, changeR) {
    const throughput = ((sourceData * Math.pow(1024, 2)) / (backupWindow * Math.pow(60, 2)));
    const changeR2 = changeR / 100;
    const cores = (throughput * changeR2) / 25;
    return cores;
}

function buCores(vmQuantity) {
    const jobs =  Math.ceil(vmQuantity / 30);
    const cpu = Math.ceil(jobs / 10);
    return cpu
}

function buRam(vmQuantity) {
    const jobs = Math.ceil(vmQuantity / 30);
    const ram = (Math.ceil(jobs / 10)) * 5;
    return ram;
}


//D= Source data in MB
//W= Backup window in seconds
//T= Throughput D/W
//CR= Change rate
//CF = Cores required for full backup T/100
//CI = Cores required for incremental backup (T X CR)/25
//For per job backup files: 30 VMs per job
//For per VM backup files: 300 VMs per job