import { useRef, useState } from 'react';

import {
  VERSION,
  createClient,
  createCameraVideoTrack,
  createMicrophoneAudioTrack,
  onCameraChanged,
  onMicrophoneChanged,
} from 'agora-rtc-sdk-ng/esm';

console.log('Current SDK VERSION: ', VERSION);

onCameraChanged((device) => {
  console.log('onCameraChanged: ', device);
});
onMicrophoneChanged((device) => {
  console.log('onMicrophoneChanged: ', device);
});

const client = createClient({
  mode: 'rtc',
  codec: 'vp8',
});
let audioTrack;
let videoTrack;
function AgoraAudience() {
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAudioPubed, setIsAudioPubed] = useState(false);
  const [isVideoPubed, setIsVideoPubed] = useState(false);
  const [isVideoSubed, setIsVideoSubed] = useState(false);

  const turnOnCamera = async (flag) => {
    flag = flag ?? !isVideoOn;
    setIsVideoOn(flag);

    if (videoTrack) {
      return videoTrack.setEnabled(flag);
    }
    videoTrack = await createCameraVideoTrack();
    videoTrack.play('camera-video');
  };

  const turnOnMicrophone = async (flag) => {
    flag = flag ?? !isAudioOn;
    setIsAudioOn(flag);

    if (audioTrack) {
      return audioTrack.setEnabled(flag);
    }

    audioTrack = await createMicrophoneAudioTrack();
    // audioTrack.play();
  };

  const [isJoined, setIsJoined] = useState(false);
  const channel = useRef('');
  // you can apply appid follow the guide https://www.agora.io/en/blog/how-to-get-started-with-agora/
  const appid = useRef('');
  // you can apply token follow the guide https://www.agora.io/en/blog/how-to-get-started-with-agora/
  const token = useRef('');

  const joinChannel = async () => {
    if (!channel.current) {
      channel.current = 'react-room';
    }

    if (isJoined) {
      await leaveChannel();
    }

    client.on('user-published', onUserPublish);

    await client.join(
      // appid.current, - project app id
      // channel.current, - any channel name - same for both side - host and audience
      // token.current || null, - get token from agora project for channel and app
      'cd060fa6a6f74f60819fca04f7ff35e4', // current app token
      'ljnhosting', // channel name for broadcasting
      '007eJxTYOhk/PBzyxeOmOj2iz/sdbdPadpx99j3FdNX5B+S0pRm8lyuwJCcYmBmkJZolmiWZm6SZmZgYWiZlpxoYJJmnpZmbJpqsu6zZlpDICPDlUkCrIwMEAjiczHkZOVl5BeXZOalMzAAANBsJCM=', // genarated token - expires in one day. add logic to generate token each day or each hosting time. make sure token be same as host and audience.
      null // UID -- for specific user - add auth system to get and target each user and console or show them on screen
    );
    setIsJoined(true);
  };

  // function to leave agora channel.
  const leaveChannel = async () => {
    setIsJoined(false);
    setIsAudioPubed(false);
    setIsVideoPubed(false);

    await client.leave();
  };
  // function to publish host to server and then targetted audience
  const onUserPublish = async (user, mediaType) => {
    if (mediaType === 'video') {
      const remoteTrack = await client.subscribe(user, mediaType);
      remoteTrack.play('remote-video');
      setIsVideoSubed(true);
    }
    if (mediaType === 'audio') {
      const remoteTrack = await client.subscribe(user, mediaType);
      remoteTrack.play();
    }
  };

  const publishVideo = async () => {
    await turnOnCamera(true);

    if (!isJoined) {
      await joinChannel();
    }
    await client.publish(videoTrack);
    setIsVideoPubed(true);
  };

  const publishAudio = async () => {
    await turnOnMicrophone(true);

    if (!isJoined) {
      await joinChannel();
    }

    await client.publish(audioTrack);
    setIsAudioPubed(true);
  };

  return (
    <>
      <h1>Audience side</h1>
      <div className="left-side">
        {/* <h3>Please check you camera / microphone!</h3> */}
        {/* <div className="buttons">
          <button
            onClick={() => turnOnCamera()}
            className={isVideoOn ? 'button-on' : ''}
          >
            Turn {isVideoOn ? 'off' : 'on'} camera
          </button>
          <button
            onClick={() => turnOnMicrophone()}
            className={isAudioOn ? 'button-on' : ''}
          >
            Turn {isAudioOn ? 'off' : 'on'} Microphone
          </button>
        </div> */}

        {/* <input
          defaultValue={appid.current}
          placeholder="appid"
          onChange={(e) => (appid.current = e.target.value)}
        />
        <input
          defaultValue={token.current}
          placeholder="token"
          onChange={(e) => (token.current = e.target.value)}
        />
        <h3>Please input the channel name</h3>
        <input
          defaultValue={channel.current}
          onChange={(e) => (channel.current = e.target.value)}
        /> */}
        <div className="buttons">
          {!isJoined && (
            <button
              onClick={joinChannel}
              className={isJoined ? 'button-on' : ''}
            >
              Join Channel
            </button>
          )}
          {/* <button
            onClick={publishVideo}
            className={isVideoPubed ? 'button-on' : ''}
          >
            Publish Video
          </button> */}
          {/* <button
            onClick={publishAudio}
            className={isAudioPubed ? 'button-on' : ''}
          >
            Publish Audio
          </button> */}
          <button onClick={leaveChannel}>Leave Channel</button>
        </div>
      </div>
      <div className="right-side">
        <video id="camera-video" hidden={isVideoOn ? false : true}></video>
        <video id="remote-video" hidden={isVideoSubed ? false : true}></video>
        {/* {isJoined && !isVideoSubed ? (
          <div className="waiting">
            You can shared channel {channel.current} to others.....
          </div>
        ) : null} */}
      </div>
    </>
  );
}

export default AgoraAudience;
