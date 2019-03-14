import React from 'react';

const Video  = (props) =>(
    <div className="video-container">  
        <p className="current-stream">Currently Viewing Stream: {props.currentStream}</p>
        <video autoPlay muted controls className="video-player" id='mainStream' ></video>
    </div>
)

export default Video;