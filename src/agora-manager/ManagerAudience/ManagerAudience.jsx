import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  RemoteUser,
  useJoin,
  useLocalMicrophoneTrack,
  useRTCClient,
  useRemoteUsers,
  useClientEvent,
} from 'agora-rtc-react';

const AgoraContext = createContext(null);

export const AgoraProvider = ({
  children,
  localCameraTrack,
  localMicrophoneTrack,
}) => <AgoraContext.Provider>{children}</AgoraContext.Provider>;

export const useAgoraContext = () => {
  const context = useContext(AgoraContext);
  if (!context)
    throw new Error('useAgoraContext must be used within an AgoraProvider');
  return context;
};

const ManagerAudience = ({ config }) => {
  const agoraEngine = useRTCClient();
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  const remoteUsers = useRemoteUsers();
  const [role, setRole] = useState('audience');
  // agoraEngine
  //   .setClientRole(role)
  //   .then(() => console.log('Client role set to', role, 'successfully'))
  //   .catch((error) => console.error('Error setting client role:', error));
  useJoin({
    appid: config.appId,
    channel: config.channelName,
    token: config.rtcToken,
    uid: config.uid,
  });
  // usePublish([localMicrophoneTrack, localCameraTrack]);

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
    agoraEngine
      .setClientRole(newRole)
      .then(() => console.log('Client role set to', newRole, 'successfully'))
      .catch((error) => console.error('Error setting client role:', error));

    if (newRole === 'host') {
      joinMeeting();
      publishMeeting();
    } else {
      joinMeeting();
    }
  };

  // useEffect(() => {
  //   return () => {
  //     localCameraTrack?.close();
  //     localMicrophoneTrack?.close();
  //   };
  // }, []);

  return (
    <AgoraProvider>
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
        {remoteUsers.map((remoteUser) => (
          <div
            className="vid"
            style={{ height: 300, width: 600 }}
            key={remoteUser.uid}
          >
            <RemoteUser
              user={remoteUser}
              playVideo={true}
              playAudio={isAudioEnabled}
            />
          </div>
        ))}
      </div>
      <button onClick={() => setIsAudioEnabled(!isAudioEnabled)}>
        Toggle Audio : {isAudioEnabled ? 'yes' : 'no'}
      </button>
    </AgoraProvider>
  );
};

export default ManagerAudience;
