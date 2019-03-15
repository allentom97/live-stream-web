import React, { Component } from 'react';

export default class Response extends Component{
    constructor(props){
        super(props);


		this.messageOnChange = this.messageOnChange.bind(this);
		this.optionOneOnChange = this.optionOneOnChange.bind(this);
		this.optionTwoOnChange = this.optionTwoOnChange.bind(this);
        this.optionThreeOnChange = this.optionThreeOnChange.bind(this);
        this.onSendOptions = this.onSendOptions.bind(this);
    }

    state = {
        message: '',
		optionOne: '',
		optionTwo: '',
		optionThree: '',
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
			if(this.state.optionOne !== '' || this.state.optionTwo !== ''  || this.state.optionThree !== '' ){
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
				this.props.sendingOptions(this.props.checked, options);
				this.setState({
					optionOne: '',
					optionTwo: '',
					optionThree: ''
				});
			} else {
				alert('Please fill in at least one option');
			}
		} else {
			alert('No Recipients Selected');
		}
	}

    componentDidMount(){
        
    }

    render(){
        return(
            <div className="response-container">
                <div className="response-message-container">
                    <textarea className="response-area" rows="1" cols="100" value={this.state.message} onChange={this.messageOnChange}></textarea>
                    <button className="response-button" onClick={() => this.props.onSendText(this.state.message)}>Send Message</button>
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
                    <button className="option-button" onClick={this.onSendOptions}>Send Options</button>
                </div>
            </div>

        );
    }
}