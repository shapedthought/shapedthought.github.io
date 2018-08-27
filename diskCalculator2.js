//Total cap required
let capReq = document.querySelector("#capReq");

//Percentage per tier
let ssdPercent = document.querySelector("#ssdPercent");
let sasPercent = document.querySelector("#sasPercent");
let nlsasPercent = document.querySelector("#nlsasPercent");

//SSD
let ssdLength = document.querySelector("#ssdLength");
let ssdDiskCap = document.querySelector("#ssdCap"); //Disk size
let ssdSelected = document.querySelector("#ssdSelected");

//SAS
let sasLength = document.querySelector("#sasLength");
let sasDiskCap = document.querySelector("#sasCap"); //Disk size
let sasSelected = document.querySelector("#sasSelected");

//NL-SAS
let nlsasLength = document.querySelector("#nlsasLength");
let nlsasDiskCap = document.querySelector("#nlsasCap"); //Disk size
let nlsasSelected = document.querySelector("#nlsasSelected");

//Outputs
//Cap required
let ssdReqCap = document.querySelector("#ssdReqCap");
let sasReqCap = document.querySelector("#sasReqCap");
let nlsasReqCap = document.querySelector("#nlsasReqCap");

//Groups required
let ssdGroup = document.querySelector("#ssdGroup");
let sasGroup = document.querySelector("#sasGroup");
let nlsasGroup = document.querySelector("#nlsasGroup");

//Delivered capacity
let ssdDel = document.querySelector("#ssdDel");
let sasDel = document.querySelector("#sasDel");
let nlsasDel = document.querySelector("#nlsasDel");

//Total Capacity delivered
let totalDel = document.querySelector("#totalDel");

//Total percentage
let percent = document.querySelector("#percent");

//Bar Chart

let myChart = document.getElementById("myChart").getContext("2d");

let capacityChart = new Chart(myChart, {
  type: "bar",
  data: {
    labels: [
      "SSD Req",
      "SSD Del",
      "SAS Req",
      "SAS Del",
      "NL-SAS Req",
      "NL-SAS Del"
    ],
    datasets: [
      {
        label: "TB",
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: [
          "#ff6666",
          "#ff6666",
          "#ffff99",
          "#ffff99",
          "#b3ffb3",
          "#b3ffb3"
        ],
        borderWidth: 1
      }
    ]
  },
  options: {
    title: {
      display: true,
      text: "Capacity by tier"
    }
  }
});

//PIE CHART
let myChart2 = document.getElementById("myChart2").getContext("2d");

let pieChart = new Chart(myChart2, {
  type: "pie",
  data: {
    labels: ["SSD Cap", "SAS Cap", "NL-SAS Cap"],
    datasets: [
      {
        label: "Pool ratios",
        data: [35, 35, 30],
        backgroundColor: ["#ff6666", "#ffff99", "#b3ffb3"],
        borderWidth: 1
      }
    ]
  },
  options: {
    title: {
      display: true,
      text: "Capacity delivered"
    }
  }
});

//Button click event
let button = document.querySelector("#button");
console.log("clicked!");
button.addEventListener("click", runCal);

//runCal function
function runCal() {
  //Required capacity in each tier
  ssdPercent2 = parseFloat(ssdPercent.value);
  sasPercent2 = parseFloat(sasPercent.value);
  nlsasPercent2 = parseFloat(nlsasPercent.value);
  capReq2 = parseFloat(capReq.value);
  let ssdCap = capTierReq(ssdPercent2, capReq2);
  let sasCap = capTierReq(sasPercent2, capReq2);
  let nlsasCap = capTierReq(nlsasPercent2, capReq2);

  //Output the capacity requirements for each tier
  ssdCapTB = (ssdCap / 1024).toFixed(2);
  capacityChart.data.datasets[0].data[0] = ssdCapTB;
  sasCapTB = (sasCap / 1024).toFixed(2);
  capacityChart.data.datasets[0].data[2] = sasCapTB;
  nlsasCapTB = (nlsasCap / 1024).toFixed(2);
  capacityChart.data.datasets[0].data[4] = nlsasCapTB;
  ssdReqCap.innerText = ssdCapTB;
  sasReqCap.innerText = sasCapTB;
  nlsasReqCap.innerText = nlsasCapTB;

  //Parity by tier
  let ssdSelected2 = parseInt(ssdSelected.value);
  let sasSelected2 = parseInt(sasSelected.value);
  let nlsasSelected2 = parseInt(nlsasSelected.value);
  let ssdPar = ssdSelected2 === 5 ? 1 : 2;
  let sasPar = sasSelected2 === 5 ? 1 : 2;
  let nlsasPar = nlsasSelected2 === 5 ? 1 : 2;

  //Capacity delivered by each group
  let ssdLength2 = parseFloat(ssdLength.value);
  let sasLength2 = parseFloat(ssdLength.value);
  let nlsasLength2 = parseFloat(nlsasLength.value);
  let ssdDiskCap2 = parseFloat(ssdDiskCap.value);
  let sasDiskCap2 = parseFloat(sasDiskCap.value);
  let nlsasDiskCap2 = parseFloat(nlsasDiskCap.value);

  let ssdGroupCap = groupCap(ssdDiskCap2, ssdLength2, ssdPar); //ssdCap is total cap required
  let sasGroupCap = groupCap(sasDiskCap2, sasLength2, sasPar);
  let nlsasGroupCap = groupCap(nlsasDiskCap2, nlsasLength2, nlsasPar);

  //Groups required to meet capacity
  let ssdGroupsReq = Math.ceil(ssdCap / ssdGroupCap); //Math ceil rounds up the result
  let sasGroupsReq = Math.ceil(sasCap / sasGroupCap);
  let nlsasGroupsReq = Math.ceil(nlsasCap / nlsasGroupCap);

  //Output the group requirement to DOM
  ssdGroup.innerText = ssdGroupsReq;
  sasGroup.innerText = sasGroupsReq;
  nlsasGroup.innerText = nlsasGroupsReq;

  //Delivered capacity, need to put this into some arrays and loop
  let ssdDelCap = (ssdGroupsReq * ssdGroupCap) / 1024;
  capacityChart.data.datasets[0].data[1] = ssdDelCap.toFixed(2);
  pieChart.data.datasets[0].data[0] = ssdDelCap.toFixed(2);
  let sasDelCap = (sasGroupsReq * sasGroupCap) / 1024;
  capacityChart.data.datasets[0].data[3] = sasDelCap.toFixed(2);
  pieChart.data.datasets[0].data[1] = sasDelCap.toFixed(2);
  let nlsasDelCap = (nlsasGroupsReq * nlsasGroupCap) / 1024;
  capacityChart.data.datasets[0].data[5] = nlsasDelCap.toFixed(2);
  pieChart.data.datasets[0].data[2] = nlsasDelCap.toFixed(2);
  capacityChart.update();
  pieChart.update();

  //Output delivered capacity to DOM
  ssdDel.innerText = ssdDelCap.toFixed(2);
  sasDel.innerText = sasDelCap.toFixed(2);
  nlsasDel.innerText = nlsasDelCap.toFixed(2);

  //Total delivered capacity
  let totalCapDel = ssdDelCap + sasDelCap + nlsasDelCap;
  totalDel.innerText = totalCapDel.toFixed(2);

  //Pool delivered percentages

  percent.innerText = ssdPercent2 + sasPercent2 + nlsasPercent2 + "%";

  let TotalPercent = ssdPercent2 + sasPercent2 + nlsasPercent2;

  if (TotalPercent !== 100) {
    alert("Check Percentage");
  }
}

//Capcity required function
function capTierReq(percent, capReq) {
  return capReq * 1024 * (percent / 100); //Change TB to GB here
}

//Group capacity
function groupCap(diskCap, stripe, parity) {
  let cal = diskCap * 0.89 * (stripe - parity);
  return cal; //Still in GB here
}

//Update chart data

// function addData(position, data) {
//   myChart.data.datasets[0].data[position] = data;
// }

// //Remove data from chart
// function removeData() {
//   myChart.data.datasets.forEach(dataset => {
//     dataset.data.pop();
//   });
// }
