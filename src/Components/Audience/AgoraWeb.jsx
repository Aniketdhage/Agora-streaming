// import { useRef, useState } from 'react';

// import {
//   VERSION,
//   createClient,
//   createCameraVideoTrack,
//   createMicrophoneAudioTrack,
//   onCameraChanged,
//   onMicrophoneChanged,
// } from 'agora-rtc-sdk-ng/esm';
// // import AgoraRTC, { AgoraRTCProvider } from 'agora-rtc-sdk-ng';
// // import { useRemoteUsers } from 'agora-rtc-react';

// console.log('Current SDK VERSION: ', VERSION);

// onCameraChanged((device) => {
//   console.log('onCameraChanged: ', device);
// });
// onMicrophoneChanged((device) => {
//   console.log('onMicrophoneChanged: ', device);
// });

// const client = createClient({
//   mode: 'live',
//   codec: 'h264',
// });
// let audioTrack;
// let videoTrack;
// function AgoraAudience() {
//   // const remoteUsers = useRemoteUsers();
//   // const numberOfRemoteUsers = remoteUsers.length;
//   // const remoteUser = remoteUsers[numberOfRemoteUsers - 1];
//   const [isAudioOn, setIsAudioOn] = useState(false);
//   const [isVideoOn, setIsVideoOn] = useState(false);
//   const [isAudioPubed, setIsAudioPubed] = useState(false);
//   const [isVideoPubed, setIsVideoPubed] = useState(false);
//   const [isVideoSubed, setIsVideoSubed] = useState(false);
//   // const agoraClient = AgoraRTC.createClient({ mode: 'live', codec: 'h264' });

//   const turnOnCamera = async (flag) => {
//     flag = flag ?? !isVideoOn;
//     setIsVideoOn(flag);

//     if (videoTrack) {
//       return videoTrack.setEnabled(flag);
//     }
//     videoTrack = await createCameraVideoTrack();
//     videoTrack.play('camera-video');
//   };

//   const turnOnMicrophone = async (flag) => {
//     flag = flag ?? !isAudioOn;
//     setIsAudioOn(flag);

//     if (audioTrack) {
//       return audioTrack.setEnabled(flag);
//     }

//     audioTrack = await createMicrophoneAudioTrack();
//     // audioTrack.play();
//   };

//   const [isJoined, setIsJoined] = useState(false);
//   const channel = useRef('');
//   // you can apply appid follow the guide https://www.agora.io/en/blog/how-to-get-started-with-agora/
//   const appid = useRef('');
//   // you can apply token follow the guide https://www.agora.io/en/blog/how-to-get-started-with-agora/
//   const token = useRef('');

//   const joinChannel = async () => {
//     if (!channel.current) {
//       channel.current = 'react-room';
//       client.setClientRole('audience');
//     }

//     if (isJoined) {
//       await leaveChannel();
//     }

//     client.on('user-published', onUserPublish);

//     await client.join(
//       // appid.current, -
//       // channel.current, - any channel name - same for both side - host and audience
//       // token.current || null, - get token from agora project for channel and app
//       'cd060fa6a6f74f60819fca04f7ff35e4', // current app ID
//       'ljnhosting', // channel name for broadcasting
//       '007eJxTYJig7udyJK3TrIn/hZML4679rqsdrB+/9lu3P2Z/fLNN0T0FhuQUAzODtESzRLM0c5M0MwMLQ8u05EQDkzTztDRj01SThgmOaQ2BjAyHl89kYIRCEJ+LIScrLyO/uCQzL52BAQD5XCI9', // genarated token -
//       null
//     );
//     setIsJoined(true);
//   };

//   // function to leave agora channel.
//   const leaveChannel = async () => {
//     setIsJoined(false);
//     setIsAudioPubed(false);
//     setIsVideoPubed(false);

//     await client.leave();
//   };
//   // function to publish host to server and then targetted audience
//   const onUserPublish = async (user, mediaType) => {
//     if (mediaType === 'video') {
//       const remoteTrack = await client.subscribe(user, mediaType);
//       remoteTrack.play('remote-video');
//       setIsVideoSubed(true);
//     }
//     if (mediaType === 'audio') {
//       const remoteTrack = await client.subscribe(user, mediaType);
//       remoteTrack.play();
//     }
//   };

//   const publishVideo = async () => {
//     await turnOnCamera(true);

//     if (!isJoined) {
//       await joinChannel();
//     }
//     await client.publish(videoTrack);
//     setIsVideoPubed(true);
//   };

//   const publishAudio = async () => {
//     await turnOnMicrophone(true);

//     if (!isJoined) {
//       await joinChannel();
//     }

//     await client.publish(audioTrack);
//     setIsAudioPubed(true);
//   };

//   // controlles
//   // const handleRemoteAudioVolumeChange = (evt) => {
//   //   if (remoteUser) {
//   //     const volume = parseInt(evt.target.value);
//   //     console.log('Volume of remote audio:', volume);
//   //     remoteUser.audioTrack?.setVolume(volume);
//   //   } else {
//   //     console.log('No remote user in the channel');
//   //   }
//   // };

//   return (
//     <>
//       <h1>Audience side</h1>
//       <div className="left-side">
//         <div className="buttons">
//           {!isJoined && (
//             <button
//               onClick={joinChannel}
//               className={isJoined ? 'button-on' : ''}
//             >
//               Join Channel
//             </button>
//           )}

//           <button onClick={leaveChannel}>Leave Channel</button>
//         </div>
//       </div>
//       <div className="right-side">
//         <iframe
//           id="camera-video"
//           hidden={isVideoOn ? false : true}
//           controls
//         ></iframe>
//         <video
//           id="remote-video"
//           hidden={isVideoSubed ? false : true}
//           controls
//         ></video>
//       </div>
//       <div>
//         <label>Remote Audio Level:</label>
//         <input
//           type="range"
//           min="0"
//           max="100"
//           step="1"
//           // onChange={handleRemoteAudioVolumeChange}
//         />
//       </div>
//     </>
//   );
// }

// export default AgoraAudience;

//_________________________________________//

import { useRef, useState } from 'react';

import {
  VERSION,
  createClient,
  createCameraVideoTrack,
  createMicrophoneAudioTrack,
  onCameraChanged,
  onMicrophoneChanged,
  AgoraRTC,
} from 'agora-rtc-sdk-ng/esm';
import { RemoteUser, useRemoteUsers } from 'agora-rtc-react';

console.log('Current SDK VERSION: ', VERSION);

onCameraChanged((device) => {
  console.log('onCameraChanged: ', device);
});
onMicrophoneChanged((device) => {
  console.log('onMicrophoneChanged: ', device);
});

const client = createClient({
  mode: 'live',
  codec: 'h264',
});
let audioTrack;
let videoTrack;
function AgoraAudience() {
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAudioPubed, setIsAudioPubed] = useState(false);
  const [isVideoPubed, setIsVideoPubed] = useState(false);
  const [isVideoSubed, setIsVideoSubed] = useState(false);
  const [isMuteVideo, setIsMuteVideo] = useState(false);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  // const agoraClient = AgoraRTC.createClient({ mode: 'live', codec: 'h264' });
  const remoteUsers = useRemoteUsers();

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
      channel.current = 'ljnhosting';
    }

    client
      .setClientRole('audience')
      .then(() => {
        // Your code to handle the resolution of the promise
        console.log(
          'Client role set to audience successfully_________________________________'
        );
      })
      .catch((error) => {
        // Your code to handle any errors
        console.error(
          'Error setting client role__________________________________________:',
          error
        );
      });

    if (isJoined) {
      await leaveChannel();
    }

    client.on('user-published', onUserPublish);

    await client.join(
      // appid.current, -
      // channel.current, - any channel name - same for both side - host and audience
      // token.current || null, - get token from agora project for channel and app
      'cd060fa6a6f74f60819fca04f7ff35e4', // current app ID
      'ljnhosting', // channel name for broadcasting
      '007eJxTYFihxnxw76o25aprneduuE4rWJC5JJt9SfuOL46yXE3GFw4qMCSnGJgZpCWaJZqlmZukmRlYGFqmJScamKSZp6UZm6aapIW7pDUEMjIY2BoyMjJAIIjPxZCTlZeRX1ySmZfOwAAAKyshcQ==', // genarated token -
      null
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
      remoteTrack.getVideoElementVisibleStatus('remote-video');
      setIsVideoSubed(true);
    }
    if (mediaType === 'audio') {
      const remoteTrack = await client.subscribe(user, mediaType);
      if (isAudioEnabled) {
        remoteTrack.stop();
      } else {
        remoteTrack.stop();
      }
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

  const toggleAudio = async () => {
    // if (isAudioEnabled) {
    onUserPublish('', 'audio');
    setIsAudioEnabled(!isAudioEnabled);
    console.log('__________local audio track', localAudioTrack);
    // } else {
    //   await localAudioTrack.setEnabled(true);
    //   setIsAudioEnabled(true);
    // }
  };

  return (
    <>
      <h1>Audience side</h1>
      <div className="left-side">
        <div className="buttons">
          {!isJoined && (
            <button
              onClick={joinChannel}
              className={isJoined ? 'button-on' : ''}
            >
              Join Channel
            </button>
          )}

          <button onClick={leaveChannel}>Leave Channel</button>
        </div>
      </div>
      <div className="right-side">
        <iframe
          id="camera-video"
          hidden={isVideoOn ? false : true}
          controls
        ></iframe>
        <video
          id="remote-video"
          hidden={isVideoSubed ? false : true}
          controls
        ></video>
      </div>
      {remoteUsers.map((remoteUser) => (
        <div
          className="vid"
          style={{ height: 300, width: 600 }}
          key={remoteUser.uid}
        >
          <RemoteUser user={remoteUser} playVideo={true} playAudio={true} />
        </div>
      ))}
      <div>
        {/* <label>Remote Audio Level:</label>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          // onChange={handleRemoteAudioVolumeChange}
        /> */}
        <button onClick={toggleAudio}>
          Toggle Audio : {isAudioEnabled ? 'yes' : 'no'}
        </button>
      </div>
    </>
  );
}

export default AgoraAudience;
