/* eslint-disable promise/always-return */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-no-comment-textnodes */
import { RECORD_STATUS } from 'enums/video.enums';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import { desktopCapturer } from 'electron';
import Select from 'react-select';
import { MimeTypeOptionModel } from 'types/video';

const VideoPage: React.FC = () => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const [video, setVideo] = useState<HTMLVideoElement>();
  const [streamObj, setStreamObj] = useState<MediaStream>();
  const [recordedBlobs, setRecordedBlobs] = useState<BlobPart[]>([]);
  const [mimeType, setMimeType] = useState<string>();
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();
  const [recordStatus, setRecordStatus] = useState<RECORD_STATUS>(
    RECORD_STATUS.STOPPED
  );

  const possibleMimeTypes = [
    {
      value: 'video/webm;codecs="vp9,opus"',
      label: 'webm vp9 opus',
    },
    {
      value: 'video/webm;codecs="vp8,opus"',
      label: 'webm vp8 opus',
    },
    {
      value: 'video/webm;codecs="h264,opus"',
      label: 'webm h264 opus',
    },
    {
      value: 'video/mp4;codecs=avc1.4d002a',
      label: 'mp4 avc1.4d002a',
    },
  ];

  const mimeTypeOptions = possibleMimeTypes.filter(
    (option: MimeTypeOptionModel) => {
      return MediaRecorder.isTypeSupported(option.value);
    }
  );

  function handleDataAvailable(event: BlobEvent) {
    console.log('handleDataAvailable', event);
    if (event.data && event.data.size > 0) {
      recordedBlobs.push(event.data);
    }
  }
  console.log('mimeTypeOptions', mimeTypeOptions);

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

  useEffect(() => {
    if (mediaRecorder) {
      mediaRecorder.onstop = (event) => {
        console.log('Recorder stopped: ', event);
        console.log('Recorded Blobs: ', recordedBlobs);
      };
      mediaRecorder.ondataavailable = handleDataAvailable;
      mediaRecorder.start();
      console.log('started!!!!!!!');
      setRecordStatus(RECORD_STATUS.STARTED);
    }
  }, [mediaRecorder]);

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
      console.log('stream obj seted');
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
        audio: true,
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
          // if (video) {
          //   video.play();
          // }
        })
        .catch((err) => {
          /* 处理error */
          console.error(err);
        });
    }
  };

  const startRecording = () => {
    setRecordedBlobs([]);
    const mimeOptions: MediaRecorderOptions = {
      mimeType,
    };
    console.log('startRecording', streamObj);
    try {
      if (streamObj) {
        const newMediaRecorder = new MediaRecorder(streamObj, mimeOptions);
        setMediaRecorder(newMediaRecorder);
        console.log('start mediaRecorder', newMediaRecorder, mediaRecorder);
      }
    } catch (e) {
      console.error('Exception while creating MediaRecorder:', e);
    }
  };

  const stopRecording = () => {
    console.log('stopRecording');
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecordStatus(RECORD_STATUS.STOPPED);
    }
  };

  const toggleRecording = () => {
    console.log('toggleRecord');
    if (recordStatus === RECORD_STATUS.STOPPED) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const playVideo = () => {
    const superBuffer = new Blob(recordedBlobs, { type: mimeType });
    const src = window.URL.createObjectURL(superBuffer);
    console.log('superBuffer, src', superBuffer, src);
    if (video) {
      stopCamera();
      video.srcObject = null;
      video.src = src;
      video.controls = true;
      // video.play();
    }
  };
  const downloadVideo = () => {
    const blob = new Blob(recordedBlobs, { type: 'video/webm' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'test.webm';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  };

  const test = () => {
    console.log('mediaRecorder, streamObj', mediaRecorder, streamObj);
  };

  return (
    <div className="page-container">
      Video
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
      <button type="button" id="take_snapshot" onClick={test}>
        test
      </button>
      <button type="button" id="take_snapshot" onClick={takeSnapshot}>
        Take snapshot
      </button>
      <button type="button" id="stop_camera" onClick={stopCamera}>
        Stop Camera
      </button>
      <button
        type="button"
        id="record_camera"
        disabled={!mimeType}
        onClick={toggleRecording}
      >
        {recordStatus === RECORD_STATUS.STOPPED
          ? 'Start Recording'
          : 'Stop Recording'}
      </button>
      <button type="button" id="play" onClick={playVideo}>
        Play
      </button>
      <button type="button" id="download" onClick={downloadVideo}>
        Download
      </button>
      <div
        style={{
          width: '50%',
          marginTop: '10px',
        }}
      >
        <Select
          defaultValue={mimeTypeOptions[0].value}
          options={mimeTypeOptions}
          onChange={(target: MimeTypeOptionModel) => {
            setMimeType(target.value);
          }}
          // value={mimeType}
        />
      </div>
      <video id="player1">
        <track kind="captions" />
      </video>
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
