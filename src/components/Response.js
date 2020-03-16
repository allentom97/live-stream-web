import React, { Component } from 'react';

export default class Response extends Component{
    constructor(props){
        super(props);


		this.messageOnChange = this.messageOnChange.bind(this);
		this.optionOneOnChange = this.optionOneOnChange.bind(this);
		this.optionTwoOnChange = this.optionTwoOnChange.bind(this);
        this.optionThreeOnChange = this.optionThreeOnChange.bind(this);
		this.onSendOptions = this.onSendOptions.bind(this);
		this.onSendMessage = this.onSendMessage.bind(this);
    }

    state = {
        message: '',
		optionOne: '',
		optionTwo: '',
		optionThree: '',
		optionNoMessageReceived: 'Message Not received'
	}

    messageOnChange(event){
		this.setState({message: event.target.value});
	}

	optionOneOnChange(event){
		this.setState({optionOne: event.target.value});
	}
	optionTwoOnChange(event){
		this.setState({optionTwo: event.target.value});
	}
	optionThreeOnChange(event){
		this.setState({optionThree: event.target.value});
	}


    onSendOptions(){
		if(this.props.checked.length !== 0){
			//if(this.state.optionOne !== '' || this.state.optionTwo !== ''  || this.state.optionThree !== '' ){
				let options = [];
				if(this.state.optionOne !== ''){
					options.push(this.state.optionOne);
				}
				if(this.state.optionTwo !== ''){
					options.push(this.state.optionTwo);
				}
				if(this.state.optionThree !== ''){
					options.push(this.state.optionThree);
				}
				// add not received option
				options.push(this.state.optionNoMessageReceived);
				this.props.sendingOptions(this.props.checked, options);
				this.setState({
					optionOne: '',
					optionTwo: '',
					optionThree: ''
				});
			//} else {
			//	alert('Please fill in at least one option');
			//}
		} else {
			alert('No Recipients Selected');
		}
	} 

	onSendMessage(){
		if(this.props.checked.length !== 0){
			if(this.state.message !== ''){
				this.props.onSendText(this.state.message)
				this.setState({
					message: ''
				});
			} else {
				alert('Please enter a message')
			}
			this.onSendOptions();
			// sends a not received option to let director know they didnt get the message
			//this.props.sendingOptions(this.props.checked, [this.state.optionNoMessageReceived]);
		} else {
			alert('No Recipients Selected');
		}
		
	}

    componentDidMount(){
        
	}
	
	onKeyDownHandler = e => {
		if (e.keyCode === 13) {
		  this.onSendMessage();
		}
	  };

    render(){
        return(
            <div className="response-container">
                <div className="response-message-container">
					<label className="message-label">
						Message Text:
						<textarea className="response-area" rows="1" cols="70" value={this.state.message} onChange={this.messageOnChange} onKeyDown={this.onKeyDownHandler}></textarea>
					</label>
                </div>
                <div className="response-options-container">
                    <label className="option-label">
                        Option One: 
                        <textarea className="option-area" rows="1" cols="25" value={this.state.optionOne} onChange={this.optionOneOnChange}></textarea>
                    </label>
                    <label className="option-label">
                        Option Two: 
                        <textarea className="option-area" rows="1" cols="25" value={this.state.optionTwo} onChange={this.optionTwoOnChange}></textarea>
                    </label>
                    <label className="option-label">
                        Option Three: 
                        <textarea className="option-area" rows="1" cols="25" value={this.state.optionThree} onChange={this.optionThreeOnChange}></textarea>
                    </label>
					<button className="response-button" onClick={this.onSendMessage}>Send Message</button>
                </div>
            </div>

        );
    }
}