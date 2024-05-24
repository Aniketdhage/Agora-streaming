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
function AgoraHosting() {
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAudioPubed, setIsAudioPubed] = useState(false);
  const [isVideoPubed, setIsVideoPubed] = useState(false);
  const [isVideoSubed, setIsVideoSubed] = useState(false);
  const [inputToken, setInputToken] = useState('');

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

    if (isJoined) {
      await leaveChannel();
    }

    client.on('user-published', onUserPublish);

    await client.join(
      // appid.current,
      // channel.current,
      // token.current || null,
      'cd060fa6a6f74f60819fca04f7ff35e4',
      'ljnhosting',
      // '007eJxSYODX508K6FyqLWEy8f5tOQnTvy%2B%2FdnaqTTrb%2BTPbMuf8Ti8FhuQUAzODtESzRLM0c5M0MwMLQ8u05EQDkzTztDRj01STDoOAtIZARobKCV3MjAwQCOJzMeRk5WXkF5dk5qUzMxgZGQMCAAD%2F%2Fz2BIik%3D',
      inputToken,
      null
    );
    setIsJoined(true);
  };

  const leaveChannel = async () => {
    setIsJoined(false);
    setIsAudioPubed(false);
    setIsVideoPubed(false);
    await turnOnMicrophone(false);
    await turnOnCamera(false);

    await client.leave();
  };

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
    await turnOnMicrophone(true);

    if (!isJoined) {
      await joinChannel();
    }
    await client.publish(videoTrack);
    await client.publish(audioTrack);
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
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <h1>
        <b>LJN</b> Host side
      </h1>
      <div className="left-side">
        {isVideoPubed && <h3>Please check you camera / microphone!</h3>}

        {isVideoPubed && (
          <div
            className="buttons"
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <button
              onClick={() => turnOnCamera()}
              className={isVideoOn ? 'button-on' : ''}
              style={{
                padding: '10px',
                borderRadius: '4px',
              }}
            >
              Turn {isVideoOn ? 'off' : 'on'} camera
            </button>
            <button
              onClick={() => turnOnMicrophone()}
              className={isAudioOn ? 'button-on' : ''}
              style={{
                padding: '10px',
                borderRadius: '4px',
              }}
            >
              Turn {isAudioOn ? 'off' : 'on'} Microphone
            </button>
          </div>
        )}
        {!isVideoPubed && (
          <div>
            <input
              type="text"
              placeholder="Please enter agora token"
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              style={{
                padding: '12px',
                marginBottom: '16px',
              }}
            />
          </div>
        )}

        <div
          className="buttons"
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          {!isVideoPubed ? (
            <button
              onClick={publishVideo}
              className={isVideoPubed ? 'button-on' : ''}
              disabled={inputToken ? false : true}
              style={{
                margin: '0px auto',
              }}
            >
              Host streaming
            </button>
          ) : (
            <button
              onClick={leaveChannel}
              style={{
                margin: '12px 0px',
                width: '100%',
                padding: '10px',
                border: 'none',
                backgroundColor: 'red',
                color: 'white',
              }}
            >
              Leave Channel
            </button>
          )}
        </div>
      </div>
      <div
        className="right-side"
        style={{
          height: '100%',
          margin: 'auto 0px',
        }}
      >
        <video id="camera-video" hidden={isVideoOn ? false : true}></video>
        <video id="remote-video" hidden={isVideoSubed ? false : true}></video>
      </div>
    </div>
  );
}

export default AgoraHosting;

// import { useRef, useState } from 'react';

// import {
//   VERSION,
//   createClient,
//   createCameraVideoTrack,
//   createMicrophoneAudioTrack,
//   onCameraChanged,
//   onMicrophoneChanged,
// } from 'agora-rtc-sdk-ng/esm';

// console.log('Current SDK VERSION: ', VERSION);

// onCameraChanged((device) => {
//   console.log('onCameraChanged: ', device);
// });
// onMicrophoneChanged((device) => {
//   console.log('onMicrophoneChanged: ', device);
// });

// // const client = createClient({
// //   mode: 'rtc',
// //   codec: 'vp8',
// // });
// let audioTrack;
// let videoTrack;
// function AgoraHosting({ client }) {
//   const [isAudioOn, setIsAudioOn] = useState(false);
//   const [isVideoOn, setIsVideoOn] = useState(false);
//   const [isAudioPubed, setIsAudioPubed] = useState(false);
//   const [isVideoPubed, setIsVideoPubed] = useState(false);
//   const [isVideoSubed, setIsVideoSubed] = useState(false);

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
//     // Disable microphone for audience
//     // return;

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
//       channel.current = 'ljnhosting';
//     }
//     await client
//       .setClientRole('audience')
//       .then(() => {
//         // Your code to handle the resolution of the promise
//         console.log(
//           'Client role set to host successfully_________________________________'
//         );
//       })
//       .catch((error) => {
//         // Your code to handle any errors
//         console.error(
//           'Error setting client role__________________________________________:',
//           error
//         );
//       });

//     if (isJoined) {
//       await leaveChannel();
//     }

//     client.on('user-published', onUserPublish);

//     await client.join(
//       // appid.current,
//       // channel.current,
//       // token.current || null,
//       'cd060fa6a6f74f60819fca04f7ff35e4',
//       'ljnhosting',
//       '007eJxTYCi6da+7dM39p1zZNxqz7gY9/mruLnxH6l/4Xt3GmZ0rLvkpMCSnGJgZpCWaJZqlmZukmRlYGFqmJScamKSZp6UZm6aanHjplNYQyMigf3YnEyMDBIL4XAw5WXkZ+cUlmXnpDAwAJvAldQ==',
//       null
//     );
//     setIsJoined(true);
//   };

//   const leaveChannel = async () => {
//     setIsJoined(false);
//     setIsAudioPubed(false);
//     setIsVideoPubed(false);
//     await turnOnMicrophone(false);
//     await turnOnCamera(false);

//     await client.leave();
//   };

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
//     await turnOnMicrophone(true);

//     if (!isJoined) {
//       await joinChannel();
//     }
//     await client.publish(videoTrack);
//     await client.publish(audioTrack);
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

//   return (
//     <>
//       <h1>Host side</h1>
//       <div className="left-side">
//         <h3>Please check you camera / microphone!</h3>
//         <div className="buttons">
//           <button
//             onClick={() => turnOnCamera()}
//             className={isVideoOn ? 'button-on' : ''}
//           >
//             Turn {isVideoOn ? 'off' : 'on'} camera
//           </button>
//           <button
//             onClick={() => turnOnMicrophone()}
//             className={isAudioOn ? 'button-on' : ''}
//           >
//             Turn {isAudioOn ? 'off' : 'on'} Microphone
//           </button>
//         </div>

//         <div className="buttons">
//           <button
//             onClick={publishVideo}
//             className={isVideoPubed ? 'button-on' : ''}
//           >
//             Host streaming
//           </button>

//           <button onClick={leaveChannel}>Leave Channel</button>
//         </div>
//       </div>
//       <div className="right-side">
//         <video id="camera-video" hidden={isVideoOn ? false : true}></video>
//         <video id="remote-video" hidden={isVideoSubed ? false : true}></video>
//       </div>
//     </>
//   );
// }

// export default AgoraHosting;
