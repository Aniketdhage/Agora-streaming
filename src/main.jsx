import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
// import AgoraRTC from 'agora-rtc-sdk-ng';
// import { AgoraRTCProvider } from 'agora-rtc-react';

// const agoraRTCClient = AgoraRTC.createClient({
//   codec: 'h264',
//   mode: 'live',
//   appId: 'cd060fa6a6f74f60819fca04f7ff35e4',
// });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <AgoraRTCProvider client={agoraRTCClient}> */}
    <App />
    {/* </AgoraRTCProvider> */}
  </React.StrictMode>
);
