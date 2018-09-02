$( document ).ready(function(){

$("#button2").click(function(){
	var IOPS = Number($("#IOPS").val());
	var wBlock = Number($("#wBlock").val());
	var rBlock = Number($("#rBlock").val());
	var ReadPercentage = Number($("#percentage").val());
	ReadPercentage = ReadPercentage / 100;
	WritePercentage = 1 - ReadPercentage;
	if (IOPS == 0 || wBlock == 0 || rBlock == 0 || ReadPercentage == 0){
		alert("Please Enter Values");
	} else {
		$("#result").text(calculation(4, rBlock, wBlock, IOPS, ReadPercentage, WritePercentage));
		$("#result2").text(calculation(8, rBlock, wBlock, IOPS, ReadPercentage, WritePercentage));
		$("#result3").text(calculation(16, rBlock, wBlock, IOPS, ReadPercentage, WritePercentage));
}

});
});

function calculation (vBlock, rBlock, wBlock, iops, read, write) {
	var result = (((iops * read * rBlock) / vBlock)) + (((iops * write * wBlock) / vBlock));
	var result = result.toFixed(0);
	return result;
}