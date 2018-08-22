new Vue({
  el: "#diskCal",
  data: {
    capReq: 0,

    ssdPercent: 0,
    ssdLength: 0,
    ssdCap: 0,
    ssdSelected: 0,
    ssdCapTarget: 0,

    sasPercent: 0,
    sasLength: 0,
    sasCap: 0,
    sasRaid: 0,
    sasSelected: 0,
    sasCapTarget: 0,

    nlsasPercent: 0,
    nlsasLength: 0,
    nlsasCap: 0,
    nlsasSelected: 0,
    nlsasCapTarget: 0,

    ssdResult: 0,
    sasResult: 0,
    nlsasResult: 0
    // totalCap: 0
  },
  methods: {
    ssdCalculation: function() {
      var parity = this.ssdSelected < 5 ? 1 : 2;
      var capReq = this.capReq * 1024 * (this.ssdPercent / 100);
      var groupCap = this.ssdCap * 0.89 * (this.ssdLength - parity);
      var groupReq = capReq / groupCap;
      return Math.ceil(groupReq);
    },
    sasCalculation: function() {
      var parity = this.sasSelected < 6 ? 1 : 2;
      var capReq = this.capReq * 1024 * (this.sasPercent / 100);
      var groupCap = this.sasCap * 0.89 * (this.sasLength - parity);
      var groupReq = capReq / groupCap;
      return Math.ceil(groupReq);
    },
    nlsasCalculation: function() {
      var parity = this.nlsasSelected < 6 ? 1 : 2;
      var capReq = this.capReq * 1024 * (this.nlsasPercent / 100);
      var groupCap = this.nlsasCap * 0.89 * (this.nlsasLength - parity);
      var groupReq = capReq / groupCap;
      return Math.ceil(groupReq);
    },
    ssdCapReq: function() {
      var capReq = this.capReq * 1024 * (this.ssdPercent / 100);
      return capReq / 1024;
    },
    ssdCapDel: function() {
      var parity = this.ssdSelected < 6 ? 1 : 2;
      var capReq = this.capReq * 1024 * (this.ssdPercent / 100);
      var groupCap = this.ssdCap * 0.89 * (this.ssdLength - parity);
      var groupReq = capReq / groupCap;
      var capDel = groupCap * Math.ceil(groupReq);
      return (capDel / 1024).toFixed(2);
    },
    sasCapReq: function() {
      var capReq = this.capReq * 1024 * (this.sasPercent / 100);
      return capReq / 1024;
    },
    sasCapDel: function() {
      var parity = this.sasSelected < 6 ? 1 : 2;
      var capReq = this.capReq * 1024 * (this.sasPercent / 100);
      var groupCap = this.sasCap * 0.89 * (this.sasLength - parity);
      var groupReq = capReq / groupCap;
      var capDel = groupCap * Math.ceil(groupReq);
      return (capDel / 1024).toFixed(2);
    },
    nlsasCapReq: function() {
      var capReq = this.capReq * 1024 * (this.nlsasPercent / 100);
      return capReq / 1024;
    },
    nlsasCapDel: function() {
      var parity = this.nlsasSelected < 6 ? 1 : 2;
      var capReq = this.capReq * 1024 * (this.nlsasPercent / 100);
      var groupCap = this.nlsasCap * 0.89 * (this.nlsasLength - parity);
      var groupReq = capReq / groupCap;
      var capDel = groupCap * Math.ceil(groupReq);
      return (capDel / 1024).toFixed(2);
    },
    totalCapDel: function() {
      var totalCap = this.ssdCapDel() + this.sasCapDel() + this.nlsasCapDel();
      return totalCap;
    }
  }
});
