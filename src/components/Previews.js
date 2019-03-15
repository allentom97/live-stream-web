import React from 'react';

const Previews = (props) => (
    <div className="previews-container" style={props.flexDirect}>
        { props.connections &&
            props.connections.map(( connection, index ) => {
                return (
                    <div key={index} className="preview-container">
                        <div className="top-container">
                            <p className="preview-text">Stream: {connection}</p>
                            <button disabled={!props.disabled} className="preview-button" onClick={() => props.onPreviewClicked(index, connection)} >View</button>
                            <label className="checkbox-text">
                                Message:
                                <input type="checkbox" onChange={() => props.onChecked(connection)} />	
                            </label>
                            <p className="option-text" id={connection}>Option:</p>
                        </div>
                        <video autoPlay muted controls className="preview-video" id={index}> </video>
                    </div>
                )
            })
        }   
    </div>
)

export default Previews
  