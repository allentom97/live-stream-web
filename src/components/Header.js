import React from 'react';


const Header = (props) => ( 
    <header>
        <div className="header">
            <h2 className="heading-text">
                Collaborative Streaming Suite
            </h2>

            <button disabled={props.disabled} onClick={props.onOutputClicked}>Output View</button>
            <button disabled={!props.disabled} onClick={props.onStreamsClicked}>Streams View</button>
        </div>
    </header>
);

export default Header;