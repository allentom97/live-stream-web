import React, { Component } from 'react';
import Toast from 'light-toast'; // third party library - https://github.com/xinkule/light-toast version 0.1.9 -- https://www.npmjs.com/package/light-toast/v/0.1.9

export default class PitchLayout extends Component{
    constructor(props){
        super(props);
        this.handleMessage = this.handleMessage.bind(this);
        this.onSendMessage = this.onSendMessage.bind(this);
    }

    state = {
        message: '',
		optionOne: '',
		optionTwo: '',
		optionThree: '',
		optionNoMessageReceived: 'Message Not received'
    }


    // handles setting and sending message from button click
    handleMessage(messageText) {
        this.setState({
            message: messageText
        });
        this.onSendMessage();
    }

    // function to be called at the end of the button logic to actually send the message
    onSendMessage(){

        // for some reason it isnt setting state fast enough before sending so sends blank.
        // with delay it now send=s correctly...
        setTimeout(() => {
            // check recipients > 0
            if(this.props.checked.length !== 0){
                if(this.state.message !== '') {
                    this.props.onSendText(this.state.message);
                    // show director notification as feedback
                    Toast.success(this.state.message, 500, () => {
                        // do something after the toast disappears
                    });
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
            <div className="pitch-container">
                <div className="button-container">
                    <button className="team-a-button" onClick={() => {this.handleMessage("Follow team A")}}>Team A</button>
                    <button className="team-b-button" onClick={() => {this.handleMessage("Follow team B")}}>Team B</button>
                </div>    
                <div className="pitch-grid">
                    <div className="grid-balcony-top" onClick={() => {this.handleMessage("Move to balcony")}}></div>
                    <div className="grid-endzone-top" onClick={() => {this.handleMessage("Move to back left endzone")}}></div>
                    <div className="grid-middle-top" onClick={() => {this.handleMessage("Film middle of pitch")}}></div>
                    <div className="grid-endzone-top" onClick={() => {this.handleMessage("Move to back right endzone")}}></div>
                    <div className="grid-balcony-bottom" onClick={() => {this.handleMessage("Move to balcony")}}></div>
                    <div className="grid-endzone-bottom" onClick={() => {this.handleMessage("Move to front left")}}></div>
                    <div className="grid-middle-bottom" onClick={() => {this.handleMessage("Film middle of pitch")}}></div>
                    <div className="grid-endzone-bottom" onClick={() => {this.handleMessage("Film front right endzone")}}></div>
                </div>
                <button className="location-button" onClick={() => {this.handleMessage("Move to middle sideline")}}>__</button>                
            </div>
        );
    }
}