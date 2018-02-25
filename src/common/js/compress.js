/* eslint-disable */ 
function processFile (file) {
  let reader = new FileReader()
  return new Promise((resolve, reject) => {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      reader.onload = function (e) {
        let blob = new Blob([e.target.result])
        window.URL = window.URL || window.webkitURL
        var blobURL = window.URL.createObjectURL(blob)
        var image = new Image()
        image.src = blobURL
        image.onload = function() {
          var resized = resizeMe(image)
          resolve(resized)
        }
      }
      reader.readAsArrayBuffer(file)
    } else {
      reject('fail')
    }
  })
}

function resizeMe (img) {
  let max_width = 1920
  let max_height = 1080

  let canvas = document.createElement('canvas')
  let width = img.width
  let height = img.height

  if (width > height) {
    if (width > max_width) {
      height = Math.round(height *= max_width / width)
      width = max_width
    }
  } else {
    if (height > max_height) {
      width = Math.round(width *= max_height / height)
      height = max_height
    }
  }

  canvas.width = width
  canvas.height = height

  let ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, width, height)
  return canvas.toDataURL('image/jpeg', 0.5)
}

export default processFile