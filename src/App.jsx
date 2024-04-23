import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import AgoraAudience from './Components/Audience/AgoraWeb';
import AgoraHosting from './Components/Host/AgoraWeb';
import SelectType from './Components/SelectType';
// import './App.css';
// import AgoraBroadcastStreaming from './Components/AgoraBroadcastStreaming';
// import { LiveVideo } from './Components/LiveCheck';
// import AgoraWeb from './Components/AgoraWeb';

function App() {
  const [count, setCount] = useState(0);

  return (
    // <>
    // {/* <AgoraBroadcastStreaming /> */}
    // {/* <LiveVideo /> */}
    // {/* <AgoraWeb /> */}
    // {/* </> */}
    <Router>
      <Routes>
        <Route path="/" element={<SelectType />} />
        <Route path="/audience" element={<AgoraAudience />} />
        <Route path="/host" element={<AgoraHosting />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
