import React, { Component } from 'react';

export default class PitchLayout extends Component{
    constructor(props){
        super(props);
        this.onSendMessage = this.onSendMessage.bind(this);
        this.setPanLR = this.setPanLR.bind(this);
        this.setPanRL = this.setPanRL.bind(this);
        this.setWideShot = this.setWideShot.bind(this);
        this.setTiltUp = this.setTiltUp.bind(this);
        this.setTiltDown = this.setTiltDown.bind(this);
    }

    state = {
        message: '',
		optionNoMessageReceived: 'Message Not received'
    }

    setPanLR() {
        // set message value
        this.setState({
            message: 'Pan Right'
        });
        this.onSendMessage();
    }

    setPanRL() {
        // set message value
        this.setState({
            message: 'Pan Left'
        });
        this.onSendMessage();
    }

    setWideShot() {
        // set message value
        this.setState({
            message: 'Get a wide shot'
        });
        this.onSendMessage();
    }

    setTiltUp() {
        // set message value
        this.setState({
            message: "Tilt upwards"
        });
        this.onSendMessage();
    }

    setTiltDown() {
        // set message value
        this.setState({
            message: "Tilt downwards"
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
                    this.props.onSendText(this.state.message);
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
                <button className="camera-button" onClick={this.setTiltUp}>Tilt Up</button>
                <div className="middle">
                    <button className="camera-button" onClick={this.setPanRL}>Pan Left</button>
                    <button className="camera-button" onClick={this.setWideShot}>Wide shot</button>
                    <button className="camera-button" onClick={this.setPanLR}>Pan Right</button>
                </div>
                <button className="camera-button" onClick={this.setTiltDown}>Tilt Down</button>                 
            </div>
        );
    }
}