import React from 'react';
import Header from './components/Header.js';
import InputForm from './components/InputForm.js';
import ServerResponse from './components/ServerResponse.js';
import useSocket from './hooks/useSocket.js';
import './styles/App.css';

// const ENDPOINT = 'https://gsi-server-256a7749499a.herokuapp.com/';
const ENDPOINT = 'http://127.0.0.1:8888';

function App() {
  const { serverResponse, buttonClicked, handleConnect, handleDisconnect } = useSocket(ENDPOINT);

  return (
    <div className="center-container">
      <Header />
      <div className="App">
        <InputForm
          onConnectButtonClick={handleConnect}
          onDisconnectButtonClick={handleDisconnect}
          connectButtonDisabled={buttonClicked}
          disconnectButtonDisabled={!buttonClicked}
        />
        <ServerResponse response={serverResponse} />
      </div>
    </div>
  );
}

export default App;
