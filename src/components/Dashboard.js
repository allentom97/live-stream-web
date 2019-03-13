import React, { Component } from 'react';
import Header from './Header';
import io from 'socket.io-client';

const socket = io('http://localhost:6500');
//const socket = io('http://ldb-broadcasting.herokuapp.com:80')
const pcConfig = {
	iceTransports: 'relay',
	'iceServers': [{
		'urls': 'stun:stun.l.google.com:19032'
	}]
};
const answerOptions = {'OfferToReceiveAudio':true,'OfferToReceiveVideo':true};

let peers = {};
let socketConnections = {};
let stateContainer;

// Socket

socket.on('connect', () => {
	console.log('web client connected')
	socket.emit('connected', {
		sender: 'web'
	})
});

socket.on('new-connection', (socketID, connections) => {
	peers[socketID] = new RTCPeerConnection(pcConfig)
	socketConnections = connections
	let socketArray = []
	for(let x in socketConnections){
		socketArray.push(socketConnections[x])
	}
	console.log('SA',socketArray)
	stateContainer.setState({
		connections: socketArray
	})
	console.log('socketConnections',socketConnections)
	console.log('peers', peers)
	checkOnIceCandidate(socketID)
	checkOnTrack(socketID, Object.keys(peers).indexOf(socketID))
	
})

socket.on('removed-connection', (socketID, connections)=> {
	if (peers[socketID]){
		peers[socketID].close()
		delete peers[socketID]
	}
	socketConnections = connections
	let socketArray = []
	for(let x in socketConnections){
		socketArray.push(socketConnections[x])
	}
	stateContainer.setState({
		connections: socketArray
	})
})

socket.on('message', async (socketID, message)=> {
	if (peers[socketID]){
		try{
			if (message.type === 'offer'){
				await peers[socketID].setRemoteDescription(message.label)
				await peers[socketID].setLocalDescription(await peers[socketID].createAnswer(answerOptions));
				sendMessage(socketID, {
					sender: 'web',
					type: 'answer',
					label: peers[socketID].localDescription
				})
			} else if (message.type === 'candidate'){
				if (message.candidate != null){
					peers[socketID].addIceCandidate(message.candidate);
				}
			} else if (message.type === 'bye'){
				peers[socketID].close()
				delete peers[socketID]
				console.log('peer deleted', peers)
			}
		} catch(error){
			console.log(error)
		}
	}
})

socket.on('options-response', (socketName, message) =>{	
	var text = "Option: " + message
	console.log('text', text)
	document.getElementById(socketName).innerHTML = text
})

function sendMessage(toID, message){
	socket.emit('message', toID, message)
}

function sendOptions(toIDs, options){
	var IDs = []
	for(var i in toIDs){
		IDs.push(Object.keys(socketConnections)[i])
	}
	for(var id in toIDs){
		var toID = Object.keys(socketConnections)[id]
		socket.emit('options-message', toID, IDs, options)
	}
}

function sendText(toIDs, message){
	for(var id in toIDs){
		var toID = Object.keys(socketConnections)[id]
		socket.emit('text-message', toID, message)
	}
}

function checkOnIceCandidate(key){
	peers[key].ononicecandidate = ({candidate}) => {
		if (candidate !== undefined){
			sendMessage(key, {
				sender: 'web',
				type: 'candidate',
				candidate: candidate
			});
		}
	}
}

function checkOnTrack(key, index){
	peers[key].ontrack = e => {
		document.getElementById(index.toString()).srcObject = e.streams[0]
	}
}

setInterval(() => {
	for (var key in socketConnections) {	
		var index = Object.keys(peers).indexOf(key);
		if (peers.hasOwnProperty(key)) {
			checkOnIceCandidate(key)
			checkOnTrack(key, index)			
		}
	}
}, 1000)


export default class Dashboard extends Component {

	constructor(props){
		super(props);
		
		this.onSendText = this.onSendText.bind(this)
		this.onSendOptions = this.onSendOptions.bind(this)
		this.messageOnChange = this.messageOnChange.bind(this)
		this.optionOneOnChange = this.optionOneOnChange.bind(this)
		this.optionTwoOnChange = this.optionTwoOnChange.bind(this)
		this.optionThreeOnChange = this.optionThreeOnChange.bind(this)
	}

	state = {
		sockets:[],
		currentStream: '',
		checked: [],
		message: '',
		optionOne: '',
		optionTwo: '',
		optionThree: '',
	}

	onPreviewClicked(index, connection){
		var stream = document.getElementById(index.toString()).srcObject
		document.getElementById('mainStream').srcObject = stream
		this.setState({
			currentStream: connection
		})
	}
	
	componentDidMount(){
		stateContainer = this;	
	}

	onChecked(connection){
		var check = this.state.checked
		if(check.includes(connection)){
			var spliceIndex = check.indexOf(connection)
			check.splice(spliceIndex, 1)
			this.setState({
				checked: check
			})
		} else {
			check.push(connection)
			this.setState({
				checked: check
			})
		}
	}

	onSendOptions(){
		if(this.state.checked.length !== 0){
			if(this.state.optionOne !== '' || this.state.optionTwo !== ''  || this.state.optionThree !== '' ){
				let options = [];
				if(this.state.optionOne !== ''){
					options.push(this.state.optionOne)
				}
				if(this.state.optionTwo !== ''){
					options.push(this.state.optionTwo)
				}
				if(this.state.optionThree !== ''){
					options.push(this.state.optionThree)
				}
				console.log("options", options)
				sendOptions(this.state.checked, options)
				this.setState({
					optionOne: '',
					optionTwo: '',
					optionThree: ''
				});
			} else {
				alert('Please fill in at least one option')
			}
		} else {
			alert('No Recipients Selected')
		}
	}
	onSendText(){
		if(this.state.checked.length !== 0){
			if(this.state.message !== ''){
				sendText(this.state.checked, this.state.message)
				this.setState({
					message: ''
				})
			} else {
				alert('Please enter a message')
			}
		} else {
			alert('No Recipients Selected')
		}
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


	render() {

		return (
		<div>      
			<Header />
			<div className="container">
				<div className="dashboard-container">
					<div>      
						<div className="director-container"> 
						
							<div className="video-container">  
								<p className="current-stream">Currently Viewing Stream: {this.state.currentStream}</p>
								<video autoPlay muted controls className="video-player" id='mainStream' ></video>
							</div>

							<div className="response-container">
								<div className="response-message-container">
									<textarea className="response-area" rows="2" cols="100" value={this.state.message} onChange={this.messageOnChange}></textarea>
									<button className="response-button" onClick={this.onSendText}>Send Message</button>
								</div>
								<div className="response-options-container">
									<label className="option-label">
										Option One: 
										<textarea className="option-area" rows="2" cols="25" value={this.state.optionOne} onChange={this.optionOneOnChange}></textarea>
									</label>
									<label className="option-label">
										Option Two: 
										<textarea className="option-area" rows="2" cols="25" value={this.state.optionTwo} onChange={this.optionTwoOnChange}></textarea>
									</label>
									<label className="option-label">
										Option Three: 
										<textarea className="option-area" rows="2" cols="25" value={this.state.optionThree} onChange={this.optionThreeOnChange}></textarea>
									</label>
									<button className="option-button" onClick={this.onSendOptions}>Send Options</button>
								</div>
							</div>

						</div>
			  		</div>
					<div>      
					  	<div className="previews-container">
						  	{ this.state.connections &&
								this.state.connections.map(( connection, index ) => {
									return (
										<div key={index} className="preview-container">
											<div className="top-container">
												<p className="preview-text">Stream: {connection}</p>
												<button className="preview-button" onClick={() => this.onPreviewClicked(index, connection)} >View</button>
												<label className="checkbox-text">
													Message:
													<input type="checkbox" onChange={() => this.onChecked(connection)} />	
												</label>
												<p className="option-text" id={connection}>Option:</p>
											</div>
											<video autoPlay muted className="preview-video" id={index}> </video>
										</div>
									)
								})
							}   
						</div>
				  	</div>
				</div>
			</div>
		 </div>
	);
	}
}

