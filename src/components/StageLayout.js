import React, { Component } from 'react'
import Toast from 'light-toast'; // third party library - https://github.com/xinkule/light-toast version 0.1.9 -- https://www.npmjs.com/package/light-toast/v/0.1.9

export default class StageLayout extends Component {

    constructor(props){
        super(props);
        this.setMessage = this.setMessage.bind(this);
        this.onSendMessage = this.onSendMessage.bind(this);
    }

    state = {
        message: '',
        optionNoMessageReceived: 'Message not received'
    }

    // handles setting and sending message from button click
    setMessage(messageText) {
        this.setState({
            message: messageText
        });
        this.onSendMessage();
    }

    onSendMessage(){
        // for some reason it isnt setting state fast enough before sending so sends blank.
        // with delay it now send=s correctly...
        // TODO: Investigate Async calls - see whether this is an appropriate use
        setTimeout(() => {
            // check recipients > 0
            if(this.props.checked.length !== 0){
                if(this.state.message !== '') {let options = [];
                    options.push(this.state.optionNoMessageReceived);
                    this.props.sendingOptions(this.props.checked, options);
                    this.props.onSendText(this.state.message);
                    // show director notification as feedback
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

    render() {
        return (
            <div className="stage-container">
                <div className="stage-grid">
                    <div className="grid-" onClick={() => {this.setMessage("Back left stage")}}></div>
                    <div className="grid-" onClick={() => {this.setMessage("Back middle stage")}}></div>
                    <div className="grid-" onClick={() => {this.setMessage("Back right stage")}}></div>
                    <div className="grid-" onClick={() => {this.setMessage("Front left stage")}}></div>
                    <div className="grid-" onClick={() => {this.setMessage("Front middle stage")}}></div>
                    <div className="grid-" onClick={() => {this.setMessage("Front right stage")}}></div>
                </div>
                <div classname="options-bar">    
                    <button className="shot-button" onClick={() => this.setMessage("Get whole band shot")}>Whole band shot</button>
                    <button className="shot-button" onClick={() => this.setMessage("Close up of singer")}>Close up singer</button>
                    <button className="shot-button" onClick={() => this.setMessage("Get a low shot ")}>Low front stage</button>
                    <button className="shot-button" onClick={() => this.setMessage("Behind singer to crowd ")}>Behind singer</button>
                </div>
                <div classname="options-bar">    
                    <button className="shot-button" onClick={() => this.setMessage("Get front row crowd close up")}>Crowd close</button>
                    <button className="shot-button" onClick={() => this.setMessage("Wide crowd shot")}>Wide crowd</button>
                    <button className="shot-button" onClick={() => this.setMessage("Pan crowd")}>Pan full crowd</button>
                    <button className="shot-button" onClick={() => this.setMessage("Inside crowd shot")}>Inside crowd</button>
                </div>       
            </div>
        )
    }
}
