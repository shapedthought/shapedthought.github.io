$("#button2").click(function() {
  console.log("button clicked!");
  var beIOPS = Number($("#beIOPS").val());
  var parity = Number($("#parity").val());
  var ReadPercentage = Number($("#percentage").val());
  ReadPercentage = ReadPercentage / 100;
  WritePercentage = 1 - ReadPercentage;
  console.log(WritePercentage);
  if (beIOPS == 0 || parity == 0 || ReadPercentage == 0) {
    alert("Please Enter Values");
  } else {
    var result = beIOPS / (ReadPercentage + parity * WritePercentage);
    $("#result").text(result.toFixed(2));
  }
});
