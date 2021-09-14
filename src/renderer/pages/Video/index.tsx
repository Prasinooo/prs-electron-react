/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import { desktopCapturer } from 'electron';

const VideoPage: React.FC = () => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const [video, setVideo] = useState<HTMLVideoElement>();
  const [streamObj, setStreamObj] = useState<MediaStream>();
  useEffect(() => {
    const getedcanvas = document.querySelector('canvas');
    const getedvideo = document.querySelector('video');

    if (getedcanvas != null) setCanvas(getedcanvas);
    if (getedvideo != null) setVideo(getedvideo);
    if (canvas) {
      canvas.width = 480;
      canvas.height = 360;
    }
    console.log('canvas, video', canvas, video);
  }, []);

  const takeSnapshot = () => {
    if (canvas != null && video != null) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas
        .getContext('2d')
        ?.drawImage(video, 0, 0, canvas.width, canvas.height);
    }
  };

  const stopCamera = () => {
    streamObj?.getTracks().forEach((track) => {
      track.stop();
    });
    if (video && video != null && video != undefined) { // eslint-disable-line
      video.srcObject = null;
      setStreamObj(undefined);
    }
  };

  const setVideoStream = (stream: MediaStream) => {
    console.log('strem', stream);
    if (video && video != null && video != undefined) { // eslint-disable-line
      video.srcObject = stream;
      setStreamObj(stream);
    }
  };

  const getUserMedia = () => {
    const supports = navigator.mediaDevices.getSupportedConstraints();
    let constraints: MediaStreamConstraints;
    if (
      !supports.width ||
      !supports.height ||
      !supports.frameRate ||
      !supports.facingMode
    ) {
      // We're missing needed properties, so handle that error.
    } else {
      constraints = {
        video: true,
        audio: false,
      };
      navigator.mediaDevices
        .getUserMedia(constraints)
        // eslint-disable-next-line promise/always-return
        .then((stream) => {
          /* 使用这个stream stream */
          // const mediaRecorder = new MediaRecorder(stream);
          // return mediaRecorder;
          // window.stream = stream;
          // make stream available to browser console
          // eslint-disable-line
          setVideoStream(stream);
        })
        .catch((err) => {
          /* 处理error */
          console.error(err);
        });
    }
  };

  return (
    <div className="page-container">
      Audio
      <Link to="/hello">Hello</Link>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <button type="button" id="getCameraStream" onClick={() => getUserMedia()}>
        test get media
      </button>
      {/* <button
        type="button"
        id="getDisplayStream"
        onClick={() => getDisplayStream()}
      >
        test get display
      </button> */}
      <video playsInline autoPlay>
        <track kind="captions" />
      </video>
      <button type="button" id="take_snapshot" onClick={takeSnapshot}>
        Take snapshot
      </button>
      <button type="button" id="stop_camera" onClick={stopCamera}>
        Stop Camera
      </button>
      <canvas />
      <p>
        Draw a frame from the video onto the canvas element using the{' '}
        <code>drawImage()</code> method.
      </p>
      <p>
        The variables <code>canvas</code>, <code>video</code> and{' '}
        <code>stream</code> are in global scope, so you can inspect them from
        the console.
      </p>
      <a
        href="https://github.com/webrtc/samples/tree/gh-pages/src/content/getusermedia/canvas"
        title="View source for this page on GitHub"
        id="viewSource"
      >
        View source on GitHub
      </a>
    </div>
  );
};

export default VideoPage;
