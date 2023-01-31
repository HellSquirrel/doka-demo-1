const dropFileZone = document.querySelector(".form-upload__label")!;
const sizeText = document.getElementById("uploadForm_Size")!;
const statusText = document.getElementById("uploadForm_Status")!;
const progressBar = document.getElementById(
  "progressBar"
) as HTMLProgressElement;

const uploadUrl = "/unicorns";

["dragover", "drop"].forEach(function (event) {
  document.addEventListener(event, function (evt) {
    evt.preventDefault();
    return false;
  });
});

dropFileZone.addEventListener("dragenter", function () {
  dropFileZone.classList.add("upload-zone_gragover");
});

dropFileZone.addEventListener("dragleave", function () {
  dropFileZone.classList.remove("upload-zone_gragover");
});

dropFileZone.addEventListener("drop", function (event) {
  dropFileZone.classList.remove("upload-zone_gragover");
  // @ts-ignore
  const file = event.dataTransfer?.files[0];
  if (!file) {
    return;
  }

  if (file.type.startsWith("image/")) {
    processingUploadFile(file, sizeText, statusText, progressBar);
  } else {
    alert("Можно загружать только изображения");
    return false;
  }
});

export function processingUploadFile(
  file: File,
  sizeText: Element,
  statusText: Element,
  progressBar: HTMLProgressElement
) {
  if (file) {
    const dropZoneData = new FormData();
    const xhr = new XMLHttpRequest();

    dropZoneData.append("file", file);

    xhr.upload.addEventListener("progress", function (event) {
      const percentLoaded = Math.round((event.loaded / event.total) * 100);

      progressBar.value = percentLoaded;
      sizeText.textContent = `${event.loaded} из ${event.total} МБ`;
      statusText.textContent = `Загружено ${percentLoaded}% | `;
    });

    xhr.open("POST", uploadUrl, true);

    xhr.send(dropZoneData);

    xhr.onload = function () {
      if (xhr.status == 200) {
        statusText.textContent = `Все загружено`;
      } else {
        statusText.textContent = `Ошибка загрузки`;
      }
      (sizeText as HTMLDivElement).style.display = "none";


    };
  }
}

export function processingUploadFileWithFetch(file: File) {
  if (file) {
    const dropZoneData = new FormData();

    dropZoneData.append("file", file);

    fetch(uploadUrl, {
      method: "POST",
    }).then(async (res) => {
      const reader = res?.body?.getReader();
      while (true && reader) {
        const { value, done } = await reader?.read();
        console.log("value", value);
        if (done) break;
        console.log("Received", value);
      }
    });
  }
}

// notes

// let uploaded = 0
// let buf = new Uint8Array(1024 * 50)
// let start = Date.now()

// var rs = new ReadableStream({
//   pull(ctrl) {
//     uploaded += buf.byteLength
//     console.log('uploaded', uploaded)
//     crypto.getRandomValues(buf)
//     ctrl.enqueue(buf)
//     if ((start + 1000) < Date.now()) ctrl.close()
//   }
// })

// fetch('https://httpbin.org/post', {
//   method: 'POST',
//   body: rs,
//   duplex: 'half'
// }).then(r => r.json()).then(console.log)
