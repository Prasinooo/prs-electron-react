/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const AudioPage: React.FC = () => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const [video, setVideo] = useState<HTMLVideoElement>();
  useEffect(() => {
    const getedcanvas = document.querySelector('canvas');
    const getedvideo = document.querySelector('video');

    if (getedcanvas != null) setCanvas(getedcanvas);
    if (getedvideo != null) setVideo(getedvideo);
    if (canvas) {
      canvas.width = 480;
      canvas.height = 360;
    }
  }, []);

  const button = document.querySelector('button');
  if (button && canvas != null && video != null) {
    button.onclick = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas
        .getContext('2d')
        ?.drawImage(video, 0, 0, canvas.width, canvas.height);
    };
  }

  console.log('audio init');
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
        .then((stream) => {
          /* 使用这个stream stream */
          const mediaRecorder = new MediaRecorder(stream);
          return mediaRecorder;
          // window.stream = stream;
          // make stream available to browser console
          // eslint-disable-line
          if (video && video != null && video != undefined) { // eslint-disable-line
            video.srcObject = stream;
          }
        })
        .catch((err) => {
          /* 处理error */
          console.error(err);
        });
    }

    // const track = new MediaStreamTrack();
    // const constraints = track.getConstraints();
    // const constraints = MediaStreamTrack.getConstraints();
  };

  return (
    <div>
      Audio
      <Link to="/hello">Hello</Link>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div onClick={() => getUserMedia()} onKeyDown={() => getUserMedia()}>
        test get media
      </div>
      <video playsInline autoPlay>
        <track kind="captions" />
      </video>
      <button type="button">Take snapshot</button>
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

export default AudioPage;
