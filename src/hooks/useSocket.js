import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const useSocket = (endpoint) => {
  const [serverResponse, setServerResponse] = useState(null);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const steamIdRef = useRef('');

  useEffect(() => {
    if (buttonClicked) {
      const socket = io(endpoint);

      // Event handler for when the connection is established
      socket.on('connect', () => {
        console.log('Connected to the server');

        // Emit the 'connect_with_steamid' event with the SteamID
        socket.emit('connect_with_steamid', { steamid: steamIdRef.current });
        setIsConnected(true);
      });

      // Event handler for the 'connected' event from the server
      socket.on('connected', (data) => {
        console.log('Server says:', data.message);
        setServerResponse(data.message);
      });

      // Event handler for 'game_state_update'
      socket.on('game_state_update', (data) => {
        console.log('Game state update:', data);

        // Update the serverResponse state with the 'game_state_update' data
        setServerResponse(data); 
      });

      // Event handler for 'disconnect_with_steamid'
      socket.on('disconnect_with_steamid', () => {
        console.log('Disconnecting with SteamID');
        setIsConnected(false);
        // Perform any additional cleanup or actions if needed
      });

      // Event handler for when the connection is closed
      socket.on('disconnect', () => {
        console.log('Disconnected from the server');
        setIsConnected(false);
      });

      // Cleanup function to disconnect when the component unmounts
      return () => {
        socket.disconnect();
      };
    }
  }, [buttonClicked]);

  const handleConnect = (steamId) => {
    steamIdRef.current = steamId;
    const socket = io(endpoint);
    socket.emit('connect_with_steamid', { steamid: steamId });
    setButtonClicked(true);
  };

  const handleDisconnect = () => {
    // Emit 'disconnect_with_steamid' event when disconnecting
    const socket = io(endpoint);
    socket.emit('disconnect_with_steamid', { steamid: steamIdRef.current });
    
    setButtonClicked(false);
    setServerResponse(null);
  };

  return {
    serverResponse,
    buttonClicked,
    isConnected,
    handleConnect,
    handleDisconnect,
  };
};

export default useSocket;