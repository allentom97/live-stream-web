import React from 'react';


const Header = (props) => ( 
    <header>
        <div className="header">
            <h2 className="heading-text">
                Collaborative Streaming Suite
            </h2>

            <button className="header-button" disabled={props.disabled} onClick={props.onOutputClicked}>Director Output View
            </button>
            <button className="header-button" disabled={!props.disabled} onClick={props.onStreamsClicked}>Streams View</button>
        </div>
    </header>
);

export default Header;