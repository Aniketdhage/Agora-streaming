import React, { createContext, useContext, useState, useEffect } from 'react';
import { RemoteUser, useJoin, useRemoteUsers } from 'agora-rtc-react';

const AgoraContext = createContext(null);

export const AgoraProvider = ({ children }) => (
  <AgoraContext.Provider>{children}</AgoraContext.Provider>
);

export const useAgoraContext = () => {
  const context = useContext(AgoraContext);
  if (!context)
    throw new Error('useAgoraContext must be used within an AgoraProvider');
  return context;
};

const ManagerAudience = ({ config }) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  const remoteUsers = useRemoteUsers();

  useJoin({
    appid: config.appId,
    channel: config.channelName,
    token: config.rtcToken,
    uid: config.uid,
  });

  return (
    <AgoraProvider>
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
            <button onClick={() => setIsAudioEnabled(!isAudioEnabled)}>
              Toggle Audio : {isAudioEnabled ? 'yes' : 'no'}
            </button>
          </div>
        ))}
      </div>
    </AgoraProvider>
  );
};

export default ManagerAudience;
