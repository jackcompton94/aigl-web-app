import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const useSocket = (endpoint) => {
  const [serverResponse, setServerResponse] = useState(null);
  const [buttonClicked, setButtonClicked] = useState(false);
  const steamIdRef = useRef('');
  const socketRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (buttonClicked) {
      // Create a new socket instance only if it doesn't exist
      if (!socketRef.current) {
        socketRef.current = io(endpoint);

        // Event handler for when the connection is established
        socketRef.current.on('connect', () => {
          console.log('Connecting to the server...');
          socketRef.current.emit('connect_with_steamid', { steamid: steamIdRef.current });

          // Clear the timeout and start a new one when the connection is established
          clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(handleAutoDisconnect, 1000); // Auto disconnect after 30 seconds of inactivity
        });

        // Event handler for the 'connect_with_steamid' event from the server
        socketRef.current.on('connect_with_steamid', (data) => {
          console.log('Server says:', data.message);
          setServerResponse(data.message);
        });

        // Event handler for 'game_state_update'
        socketRef.current.on('game_state_update', (data) => {
          console.log('Game state update:', data);
          setServerResponse(data); 

          // Reset the timeout on receiving any server response
          clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(handleAutoDisconnect, 1000); // Reset the timeout
        });

        // Event handler for when the connection is closed
        socketRef.current.on('disconnect', () => {
          console.log('Disconnected from the server');
        });
      }

      // Cleanup function to disconnect when the component unmounts
      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
        clearTimeout(timeoutRef.current); // Clear the timeout on component unmount
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
    clearTimeout(timeoutRef.current); // Clear the timeout when disconnecting manually
  };

  // Function to handle auto disconnection
  const handleAutoDisconnect = () => {
    // TODO: Fix the bug where this doesnt actually disconnect from the client
    handleDisconnect();
  };

  return {
    serverResponse,
    buttonClicked,
    handleConnect,
    handleDisconnect,
  };
};

export default useSocket;
