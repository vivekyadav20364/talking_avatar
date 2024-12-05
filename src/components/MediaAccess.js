import React, { useState } from 'react';

function MediaAccess() {
  const [hasAccess, setHasAccess] = useState(false);

  const requestAccess = async () => {
    // Request access for both audio and video
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    });

    if (stream) {
      setHasAccess(true);
      // Use the stream (e.g., display video in a component)
    } else {
      // Handle access denial (optional)
    }
  };

  return (
    <div>
      {hasAccess ? (
        <p>You have access to audio and camera.</p>
      ) : (
        <button onClick={requestAccess}>Allow Audio & Camera Access</button>
      )}
    </div>
  );
}


export default MediaAccess;