//Load modal, yes I know it's jQuery!
// $(document).ready(function(){
// 	$('#myModal').modal('show');
// });

//PIE CHART
let myChart = document.getElementById("myChart").getContext("2d");

let vsanChart = new Chart(myChart, {
  type: "doughnut",
  data: {
    labels: ["format & checksum", "Slack", "FTT Overhead", "Useable", "Effective"],
    datasets: [{
      label: "Capacity ratio",
      data: [5, 30, 75, 75, 0],
      backgroundColor: ["#d3d3d3", "#e29b3d", "#5276d9", "#4cc44a", "#e5ef8b"],
      borderWidth: 1
    }]
  },
  options: {
    title: {
      display: true,
      text: "Capacity delivered"
    }
  }
});


//FTT CHECKS//

//Update the FTT options based on flash or hybrid

document.querySelector('#nodeType').addEventListener("change", runFtt);

//Sets current FTT node state (flash/hybrid)
let nodeTypeSelect = 1;
let fttReduction = 1; //Actual reduction level

//Changes the DOM options and updates the selected node type if needed
function runFtt() {
	document.querySelector('#fttHybrid').classList.toggle('d-none');
	document.querySelector('#fttFlash').classList.toggle('d-none');
	document.querySelector('#showDedup').classList.toggle('d-none');
	nodeTypeSelect = nodeTypeSelect === 1 ? 2 : 1;
}

//Current host qty requirements
//The way I've set up the flash vs hybrid drop downs makes this tricky!
let hybridHostsReq = 3;
let flashHostsReq = 3;
let fttHybridCheck = 2;
let fttFlashCheck = 2;
let currentHostReq = 3;

//Watches for a change to the node type
document.querySelector('#fttHybridValue').addEventListener('change', function hostQtyUpdate() {
	//If the hybrid node type is selected
	fttHybridCheck = parseFloat(document.querySelector('#fttHybridValue').value);
	//Run the FTT value through the ffttHostCheck function, returns min host quantity
	hybridHostsReq = fttHostCheck(fttHybridCheck);
	//If the node selected is hybrid then update the min host quantity varable
	if (nodeTypeSelect === 1) {
		currentHostReq = hybridHostsReq
	}
});

document.querySelector('#fttFlashValue').addEventListener('change', function hostQtyUpdate() {
	fttFlashCheck = parseFloat(document.querySelector('#fttFlashValue').value);
	flashHostsReq = fttHostCheck(fttFlashCheck);
	if (nodeTypeSelect === 2) {
		currentHostReq = flashHostsReq
	}
});

//Host check function, translates ftt reduction to host minimum host quatity
function fttHostCheck(reductionValue) {
	if (reductionValue === 2) {
		return 3;
	} else if (reductionValue === 3) {
		return 5;
	} else if (reductionValue === 4) {
		return 7;
	} else if (reductionValue === 1.33) {
		return 4;
	} else if (reductionValue === 1.5) {
		return 6;
	} else {
		alert('ftt calculation failed!')
	}
}

//SETTINGS MODAL

//Add current values to modal on click

document.querySelector('#settingsButton').addEventListener("click", settingsUpdate);

let baseC = 5426;
let dgBaseCon = 636;
let ssdBaseMemOh = 14;
let hybBaseMemOh = 8;
let capDiskBaseCon = 70;
let slackSpace = 30;
let diskFormat = 1.2;

function settingsUpdate() {
	document.querySelector('#slackSpace').value = slackSpace;
	document.querySelector('#dgBaseConsumption').value = dgBaseCon;
	document.querySelector('#formattingOverhead').value = diskFormat;
	document.querySelector('#baseConsumption').value = baseC;
	document.querySelector('#SSDMemOverheadPerGiB').value = ssdBaseMemOh;
	document.querySelector('#HDDMemOverheadPerGiB').value = hybBaseMemOh;
	document.querySelector('#capDiskBaseConsumption').value = capDiskBaseCon;
};


//Save Changes to settings

document.querySelector('#saveSettings').addEventListener("click", saveSettings);

function saveSettings() {
	slackSpace = parseInt(document.querySelector('#slackSpace').value);
	dgBaseCon = parseInt(document.querySelector('#dgBaseConsumption').value);
	diskFormat = parseFloat(document.querySelector('#formattingOverhead').value);
	baseC = parseInt(document.querySelector('#baseConsumption').value);
	ssdBaseMemOh = parseInt(document.querySelector('#SSDMemOverheadPerGiB').value);
	hybBaseMemOh = parseInt(document.querySelector('#HDDMemOverheadPerGiB').value);
	capDiskBaseCon = parseInt(document.querySelector('#capDiskBaseConsumption').value);
}


//SUBMIT CALCULATION

//Submit function

document.querySelector('#submit').addEventListener('click', hostQtyCheck);


//FTT vs Host >> checks that the minimum hosts have been sepcified
function hostQtyCheck() {
	const hostQuantity = parseInt(document.querySelector('#hostQuantity').value);
	if (hostQuantity < currentHostReq) {
		document.querySelector('#hostQuantity').classList.add('is-invalid');
		document.querySelector('#hostFeedback').classList.remove('hidden');
		alert('Check host Qty!');
	} else {
		document.querySelector('#hostQuantity').classList.remove('is-invalid');
		document.querySelector('#hostFeedback').classList.add('hidden');
		runCal();
	}
}



//Run calculation function
function runCal() {


	//VM Requirements inputs
	const vcpuReq = parseInt(document.querySelector('#vcpuReq').value);
	const ramReq = parseInt(document.querySelector('#ramReq').value);


	//Host Qty
	hostQuantity = parseInt(document.querySelector('#hostQuantity').value);

	//Host config inputs
	const overcommit = parseInt(document.querySelector('#overcommit').value);
	const hostRedundancy = parseInt(document.querySelector('#hostRedundancy').value);
	const corePerProcessor = parseInt(document.querySelector('#corePerProcessor').value);
	const processorsPerHost = parseInt(document.querySelector('#processorsPerHost').value);
	const ramPerHost = parseInt(document.querySelector('#ramPerHost').value);

	//vSAN inputs
	fttReduction = 1; //resets the fttreduction variable in the function
	//checks the current node type selected and changes it back to 1 if hybrid (not zero as that messes up the calculation)
	if (nodeTypeSelect === 1) {
		document.querySelector('#dedupFactor').value = 1;
	};

	//Sets the function variable to the selected FTT capacity reduction setting 
	if (nodeTypeSelect === 1) {
		fttReduction = parseFloat(document.querySelector('#fttHybridValue').value);
	} else {
		fttReduction = parseFloat(document.querySelector('#fttFlashValue').value);
	}

	//vSAN inputs
	const capacityRequired = parseInt(document.querySelector('#capacityRequired').value);
	const diskGroupQtyPerHost = parseInt(document.querySelector('#diskGroupQtyPerHost').value);
	const dataDisksPerDiskGroup = parseInt(document.querySelector('#dataDisksPerDiskGroup').value);
	const cacheCapacity = parseInt(document.querySelector('#cacheCapacity').value);
	const dataDiskCapacity = parseInt(document.querySelector('#dataDiskCapacity').value);
	const dedupFactor = parseFloat(document.querySelector('#dedupFactor').value); //updates the dedup factor

	//Show alert if cache disk in udner 600GB
	if (cacheCapacity > 600) {
		$('#cacheAlert').show('fade'); //yes I know more jQuery...
	}

	//Resets the base memory overhead
	let baseMemOh = 0;

	//Sets RAM overhead
	if (nodeTypeSelect === 1) {
		baseMemOh = hybBaseMemOh;
	} else {
		baseMemOh = ssdBaseMemOh;
	}

	//Calculates the base memory overhead for the current design
	const ramOverhead = (baseC + (diskGroupQtyPerHost * (dgBaseCon + (baseMemOh * cacheCapacity))) + (dataDisksPerDiskGroup * capDiskBaseCon)) * hostQuantity;

	//Host deliverable calculations
	//vCPU
	const coresReq = (vcpuReq / overcommit);
	document.querySelector('#coresReqOutput').innerText = coresReq;


	const delCores = (hostQuantity - hostRedundancy) * (processorsPerHost * (corePerProcessor * 0.9));
	document.querySelector('#coresDelOutput').innerText = delCores;
	const coresDiff = (delCores - coresReq).toFixed(2);
	document.querySelector('#coresDiffOutput').innerText = coresDiff;
	if (coresDiff < 0) {
		document.querySelector('#coresDiffOutput').classList.add('text-danger');
	} else {
		document.querySelector('#coresDiffOutput').classList.remove('text-danger');
	}

	//RAM
	const ramPlusOh = (ramReq + (ramOverhead / 1024)).toFixed(2); //Added RAM overhead (as total)
	document.querySelector('#ramReqOutput').innerText = ramPlusOh + " GiB";
	const delRam = (hostQuantity - hostRedundancy) * ramPerHost;
	document.querySelector('#ramDelOutput').innerText = delRam + " GiB";



	const ramDiff = (delRam - ramPlusOh).toFixed(2);
	document.querySelector('#ramDiffOutput').innerText = ramDiff + " GiB";
	if (ramDiff < 0) {
		document.querySelector('#ramDiffOutput').classList.add('text-danger');
	} else {
		document.querySelector('#ramDiffOutput').classList.remove('text-danger');
	}

	//vSAN capacity calculation, uses the fttCapCal function
	document.querySelector('#capReqOutput').innerText = capacityRequired + " TiB";
	const rawCap = ((hostQuantity * (diskGroupQtyPerHost * dataDisksPerDiskGroup)) * dataDiskCapacity) / 1024;
	const capDelivered = fttCapCal(rawCap, diskFormat, slackSpace, fttReduction, dedupFactor);
	document.querySelector('#capDelOutput').innerText = capDelivered + " TiB";
	document.querySelector('#capDiffOutput').innerText = (capDelivered - capacityRequired).toFixed(2) + " TiB";
	if ((capDelivered - capacityRequired) < 0) {
		document.querySelector('#capDiffOutput').classList.add('text-danger');
	} else {
		document.querySelector('#capDiffOutput').classList.remove('text-danger');
	}

	//Cache percentage cal and output
	totalCacheOutput
	const totalCache = ((cacheCapacity * (hostQuantity - hostRedundancy)) / 1024).toFixed(2)
	document.querySelector('#totalCacheOutput').innerText = totalCache + " TiB";
	document.querySelector('#cachePercentOutput').innerText =  ((totalCache / capDelivered)*100).toFixed(2) + " %";
}


//vSAN capacity function
function fttCapCal(rawCap, format, slack, ftt, dedup) {
	const checksums = dedup === 1 ? 0.12 :  1.2;
    const overHead = (1 - ((format + slack + checksums) / 100));

	const capLessOh = (rawCap * overHead);
	const postFtt = capLessOh / ftt;
	const postDedup = postFtt * dedup;

		//Console log 
	console.log("vSAN Sizing steps");
	console.log("raw cap: " + rawCap + "TiB, format: " + format + "%, slack: " + slack + "%, ftt: " + ftt + " dedup: " + dedup + ": 1" + " checksums: " + checksums + "%");
	console.log("Capacity with overhead reduction: " + (capLessOh).toFixed(2));
	console.log("Capacity post FTT reduction: " + (postFtt).toFixed(2) + " TiB");
	console.log("Capacity with dedup factor: " + (postDedup).toFixed(2) + "TiB");


	console.log("<<<==== Capacity Breakdown ====>>>");
	console.log("Format capacity: " + (rawCap *(format/100)).toFixed(2));
	console.log("Slack capacity: " + (rawCap *(slack/100)).toFixed(2));
	console.log("Checksums capacity:" + (rawCap * (checksums/100)).toFixed(2));
	console.log("FTT Overhead: " + (capLessOh - postFtt).toFixed(2) + " TiB");
	console.log("Effective cap: " + (postDedup - postFtt).toFixed(2));
	console.log("============================");


	//Chart outputs (damn it)
	//Format
	vsanChart.data.datasets[0].data[0] = (rawCap *((format + checksums) /100)).toFixed(2);
	//Slack
	vsanChart.data.datasets[0].data[1] = (rawCap *(slack/100)).toFixed(2);  
	//FTT
	vsanChart.data.datasets[0].data[2] = (capLessOh - postFtt).toFixed(2);
	//Useable
	vsanChart.data.datasets[0].data[3] = (postFtt).toFixed(2);
	//Effective
	vsanChart.data.datasets[0].data[4] = (postDedup - postFtt).toFixed(2);
	vsanChart.update();


	return (postDedup).toFixed(2);

}




