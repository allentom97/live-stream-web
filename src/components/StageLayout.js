import React, { Component } from 'react'
import Toast from 'light-toast'; // third party library - https://github.com/xinkule/light-toast version 0.1.9 -- https://www.npmjs.com/package/light-toast/v/0.1.9

export default class StageLayout extends Component {

    constructor(props){
        super(props);
        this.handleMessage = this.handleMessage.bind(this);
        this.onSendMessage = this.onSendMessage.bind(this);
    }

    state = {
        message: ''
    }

    // handles setting and sending message from button click
    handleMessage(messageText) {
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
                    <div className="grid-" onClick={() => {this.handleMessage("testing message")}}></div>
                    <div className="grid-" onClick={() => {this.handleMessage("")}}></div>
                    <div className="grid-" onClick={() => {this.handleMessage("")}}></div>
                    <div className="grid-" onClick={() => {this.handleMessage("")}}></div>
                    <div className="grid-" onClick={() => {this.handleMessage("")}}></div>
                    <div className="grid-" onClick={() => {this.handleMessage("")}}></div>
                </div>
            </div>
        )
    }
}
