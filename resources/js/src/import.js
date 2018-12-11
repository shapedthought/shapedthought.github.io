
let inputData = '';

const input = document.querySelector('#storageConfig')
input.addEventListener('change', function(e) {
  const reader = new FileReader()
  reader.readAsText(input.files[0])
  reader.onload = function () {
    inputData = JSON.parse(reader.result)
    uploadConfigBtn.disabled = false;
    console.log(inputData)
  }
}, false)

