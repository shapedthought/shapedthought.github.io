//Update the FTT options based on flash or hybrid

document.querySelector('#nodeType').addEventListener("change", runFtt);

//Sets current FTT state
let nodeTypeSelect = 1;

function runFtt() {
	document.querySelector('#fttHybrid').classList.toggle('d-none');
	document.querySelector('#fttFlash').classList.toggle('d-none');
	document.querySelector('#showDedup').classList.toggle('d-none');
	nodeTypeSelect = nodeTypeSelect === 1 ? 2 : 1;
	console.log(nodeTypeSelect);
}

//Add current values to modal on click

document.querySelector('#settingsButton').addEventListener("click", settingsUpdate);

let baseC = 5426;
let dgBaseCon = 636;
let ssdBaseMemOh = 8;
let hybBaseMemOh = 14;
let capDiskBaseCon = 70;
let slackSpace = 25;
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
	diskFormat = parseInt(document.querySelector('#formattingOverhead').value);
	baseC = parseInt(document.querySelector('#baseConsumption').value);
	ssdBaseMemOh = parseInt(document.querySelector('#SSDMemOverheadPerGiB').value);
	hybBaseMemOh = parseInt(document.querySelector('#HDDMemOverheadPerGiB').value);
	capDiskBaseCon = parseInt(document.querySelector('#capDiskBaseConsumption').value);
}


//FTT cal
function fttCapCal(rawCap, format, slack, ftt) {
	let overHead = (1 - (format + slack) / 100);
	let capLessOh = (rawCap * overHead);
	let postFtt = capLessOh / parseFloat(ftt); //changing the value to a float here?
	return postFtt;
}


//Submit function

document.querySelector('#submit').addEventListener('click', runCal);

function runCal() {


	//Virtual Requirements inputs
	let vcpuReq = parseInt(document.querySelector('#vcpuReq').value);
	let ramReq = parseInt(document.querySelector('#ramReq').value);

	//Host Qty
	let hostQuantity = parseInt(document.querySelector('#hostQuantity').value);

	//Host config inputs
	let overcommit = parseInt(document.querySelector('#overcommit').value);
	let hostRedundancy = parseInt(document.querySelector('#hostRedundancy').value);
	let corePerProcessor = parseInt(document.querySelector('#corePerProcessor').value);
	let processorsPerHost = parseInt(document.querySelector('#processorsPerHost').value);
	let ramPerHost = parseInt(document.querySelector('#ramPerHost').value);

	//vSAN inputs
	let fttReduction = 0;
	document.querySelector('#dedupFactor').defaultValue = 0;
	if (nodeTypeSelect === 1) {
		fttReduction = parseFloat(document.querySelector('#fttHybridValue').value);
	} else {
		fttReduction = parseFloat(document.querySelector('#fttFlashValue').value);
	}

	let capacityRequired = parseInt(document.querySelector('#capacityRequired').value);
	let diskGroupQtyPerHost = parseInt(document.querySelector('#diskGroupQtyPerHost').value);
	let dataDisksPerDiskGroup = parseInt(document.querySelector('#dataDisksPerDiskGroup').value);
	let cacheCapacity = parseInt(document.querySelector('#cacheCapacity').value);
	let dataDiskCapacity = parseInt(document.querySelector('#dataDiskCapacity').value);
	let dedupFactor = parseFloat(document.querySelector('#dedupFactor').value);

	let baseMemOh = 0;

	if (nodeTypeSelect === 1) {
		baseMemOh = hybBaseMemOh;
	} else {
		baseMemOh = ssdBaseMemOh;
	}

	console.log(baseC, diskGroupQtyPerHost, dgBaseCon, baseMemOh, cacheCapacity, dataDisksPerDiskGroup, capDiskBaseCon);

	let ramOverhead = baseC + (diskGroupQtyPerHost * (dgBaseCon + (baseMemOh * cacheCapacity))) + (dataDisksPerDiskGroup * capDiskBaseCon);
	console.log(ramOverhead);
}