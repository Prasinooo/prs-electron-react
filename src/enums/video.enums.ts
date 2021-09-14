/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/prefer-default-export */
/* eslint-disable prettier/prettier */

export enum RECORD_STATUS {
  STARTED = 1,
  STOPPED = 2,
}

export enum MIME_TYPE {
  WEBM_VP9_OPUS = 'video/webm;codecs=vp9,opus',
  WEBM_VP8_OPUS = 'video/webm;codecs=vp8,opus',
  WEBM_H264_OPUS = 'video/webm;codecs=h264,opus',
  MP4_H264_AAC = 'video/mp4;codecs=h264,aac',
}
