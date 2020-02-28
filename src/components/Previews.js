import React from 'react';

const Previews = (props) => (
    <div className="previews-container" style={props.flexDirect}>
        { props.connections &&
            props.connections.map(( connection, index ) => {
                return (
                    <div key={index} className="preview-container">
                        <div className="top-container">
                            <p className="preview-text">Stream: {connection}</p>
                            <p className="checkbox-text">Recipient: </p>
                            <input type="checkbox" className="checkbox-box" onChange={() => props.onChecked(connection)} />
                        </div>
                        <video autoPlay muted className="preview-video" onClick={() => props.onPreviewClicked(index, connection)} id={index}> </video>
                        <p className="question-text" id={connection + "Question"}>Question:</p>
                        <p className="option-text" id={connection}>Option:</p>
                        
                    </div>
                )
            })
        }   
    </div>
)

export default Previews
  