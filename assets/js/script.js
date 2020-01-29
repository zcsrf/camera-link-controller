var imageCapture;

window.onload = function () {

navigator.mediaDevices.getUserMedia({video: true}).then(mediaStream => {
    document.querySelector('video').srcObject = mediaStream;
    const track = mediaStream.getVideoTracks()[0];
    imageCapture = new ImageCapture(track);
  }).catch(function(error){
    console.log(error);
    const canvas = document.getElementById("canvas-small");
          const mCtx = canvas.getContext("2d");
    const img = new Image();
    img.src = "assets/img/default.png";
    img.onload = () => {
          // get the scale
          var scale = Math.max(canvas.width / img.width, canvas.height / img.height);
          // get the top left position of the image
          var x = (canvas.width / 2) - (img.width / 2) * scale;
          var y = (canvas.height / 2) - (img.height / 2) * scale;
          mCtx.drawImage(img, x, y, img.width * scale, img.height * scale);
        }
    });

    $('#frame-button').removeClass('disabled');
    $('#video-button').removeClass('disabled');
};



/*---------------------

/*---------------------
	Bar Controls
----------------------*/

// Pressing the 'frame' button
// Takes a snapshot of the current view
$('#frame-button').on('click', function () {
  console.log("Frame snapshot");
  onTakePhotoButtonClick();
});

// Pressing the 'video' button.
// Creates a recording of the current view
$('#video-button').on('click', function () {
  console.log("Video recording");
});

function onTakePhotoButtonClick() {
  imageCapture.takePhoto()
  .then(blob => createImageBitmap(blob))
  .then(function(blob){
    downloadImage(blob);
    //const canvas = document.querySelector('#takePhotoCanvas');
    //drawCanvas(canvas, imageBitmap);
  })
  .catch(error => console.log(error));
}

function downloadImage(blob){
  // uses the <a download> to download a Blob
  let a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'image.png';
  document.body.appendChild(a);
  a.click();
}
