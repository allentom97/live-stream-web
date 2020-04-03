import React from 'react';

const Video  = (props) =>(
    <div className="video-container">  
    <div className="video-player-container">
            <p className="current-stream">Currently Viewing Stream: {props.currentStream}</p>
            <video autoPlay muted controls className="video-player" id='mainStream' ></video>
        </div>
    </div>
)

export default Video;