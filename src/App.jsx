import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import AgoraAudience from './Components/Audience/AgoraWeb';
import AgoraHosting from './Components/Host/AgoraWeb';
import SelectType from './Components/SelectType';
import AgoraRTC, { AgoraRTCProvider, useRTCClient } from 'agora-rtc-react';

import config from './agora-manager/config';
import AgoraManager from './agora-manager/agoraManager';
import ManagerHost from './agora-manager/ManagerHost/ManagerHost';
import ManagerAudience from './agora-manager/ManagerAudience/ManagerAudience';

// import './App.css';
// import AgoraBroadcastStreaming from './Components/AgoraBroadcastStreaming';
// import { LiveVideo } from './Components/LiveCheck';
// import AgoraWeb from './Components/AgoraWeb';

function App() {
  const [count, setCount] = useState(0);
  const agoraEngine = useRTCClient(
    AgoraRTC.createClient({
      codec: 'vp8',
      mode: 'rtc',
      appId: 'cd060fa6a6f74f60819fca04f7ff35e4',
    })
  );

  return (
    // <>
    // {/* <AgoraBroadcastStreaming /> */}
    // {/* <LiveVideo /> */}
    // {/* <AgoraWeb /> */}
    // {/* </> */}
    <Router>
      <Routes>
        <Route path="/" element={<SelectType />} />
        <Route
          path="/audience"
          element={
            <AgoraRTCProvider client={agoraEngine}>
              <AgoraAudience client={agoraEngine} />
            </AgoraRTCProvider>
          }
        />

        <Route
          path="/host"
          element={
            <AgoraRTCProvider client={agoraEngine}>
              <AgoraHosting client={agoraEngine} />
            </AgoraRTCProvider>
          }
        />
        <Route
          path="/managerhost"
          element={
            <AgoraRTCProvider client={agoraEngine}>
              <ManagerHost config={config} />
            </AgoraRTCProvider>
          }
        />
        <Route
          path="/manageraudience"
          element={
            <AgoraRTCProvider client={agoraEngine}>
              <ManagerAudience config={config} />
            </AgoraRTCProvider>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
