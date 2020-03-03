import React, { Component } from 'react';

export default class PitchLayout extends Component{
    constructor(props){
        super(props);
        this.onSendMessage = this.onSendMessage.bind(this);
        this.setLocation1 = this.setLocation1.bind(this);
        this.setLocation2 = this.setLocation2.bind(this);
        this.setLocation3 = this.setLocation3.bind(this);
        this.setLocation4 = this.setLocation4.bind(this);
        this.setLocation5 = this.setLocation5.bind(this);
        this.setLocation6 = this.setLocation6.bind(this);
        this.setTeamA = this.setTeamA.bind(this);
        this.setTeamB = this.setTeamB.bind(this);
        this.setSideline = this.setSideline.bind(this);
    }

    state = {
        message: 'maymays',
		optionOne: '',
		optionTwo: '',
		optionThree: '',
		optionNoMessageReceived: 'Message Not received'
    }

    setTeamA() {
        // set message value
        this.setState({
            message: 'Follow Team A'
        });
        this.onSendMessage();
    }

    setTeamB() {
        // set message value
        this.setState({
            message: 'Follow Team B'
        });
        this.onSendMessage();
    }

    setLocation1() {
        // set message value
        this.setState({
            message: 'Move to viewing deck'
        });
        this.onSendMessage();

    }

    setLocation2() {
        // set message value
        this.setState({
            message: 'Move to back left endzone'
        });
        this.onSendMessage();
    }

    setLocation3() {
        // set message value
        this.setState({
            message: 'Move to front left endzone'
        });
        this.onSendMessage();
    }

    setLocation4() {
        // set message value
        this.setState({
            message: 'Capture middle area of pitch'
        });
        this.onSendMessage();
    }

    setLocation5() {
        // set message value
        this.setState({
            message: 'Move to front right endzone'
        });
        this.onSendMessage();
    }

    setLocation6() {
        // set message value
        this.setState({
            message: 'Move to back right endzone'
        });
        this.onSendMessage();
    }

    setSideline() {
        // set message value
        this.setState({
            message: 'Move to middle side line'
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
                {/*<div className="pitch-diagram">
                    <img src="./pitch1.png" alt="picture"></img>
        </div>*/}
                <div className="button-container">
                    <button className="team-a-button" onClick={this.setTeamA}>Team A</button>
                    <button className="team-b-button" onClick={this.setTeamB}>Team B</button>
                </div>    
                <div className="pitch-grid">
                    <div className="grid-balcony-top" onClick={this.setLocation1}></div>
                    <div className="grid-endzone-top" onClick={this.setLocation2}></div>
                    <div className="grid-middle-top" onClick={this.setLocation4}></div>
                    <div className="grid-endzone-top" onClick={this.setLocation6}></div>
                    <div className="grid-balcony-bottom" onClick={this.setLocation1}></div>
                    <div className="grid-endzone-bottom" onClick={this.setLocation3}></div>
                    <div className="grid-middle-bottom" onClick={this.setLocation4}></div>
                    <div className="grid-endzone-bottom" onClick={this.setLocation5}></div>
                </div>
                <button className="location-button" onClick={this.setSideline}>__</button>                
            </div>
        );
    }
}