import React, { ChangeEvent, useState } from 'react';
import '../styles/InputForm.css';

function InputForm({
  onConnectButtonClick,
  onDisconnectButtonClick,
  connectButtonDisabled,
  disconnectButtonDisabled,
}) {
  const [steamId, setSteamId] = useState('');
  const [inputDisabled, setInputDisabled] = useState(false);
  const [promptMessage, setPromptMessage] = useState(null);

  const handleSteamIdChange = (e) => {
    setSteamId(e.target.value);
    // Clear the prompt when the user interacts with the input
    setPromptMessage(null);
  };

  const handleConnectButtonClick = () => {
    if (steamId.trim() === '') {
      setPromptMessage('Please enter your SteamID.');
      return;
    }

    onConnectButtonClick(steamId);
    setInputDisabled(true);
  };

  const handleDisconnectButtonClick = () => {
    onDisconnectButtonClick();
    setInputDisabled(false);
    setSteamId('');
  };

  const handleFindSteamIDButtonClick = () => {
    console.log('find SteamID by doing this..')
  }

  return (
    <div className="input-form">
      <div className="button-container">
        <input
          type="text"
          placeholder="Enter SteamID"
          value={steamId}
          onChange={handleSteamIdChange}
          disabled={inputDisabled}
        />
      </div>
      {promptMessage && <div className="prompt">{promptMessage}</div>}
      <div className="button-container">
      <button type="button" onClick={handleDisconnectButtonClick} disabled={disconnectButtonDisabled} className="disconnect">
          Disconnect
        </button>
        <button type="button" onClick={handleConnectButtonClick} disabled={connectButtonDisabled} className="connect">
          Connect
        </button>
      </div>
      <a href="#" onClick={handleFindSteamIDButtonClick} className="findSteamId">
        How do I find my SteamID?
      </a>
    </div>
  );
}

export default InputForm;