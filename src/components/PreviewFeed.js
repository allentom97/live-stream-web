import React, { Component } from 'react';

export default class PreviewFeed extends Component {
    constructor (props) {
        super(props)
        
        this.state = {
            previewfeeds: props.feeds
        }
    };
    render() {
        return (
        <div>      
            <div className="previews-container">
                {
                    this.state.previewfeeds.map(( feed ) => {
                        return (
                            <div className="preview-container">
                                <p className="preview-text">Stream: {feed.url}</p>
                                <video autoplays playsinline className="preview-video"> </video>
                            </div>
                        )
                    })
                }   
            </div>
        </div>

        );
  }
}

