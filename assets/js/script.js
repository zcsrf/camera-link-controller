const video = document.getElementById('video');
var canvas = document.getElementById('canvas-small');
var context = canvas.getContext('2d');

function calculateSize(srcSize, dstSize) {
  var srcRatio = srcSize.width / srcSize.height;
  var dstRatio = dstSize.width / dstSize.height;
  if (dstRatio > srcRatio) {
    return {
      width:  dstSize.height * srcRatio,
      height: dstSize.height
    };
  } else {
    return {
      width:  dstSize.width,
      height: dstSize.width / srcRatio
    };
  }
}

function renderFrame() {
  requestAnimationFrame(renderFrame);
  canvas.width = canvas.scrollWidth;
  canvas.height = canvas.scrollHeight;
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    var videoSize = { width: video.videoWidth, height: video.videoHeight };
    var canvasSize = { width: canvas.width, height: canvas.height };
    var renderSize = calculateSize(videoSize, canvasSize);
    var xOffset = (canvasSize.width - renderSize.width) / 2;
    context.drawImage(video, xOffset, 0, renderSize.width, renderSize.height);
  }
}

/*if (navigator.mediaDevices.getUserMedia) {
  var successCallback = function(stream) {
    video.srcObject = stream;
  };
  var errorCallback = function(error) {
    console.log(error);
  };
  navigator.mediaDevices.getUserMedia({
    audio: false,
	video: {width: {exact: 640}, height: {exact: 480}}
  }).then(successCallback, errorCallback);
  requestAnimationFrame(renderFrame);
}*/

window.onload = function () {

navigator.mediaDevices.getUserMedia({video: true}).then(mediaStream => {
    document.querySelector('video').srcObject = mediaStream;
    const track = mediaStream.getVideoTracks()[0];
    imageCapture = new ImageCapture(track);
	requestAnimationFrame(renderFrame);


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
/*$('#frame-button').on('click', function () {
  console.log("Frame snapshot");
  onTakePhotoButtonClick().then(downloadImage);
});
*/

const btnPhoto = document.querySelector("#frame-button");
btnPhoto.onclick = e => {
    takePhoto().then(downloadImage);
  };

// Pressing the 'video' button.
// Creates a recording of the current view

const btn = document.querySelector('#video-button');
btn.onclick = startRecording;

/*$('#video-button').on('click', function () {
  console.log("Video recording");
  onMakeRecordingButtonClick(this);
});*/

function takePhoto() {
  btnPhoto.style.background = "white";
  const canvas = document.createElement('canvas'); // create a canvas
  const ctx = canvas.getContext('2d'); // get its context
  canvas.width = video.videoWidth; // set its size to the one of the video
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0,0); // the video
  return new Promise((res, rej)=>{
    canvas.toBlob(res, 'image/jpeg'); // request a Blob from the canvas
  });
}

function startRecording(){
  // switch button's behavior
  //const btn = this;
  console.log("startRecording");
  btn.style.background = 'red';
  btn.onclick = stopRecording;

  const chunks = []; // here we will save all video data
  console.log(video);
  var options = {
        videoBitsPerSecond: 1000000
  };
  const rec = new MediaRecorder(video.srcObject,options);
  console.log(rec);
  // this event contains our data
  rec.ondataavailable = e => chunks.push(e.data);
  // when done, concatenate our chunks in a single Blob
  rec.onstop = e => downloadVideo(new Blob(chunks));
  rec.start();
  const recordTimeout = setTimeout(recLimit,120000);

  function stopRecording(){
    console.log("stopRecording");
    rec.stop();
    // switch button's behavior
    btn.style.background="#202020";
    btn.onclick = startRecording;
    clearTimeout(recordTimeout);

  }

  function recLimit(){
    stopRecording();
  }
}



function downloadImage(blob){
  let a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'screenshot.jpg';
  document.body.appendChild(a);
  a.click();
  btnPhoto.style.background = "";
}

function downloadVideo(blob){
  // uses the <a download> to download a Blob
  let a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'recorded.webm';
  document.body.appendChild(a);
  a.click();

}
