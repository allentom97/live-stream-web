import React, { Component } from 'react';
import ResponseFeed from './ResponseFeed';

export default class VideoFeed extends Component {
    constructor (props) {
        super(props)
    
        this.state= {
            stream: 1
        }
    }

  render() {
    return (
      <div>      
        <div className="director-container"> 
            <div className="video-container">  
                <p className="current-stream">Currently Viewing Stream: {this.state.stream}</p>
                <video autoplays='true' className="video-player" id="remoteStream"></video>
            </div>
            <ResponseFeed />
        </div>
      </div>

    );
  }
}

