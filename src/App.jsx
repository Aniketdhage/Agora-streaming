import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
// import './App.css';
// import AgoraBroadcastStreaming from './Components/AgoraBroadcastStreaming';
// import { LiveVideo } from './Components/LiveCheck';
import AgoraWeb from './Components/AgoraWeb';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* <AgoraBroadcastStreaming /> */}
      {/* <LiveVideo /> */}
      <AgoraWeb />
    </>
  );
}

export default App;
