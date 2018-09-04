//Update the FTT options based on flash or hybrid

document.querySelector('#nodeType').addEventListener("change", runFtt);

function runFtt() {
	document.querySelector('#fttHybrid').classList.toggle('d-none');
	document.querySelector('#fttFlash').classList.toggle('d-none');
	document.querySelector('#showDedup').classList.toggle('d-none');
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
	slackSpace = document.querySelector('#slackSpace').value;
	dgBaseCon = document.querySelector('#dgBaseConsumption').value;
	diskFormat = document.querySelector('#formattingOverhead').value;
	baseC = document.querySelector('#baseConsumption').value;
	ssdBaseMemOh = document.querySelector('#SSDMemOverheadPerGiB').value;
	hybBaseMemOh = document.querySelector('#HDDMemOverheadPerGiB').value;
	capDiskBaseCon = document.querySelector('#capDiskBaseConsumption').value;
}

//RAM Overhead cal
function ramOverhead(BC, NDG, DGBC, SMOH, SS, NCD, CDBC) {
	let overHead = BC + (NDG * (DGBC + (SMOH * SS))) + (NCD * CDBC);
	return overHead;
}

//FTT cal
function fttCapCal(rawCap, format, slack, ftt) {
	let overHead = (1 - (format + slack) / 100);
	let capLessOh = (rawCap * overHead);
	let postFtt = capLessOh / parseFloat(ftt); //changing the value to a float here?
	return postFtt;
}

//vCPU and RAM deliverable cal

//Minimum host warning based on FTT

//Maxium disks per group