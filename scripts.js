const video = document.querySelector(".player");
const canvas = document.querySelector(".photo");
const ctx = canvas.getContext("2d");
const strip = document.querySelector(".strip");
const snap = document.querySelector(".snap");

function getVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((localMediaStream) => {
      console.log(localMediaStream);

      //  DEPRECIATION :
      //       The following has been depreceated by major browsers as of Chrome and Firefox.
      //       video.src = window.URL.createObjectURL(localMediaStream);
      //       Please refer to these:
      //       Deprecated  - https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
      //       Newer Syntax - https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/srcObject

      video.srcObject = localMediaStream;
      video.play();
    })
    .catch((err) => {
      console.error(`Caution! Error: ${err}`);
    });
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  console.log(width, height);
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    //Take out the pixels
    let pixels = ctx.drawImage(video, 0, 0, width, height);
    //Mess with the pixels
    pixels = redEffect(pixels);
    //Put them back
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
  snap.currentTIme = 0;
  snap.play();

  const data = canvas.toDataURL("image.png");
  const link = document.createElement("a");
  link.href = data;
  link.setAttribute("download", "handsome");
  link.innerHTML = `<img src="${data}" alt="Handsome Picture Subject"/>`;
  strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 100; //Red
    pixels[i + 1] = pixels.data[i + 1] - 50; //Green
    pixels[i + 2] = pixels.data[i + 2] * 0.5; //Blue
  }
}

getVideo();

video.addEventListener("canplay", paintToCanvas);
