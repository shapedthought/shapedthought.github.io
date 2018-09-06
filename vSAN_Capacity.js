//Update the FTT options based on flash or hybrid

document.querySelector('#nodeType').addEventListener("change", runFtt);

//Sets current FTT state
let nodeTypeSelect = 1;
let fttReduction = 1;

function runFtt() {
	document.querySelector('#fttHybrid').classList.toggle('d-none');
	document.querySelector('#fttFlash').classList.toggle('d-none');
	document.querySelector('#showDedup').classList.toggle('d-none');
	nodeTypeSelect = nodeTypeSelect === 1 ? 2 : 1;
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
	fttReduction = 1;
	if (nodeTypeSelect === 1) {
		document.querySelector('#dedupFactor').defaultValue = 1;
		console.log("dedup reset")
	};

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
	let dedupFactor = parseFloat(document.querySelector('#dedupFactor').value); //updates the dedup factor
	console.log("Dedup factor: " + dedupFactor);

	let baseMemOh = 0;

	//RAM overhead, total for cluster assumed

	if (nodeTypeSelect === 1) {
		baseMemOh = hybBaseMemOh;
	} else {
		baseMemOh = ssdBaseMemOh;
	}

	let ramOverhead = baseC + (diskGroupQtyPerHost * (dgBaseCon + (baseMemOh * cacheCapacity))) + (dataDisksPerDiskGroup * capDiskBaseCon);

	//Host deliverables
	//vCPU
	let coresReq = (vcpuReq / overcommit);
	document.querySelector('#coresReqOutput').innerText = coresReq;
	let delCores = (hostQuantity - hostRedundancy) * (processorsPerHost * corePerProcessor);
	document.querySelector('#coresDelOutput').innerText = delCores
	let coresDiff = (delCores - coresReq).toFixed(2);
	document.querySelector('#coresDiffOutput').innerText = coresDiff;
	if (coresDiff < 0) {
		document.querySelector('#coresDiffOutput').classList.add('text-danger');
	} else {
		document.querySelector('#coresDiffOutput').classList.remove('text-danger');
	}

	//RAM
	let ramPlusOh = (ramReq + (ramOverhead / 1024)).toFixed(2); //Added RAM overhead (as total)
	document.querySelector('#ramReqOutput').innerText = ramPlusOh;
	let delRam = (hostQuantity - hostRedundancy) * ramPerHost;
	document.querySelector('#ramDelOutput').innerText = delRam;
	let ramDiff = (delRam - ramPlusOh).toFixed(2);
	document.querySelector('#ramDiffOutput').innerText = ramDiff;
	if (ramDiff < 0) {
		document.querySelector('#ramDiffOutput').classList.add('text-danger');
	} else {
		document.querySelector('#ramDiffOutput').classList.remove('text-danger');
	}

	//The BIG one, vSAN capacity calculation!
	document.querySelector('#capReqOutput').innerText = capacityRequired;
	let rawCap = ((hostQuantity * (diskGroupQtyPerHost * dataDisksPerDiskGroup)) * dataDiskCapacity) / 1024;
	console.log("Raw capacity" + rawCap);
	let capDelivered = fttCapCal(rawCap, diskFormat, slackSpace, fttReduction, dedupFactor);
	console.log("Cap delivered" + capDelivered);
	document.querySelector('#capDelOutput').innerText = capDelivered;
	document.querySelector('#capDiffOutput').innerText = capDelivered - capacityRequired;
}

//vSAN capacity function
function fttCapCal(rawCap, format, slack, ftt, dedup) {
	console.log("vSAN Sizing steps");
	console.log("raw cap: " + rawCap + "TiB, format: " + format + "%, slack: " + slack + "%, ftt: " + ftt + " dedup: " + dedup + ": 1");
	let overHead = (1 - (format + slack) / 100);
	console.log("Overhead reduction (slack + format %): " + overHead + "% * raw cap");
	let capLessOh = (rawCap * overHead);
	console.log("Capacity with overhead reduction: " + capLessOh);
	let postFtt = capLessOh / ftt;
	console.log("Capacity post FTT reduction: " + postFtt);
	let postDedup = postFtt * dedup;
	console.log("Capacity with dedup factor: " + postDedup);
	return (postDedup).toFixed(2);
}