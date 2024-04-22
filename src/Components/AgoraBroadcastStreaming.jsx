import React, { useState, useEffect } from 'react';
import {
  AgoraRTCProvider,
  useRTCClient,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteUsers,
  RemoteUser,
  LocalVideoTrack,
  useJoin,
} from 'agora-rtc-react';

const AgoraBroadcastStreaming = () => {
  const agoraClient = useRTCClient();
  const [localCameraTrackT, setLocalCameraTrack] = useState(null);
  const [localMicrophoneTrackT, setLocalMicrophoneTrack] = useState(null);
  const [joined, setJoined] = useState(false);
  const remoteUsers = useRemoteUsers();
  // const camera = useLocalCameraTrack();
  // const microphoneAccess = useLocalMicrophoneTrack();
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
  const { isLoading: isLoadingMic, localMicrophoneTrack } =
    useLocalMicrophoneTrack();
  // usePublish([localCameraTrack, localMicrophoneTrack]);
  const { error: publishError, publish } = usePublish([
    localCameraTrack,
    localMicrophoneTrack,
  ]);
  // useJoin({
  //   appid: "cd060fa6a6f74f60819fca04f7ff35e4",
  //   channel: "ljnhosting",
  //   token:
  //     "007eJxTYCjl6Fd/tGPWXr/bxXyGGmVnWmq6RbZqTNTimPnBZPbuQBcFhuQUAzODtESzRLM0c5M0MwMLQ8u05EQDkzTztDRj01QTB2ultIZARgbTrEuMjAwQCOJzMeRk5WXkF5dk5qUzMAAAme4gIA==",
  //   uid: 125,
  // });
  useEffect(() => {
    const init = async () => {
      const [cameraTrack, microphoneTrack] = await Promise.all([
        localCameraTrack,
        localMicrophoneTrack,
      ]);
      setLocalCameraTrack(cameraTrack);
      setLocalMicrophoneTrack(microphoneTrack);
    };

    init();
  }, []);
  console.log('Aaplach camera ', localCameraTrack);

  const handleJoinChannel = async () => {
    if (!joined) {
      try {
        const response = await agoraClient.join(
          // "cd060fa6a6f74f60819fca04f7ff35e4",
          // "ljnhosting",
          // null
          'cd060fa6a6f74f60819fca04f7ff35e4',
          'ljnhosting',
          '007eJxTYJB4IrCQSebGo03LVnDE33Vm//9NaZVFXMSfORvOJ/HM3OavwJCcYmBmkJZolmiWZm6SZmZgYWiZlpxoYJJmnpZmbJpqInZBNa0hkJHhwWkeZkYGCATxuRhysvIy8otLMvPSGRgAMw0iaw=='
        );
        // await publish();
        setJoined(true);
        console.log('++++++++++++++++++++++++++', response);
      } catch (error) {
        console.error('Failed to join channel:', error);
      }
    } else {
      await agoraClient.leave();
      setJoined(false);
    }
  };
  const handleRoleChange = (event) => {
    agoraClient
      .setClientRole('audience')
      .then(() => {
        // Your code to handle the resolution of the promise
        console.log('Client role set to audience successfully');
      })
      .catch((error) => {
        // Your code to handle any errors
        console.error('Error setting client role:', error);
      });
  };
  console.log(remoteUsers);
  console.log('____________', joined);

  return (
    <div>
      <h1>Agora Broadcast Streaming</h1>
      <div>
        <button onClick={handleJoinChannel}>
          {joined ? 'Leave Channel' : 'Join Channel'}
        </button>
      </div>
      <div>
        <h2>Local Stream</h2>
        <div style={{ width: '300px', height: '200px' }}>
          {localCameraTrack && localCameraTrack.mediaStream && (
            <video
              ref={(node) => (node.srcObject = localCameraTrack.mediaStream)}
              autoPlay
            />
          )}
          <LocalVideoTrack track={localCameraTrack} play={true} />
        </div>
      </div>
      <div>
        <h2>Remote Streams</h2>
        {remoteUsers.map((user) => (
          <div key={user.uid}>
            <RemoteUser user={user} playVideo={true} playAudio={true} />
          </div>
        ))}
      </div>
      <button onClick={handleRoleChange}>change</button>
    </div>
  );
};

export default AgoraBroadcastStreaming;
