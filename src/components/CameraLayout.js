import React, { Component } from 'react';
import Toast from 'light-toast'; // third party library - https://github.com/xinkule/light-toast version 0.1.9 -- https://www.npmjs.com/package/light-toast/v/0.1.9


export default class PitchLayout extends Component{
    constructor(props){
        super(props);
        this.setMessage = this.setMessage.bind(this);
        this.onSendMessage = this.onSendMessage.bind(this);
    }

    state = {
        message: '',
		optionNoMessageReceived: 'Message Not received'
    }

    setMessage(message) {
        this.setState({
            message: message
        });
        this.onSendMessage();
    }

    // function to be called at the end of the button logic to actually send the message
    onSendMessage(){
        // for some reason it isnt setting state fast enough before sending so sends blank.
        // with delay it now sends correctly...
        setTimeout(() => {
            // check recipients > 0
            if(this.props.checked.length !== 0){
                if(this.state.message !== '') {
                    let options = [];
                    options.push(this.state.optionNoMessageReceived);
                    this.props.sendingOptions(this.props.checked, options);
                    this.props.onSendText(this.state.message);
                    Toast.success(this.state.message, 500, () => {});
                    // reset message to empty
                    this.setState({
                        message: ''
                    });
                }
            } else {
                alert('No Recipients Selected');
            }
        }, 50);
	}

    componentDidMount(){
        
    }

    render(){
        return(
            <div className="camera-instruction-container">
                <button className="camera-button" onClick={() => this.setMessage("Tile upwards")}>Tilt Up</button>
                <div className="middle">
                    <button className="camera-button" onClick={() => this.setMessage("Pan Left")}>Pan Left</button>
                    <button className="camera-button" onClick={() => this.setMessage("Hold subject in centre of frame")}>Centre</button>
                    <button className="camera-button" onClick={() => this.setMessage("Pan Right")}>Pan Right</button>
                </div>
                <button className="camera-button" onClick={() => this.setMessage("Tilt downwards")}>Tilt Down</button>
                <div classname="options-bar">    
                    <button className="shot-button" onClick={() => this.setMessage("Get a wide shot ")}>Wide shot</button>
                    <button className="shot-button" onClick={() => this.setMessage("Get a close up shot ")}>Close up</button>
                    <button className="shot-button" onClick={() => this.setMessage("Get a low shot ")}>Low shot</button>
                </div>           
            </div>
        );
    }
}