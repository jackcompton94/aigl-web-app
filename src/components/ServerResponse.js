// ServerResponse.js

import React, { useEffect, useState } from 'react';
import '../styles/ServerResponse.css';

function ServerResponse({ response }) {
  const [typedResponse, setTypedResponse] = useState('');

  useEffect(() => {

    setTypedResponse('');

    if (response !== null) {
      let index = 0;
      const typingInterval = setInterval(() => {
        const nextChar = response.charAt(index);
        if (nextChar !== typedResponse.charAt(typedResponse.length)) {
          setTypedResponse((prev) => prev + nextChar);
        }
        index++;
        if (index === response.length) {
          clearInterval(typingInterval);
        }
      }, 10); // Adjusts typing speed
    }
  }, [response]);

  return (
    <div className="server-response">
      {typedResponse !== '' && (
        <div className="formatted-response">{typedResponse}</div>
      )}
    </div>
  );
}

export default ServerResponse;

