import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const useSocket = (endpoint) => {
  const [serverResponse, setServerResponse] = useState(null);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const steamIdRef = useRef('');
  const socketRef = useRef(null);

  useEffect(() => {
    if (buttonClicked) {
      // Create a new socket instance only if it doesn't exist
      if (!socketRef.current) {
        socketRef.current = io(endpoint);

        // Event handler for when the connection is established
        socketRef.current.on('connect', () => {
          console.log('Connected to the server');
          socketRef.current.emit('connect_with_steamid', { steamid: steamIdRef.current });
          setIsConnected(true);
        });

        // Event handler for the 'connected' event from the server
        socketRef.current.on('connected', (data) => {
          console.log('Server says:', data.message);
          setServerResponse(data.message);
        });

        // Event handler for 'game_state_update'
        socketRef.current.on('game_state_update', (data) => {
          console.log('Game state update:', data);
          setServerResponse(data); 
        });

        // Event handler for 'disconnect_with_steamid'
        socketRef.current.on('disconnect_with_steamid', () => {
          console.log('Disconnecting with SteamID');
          setIsConnected(false);
          // Perform any additional cleanup or actions if needed
        });

        // Event handler for when the connection is closed
        socketRef.current.on('disconnect', () => {
          console.log('Disconnected from the server');
          setIsConnected(false);
        });
      }

      // Cleanup function to disconnect when the component unmounts
      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }
  }, [buttonClicked]);

  const handleConnect = (steamId) => {
    steamIdRef.current = steamId;
    setButtonClicked(true);
  };

  const handleDisconnect = () => {
    if (socketRef.current) {
      socketRef.current.emit('disconnect_with_steamid', { steamid: steamIdRef.current });
    }
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
