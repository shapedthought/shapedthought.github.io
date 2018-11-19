class VsanIO {
    constructor(){
        this.nodetype = document.querySelector("#nodeType");
        this.fttHybrid = document.querySelector("#fttHybrid");
        this.fttFlash = document.querySelector("#fttFlash");
        this.showDedup = document.querySelector("#showDedup");
        this.slackSpace = document.querySelector('#slackSpace').value
        this.fttHybridValue = document.querySelector('#fttHybridValue').value;
    }

    runFtt() {
        this.nodetype.classList.toggle('d-none');
        this.fttHybrid.classList.toggle('d-none');
        this.fttFlash.classList.toggle('d-none');

        this.nodeTypeSelect = this.nodeTypeSelect === 'hybrid' ? 'flash' : 'hybrid';
    }

    settingsUpdate() {
        document.querySelector('#slackSpace').value = this.slackSpace;
        document.querySelector('#dgBaseConsumption').value = this.dgBaseCon;
        document.querySelector('#formattingOverhead').value = this.diskFormat;
        document.querySelector('#baseConsumption').value = this.baseC;
        document.querySelector('#SSDMemOverheadPerGiB').value = this.ssdBaseMemOh;
        document.querySelector('#HDDMemOverheadPerGiB').value = this.hybBaseMemOh;
        document.querySelector('#capDiskBaseConsumption').value = this.capDiskBaseCon;
    };

    changeSettings() {
        slackSpace = parseInt(document.querySelector('#slackSpace').value);
        dgBaseCon = parseInt(document.querySelector('#dgBaseConsumption').value);
        diskFormat = parseFloat(document.querySelector('#formattingOverhead').value);
        baseC = parseInt(document.querySelector('#baseConsumption').value);
        ssdBaseMemOh = parseInt(document.querySelector('#SSDMemOverheadPerGiB').value);
        hybBaseMemOh = parseInt(document.querySelector('#HDDMemOverheadPerGiB').value);
        capDiskBaseCon = parseInt(document.querySelector('#capDiskBaseConsumption').value);
    }

}