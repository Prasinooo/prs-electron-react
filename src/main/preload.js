/* eslint-disable prefer-destructuring */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-no-comment-textnodes */

const { contextBridge, ipcRenderer, desktopCapturer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    myPing() {
      ipcRenderer.send('ipc-example', 'ping');
    },
    on(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
  },
});

const handleCapturedScream = (stream) => {
  const video = document.querySelector('video');

  if (video) {
    video.srcObject = stream;
    video.onloadedmetadata = (e) => video.play();
  }
};

const handleCaptureError = (e) => {
  console.error(e);
};

const captureScreen = () => {
  desktopCapturer
    .getSources({ types: ['window', 'screen'] })
    .then(async (sources) => {
      // let source;
      // eslint-disable-next-line no-restricted-syntax
      // for (const s of sources) {
      //   console.log('s', s);
      //   if (s.name.indexOf('安全性') > -1) {
      //     source = s;
      //   }
      // }
      const source = sources[3];

      console.log('source', source);
      const trackConstraints = {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: source.id,
        minWidth: 1280,
        maxWidth: 1280,
        minHeight: 720,
        maxHeight: 720,
      };
      const constraints = {
        // audio: {
        //   mandatory: {
        //     chromeMediaSource: 'desktop',
        //   },
        // },
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: source.id,
            // minWidth: 1280,
            maxWidth: 1280,
            // minHeight: 720,
            maxHeight: 720,
          },
        },
      };
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleCapturedScream(stream);
      } catch (e) {
        handleCaptureError(e);
      }
      return 'finished';
      // }
      // }
    })
    .catch((err) => {
      /* 处理error */
      console.error(err);
    });
};

captureScreen();
