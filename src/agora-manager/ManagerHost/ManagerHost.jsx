import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  LocalVideoTrack,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRTCClient,
  useRemoteUsers,
  useClientEvent,
} from 'agora-rtc-react';

const AgoraContext = createContext(null);

export const AgoraProvider = ({
  children,
  localCameraTrack,
  localMicrophoneTrack,
}) => (
  <AgoraContext.Provider value={{ localCameraTrack, localMicrophoneTrack }}>
    {children}
  </AgoraContext.Provider>
);

export const useAgoraContext = () => {
  const context = useContext(AgoraContext);
  if (!context)
    throw new Error('useAgoraContext must be used within an AgoraProvider');
  return context;
};

const ManagerHost = ({ config }) => {
  const agoraEngine = useRTCClient();
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
  const { isLoading: isLoadingMic, localMicrophoneTrack } =
    useLocalMicrophoneTrack();
  const remoteUsers = useRemoteUsers();
  const [role, setRole] = useState('host');
  agoraEngine
    .setClientRole(role)
    .then(() => console.log('Client role set to', role, 'successfully'))
    .catch((error) => console.error('Error setting client role:', error));
  useJoin({
    appid: config.appId,
    channel: config.channelName,
    token: config.rtcToken,
    uid: config.uid,
  });
  usePublish([localMicrophoneTrack, localCameraTrack]);

  useClientEvent(agoraEngine, 'user-joined', (user) => {
    console.log('The user', user.uid, ' has joined the channel');
  });

  useClientEvent(agoraEngine, 'user-left', (user) => {
    console.log('The user', user.uid, ' has left the channel');
  });

  useClientEvent(agoraEngine, 'user-published', (user, mediaType) => {
    console.log('The user', user.uid, ' has published media in the channel');
  });

  const handleRoleChange = (event) => {
    setRole(event.target.value);
    const newRole = event.target.value;

    if (newRole === 'host') {
      joinMeeting();
      publishMeeting();
    } else {
      joinMeeting();
    }
  };

  useEffect(() => {
    return () => {
      localCameraTrack?.close();
      localMicrophoneTrack?.close();
    };
  }, []);

  const deviceLoading = isLoadingMic || isLoadingCam;
  if (deviceLoading) return <div>Loading devices...</div>;

  return (
    <AgoraProvider
      localCameraTrack={localCameraTrack}
      localMicrophoneTrack={localMicrophoneTrack}
    >
      <>
        {config.selectedProduct === 'live' && (
          <div>
            {/* <label>
              <input
                type="radio"
                value="host"
                checked={role === 'host'}
                onChange={handleRoleChange}
              />
              Host
            </label>
            <label>
              <input
                type="radio"
                value="audience"
                checked={role === 'audience'}
                onChange={handleRoleChange}
              />
              Audience
            </label> */}
          </div>
        )}
      </>
      <div id="videos">
        <div className="vid" style={{ height: 300, width: 600 }}>
          <LocalVideoTrack track={localCameraTrack} play={true} />
        </div>
        {/* {remoteUsers.map((remoteUser) => (
          <div
            className="vid"
            style={{ height: 300, width: 600 }}
            key={remoteUser.uid}
          >
            <RemoteUser user={remoteUser} playVideo={true} playAudio={true} />
          </div>
        ))} */}
      </div>
    </AgoraProvider>
  );
};

export default ManagerHost;
