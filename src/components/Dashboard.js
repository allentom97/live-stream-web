import React, { Component } from 'react';
import Response from './Response';
import Header from './Header';
import Video from './Video';
import Previews from './Previews';
import io from 'socket.io-client';
import PitchLayout from './PitchLayout';
import CameraLayout from './CameraLayout';
import StageLayout from './StageLayout';


//const socket = io('http://ldb-broadcasting-server.herokuapp.com:80');
const socket = io('localhost:6500');
const pcConfig = {
	iceTransports: 'relay',
	'iceServers': [
		{
		'urls': 'stun:stun.l.google.com:19032'
		},
        {
            "url": "stun:stun1.l.google.com:19302"
        },
        {
            "url": "stun:stun2.l.google.com:19302"
        },
        {
            "url": "stun:stun3.l.google.com:19302"
        },
        {
            "url": "stun:stun4.l.google.com:19302"
        }

	]
};
const answerOptions = {'OfferToReceiveAudio':true,'OfferToReceiveVideo':true};
//const adapter = require("webrtc-adapter");
let peers = {};
let socketConnections = {};
let stateContainer;

// Socket

socket.on('connect', () => {
	socket.emit('connected', {
		sender: 'web'
	});
});

socket.on('new-connection', (socketID, connections) => {
	peers[socketID] = new RTCPeerConnection(pcConfig);
	socketConnections = connections;
	let socketArray = [];
	for(let x in socketConnections){
		socketArray.push(socketConnections[x]);
	}
	stateContainer.setState({
		connections: socketArray
	});
	checkOnIceCandidate(socketID);
	checkOnTrack(socketID, Object.keys(peers).indexOf(socketID));
	
});

socket.on('removed-connection', (socketID, connections)=> {
	if (peers[socketID]){
		peers[socketID].close();
		delete peers[socketID];
	}
	var check = stateContainer.state.checked
	if(check.includes(socketConnections[socketID])){
		var spliceIndex = check.indexOf(socketConnections[socketID]);
		check.splice(spliceIndex, 1);
		stateContainer.setState({
			checked: check
		});
	}
	socketConnections = connections;
	let socketArray = [];
	for(let x in socketConnections){
		socketArray.push(socketConnections[x]);
	};
	stateContainer.setState({
		connections: socketArray
	});
});

socket.on('message', async (socketID, message)=> {
	if (peers[socketID]){
		try{
			if (message.type === 'offer'){
				await peers[socketID].setRemoteDescription(message.label);
				await peers[socketID].setLocalDescription(await peers[socketID].createAnswer(answerOptions));
				sendMessage(socketID, {
					sender: 'web',
					type: 'answer',
					label: peers[socketID].localDescription
				});
			} else if (message.type === 'candidate'){
				if (message.candidate != null){
					peers[socketID].addIceCandidate(message.candidate);
				}
			} else if (message.type === 'bye'){
				peers[socketID].close();
				delete peers[socketID];
			}
		} catch(error){
			console.log(error);
		}
	}
});

socket.on('status', (socketName, message) => {
	var text = "Status: " + message;
	document.getElementById(socketName + "Status").innerHTML = text;
});

socket.on('options-response', (socketName, message) =>{	
	var text = message;
	document.getElementById(socketName + "Option").innerHTML = text;
});

function sendMessage(toID, message){
	socket.emit('message', toID, message);
};

function sendAir(id , message){
	var toID = Object.keys(socketConnections).find(key => socketConnections[key] === id);
	socket.emit('air', toID, message)
}

function sendOptions(toIDs, options){
	var IDs = [];
	for(var i in toIDs){
		for (let [key, value] of Object.entries(socketConnections)) {
			if(value === toIDs[i]){
				IDs.push(key)
			}
		}
	}
	for(var id in toIDs){
		var receiver = toIDs[id]
		for(var toID in socketConnections)
		{
			if(socketConnections[toID]===receiver){
				socket.emit('options-message', toID, IDs, options);
			}
		}
	}
};

function sendText(toIDs, message){
	var IDs = [];
	for(var i in toIDs){
		for (let [key, value] of Object.entries(socketConnections)) {
			if(value === toIDs[i]){
				IDs.push(key)
			}
		}
	}
	for(var id in toIDs){
		var receiver = toIDs[id]
		for(var toID in socketConnections)
		{
			if(socketConnections[toID]===receiver){
				socket.emit('text-message', toID, IDs, message);
				// set display to message pending
				document.getElementById(receiver + "Question").innerHTML = "Message: " + message;
				document.getElementById(receiver + "Status").innerHTML = "Status: sent";

			}
		}
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
};

function checkOnTrack(key, index){
	peers[key].ontrack = e => {
		document.getElementById(index.toString()).srcObject = e.streams[0];
	}
};

setInterval(() => {
	for (var key in socketConnections) {	
		var index = Object.keys(peers).indexOf(key);
		if (peers.hasOwnProperty(key)) {
			checkOnIceCandidate(key);
			checkOnTrack(key, index);			
		}
	}
}, 1000);


export default class Dashboard extends Component {

	constructor(props){
		super(props);
		
		this.onSendText = this.onSendText.bind(this);
		this.sendingOptions = this.sendingOptions.bind(this);
		this.onChecked = this.onChecked.bind(this);
		this.onPreviewClicked = this.onPreviewClicked.bind(this);
		this.onOutputClicked = this.onOutputClicked.bind(this);
		this.onStreamsClicked = this.onStreamsClicked.bind(this);
		this.toggleComponent = this.toggleComponent.bind(this);
	}

	state = {
		connections:[],
		currentStream: undefined,
		checked: [],
		flexDirect: {
			flexDirection: 'column',
			flexWrap: 'nowrap'
		},
		videoScreen: true,
		directorStyle: {
			flexDirection: 'row'
		},
		liveID: '',
		responseIsVisible: false,
		pitchIsVisible: false,
		cameraIsVisible: false,
		stageIsVisible: false,
		clickCount: 0,
		previewClickedConnection: null
	}

	componentDidMount(){
		stateContainer = this;
		document.addEventListener('keydown', this.onKeyDownHandler);	
	}
	
	componentWillUnmount() {
		document.removeEventListener('keydown', this.onKeyDownHandler);
	}

	toggleComponent(name){
		if (name === 'response') {
			this.setState({
				responseIsVisible: !this.state.responseIsVisible
			});
		} else if (name === 'pitch') {
			this.setState({
				pitchIsVisible: !this.state.pitchIsVisible
			});
		} else if (name === 'camera') {
			this.setState({
				cameraIsVisible: !this.state.cameraIsVisible
			});
		} else if (name === 'stage') {
			this.setState({
				stageIsVisible: !this.state.stageIsVisible
			});
		}
	}

	onStreamsClicked(){
		if (this.currentStream !== '') {
			sendAir(this.state.currentStream, {
				type: 'off-air'
			});
		}
		this.setState({
			flexDirect: {
				flexDirection: 'row',
				flexWrap: 'wrap',
				justifyContent: 'center'
			},
			currentStream: undefined,
			videoScreen: false,
			directorStyle: {
				flexDirection: 'column',
				alignItems: 'center',
				position: 'sticky'
			}
		});
	}
	onOutputClicked(){
		this.setState({
			flexDirect: {
				flexDirection: 'column',
				flexWrap: 'nowrap',
			},
			videoScreen: true,
			directorStyle: {
				flexDirection: 'row',
				
			}
		});
	}

	onChecked(connection){
		var check = this.state.checked;
		if(check.includes(connection)){
			var spliceIndex = check.indexOf(connection);
			check.splice(spliceIndex, 1);
			this.setState({
				checked: check
			});
		} else {
			check.push(connection);
			this.setState({
				checked: check
			});
		}
	};

	onPreviewClicked(index, connection){
		var clickedStream = document.getElementById(index);
		if (this.state.previewClickedConnection === connection) {
			this.setState({
				clickCount: this.state.clickCount + 1
			});
		} else {
			this.setState({
				clickCount: 1
			});
		}
		this.setState({
			previewClickedConnection: connection
		});
		setTimeout(() => {

			if (this.state.clickCount === 3) {
				var stream = document.getElementById(index.toString()).srcObject;
				document.getElementById('mainStream').srcObject = stream;
				if (this.currentStream !== undefined) {
					sendAir(this.state.currentStream, {
						type: 'off-air'
					});
				}
				this.setState({
					currentStream: connection
				});
				sendAir(connection, {
					type: 'on-air'
				});
				var videoE = document.getElementById('mainStream');
				videoE.muted = false;
				videoE.style.borderColor = 'red';
				videoE.style.borderWidth = '0.6rem';
				clickedStream.style.borderColor = 'white';
				clickedStream.style.borderWidth = '0.2rem';
			} else if (this.state.clickCount === 1) {
				if (this.currentStream !== connection) {
					sendAir(connection, {
						type: 'ready'
					});
					clickedStream.style.borderColor = 'green';
					clickedStream.style.borderWidth = '0.6rem';
				}
			}
		}, 50);
	};
	
	onSendText(message){
		sendText(this.state.checked, message);
	};

	sendingOptions(checked, options){
		sendOptions(checked, options);
	};

	render() {

		return (
		<div>      
			<Header 
				onOutputClicked={this.onOutputClicked}
				onStreamsClicked={this.onStreamsClicked}
				disabled={this.state.videoScreen}
			/>
			<div className="container">
				<div className="dashboard-container" onKeyDown={() => this.onKeyDownHandler} style={this.state.directorStyle}>
					<div className="director-container" >      
						<div > 
							{this.state.videoScreen && 		
								<Video
									currentStream={this.state.currentStream}
								/>
							}
							<div>
								<button className="toggle-button" onClick={() => this.toggleComponent("response")}>Response controls</button>
								<button className="toggle-button" onClick={() => this.toggleComponent("pitch")}>Pitch controls</button>
								<button className="toggle-button" onClick={() => this.toggleComponent("camera")}>Camera controls</button>
								<button className="toggle-button" onClick={() => this.toggleComponent("stage")}>Stage controls</button>
							</div>
							{this.state.responseIsVisible && 
								<Response 
									videoScreen={this.state.videoScreen}
									onSendText={this.onSendText}
									checked={this.state.checked}
									sendingOptions={this.sendingOptions}
								/>
							}
							{this.state.pitchIsVisible && 
								<PitchLayout
									videoScreen={this.state.videoScreen}
									onSendText={this.onSendText}
									checked={this.state.checked}
									sendingOptions={this.sendingOptions}
								/>
							}
							{this.state.cameraIsVisible && 
								<CameraLayout
								videoScreen={this.state.videoScreen}
								onSendText={this.onSendText}
								checked={this.state.checked}
								sendingOptions={this.sendingOptions}
								/>
							}
							{this.state.stageIsVisible &&
								<StageLayout
									videoScreen={this.state.videoScreen}
									onSendText={this.onSendText}
									checked={this.state.checked}
									sendingOptions={this.sendingOptions}
								/>
							}
						</div>
			  		</div>
					<div>      
						<Previews 
							disabled={this.state.videoScreen}	
							flexDirect={this.state.flexDirect}
							connections={this.state.connections}
							onChecked={this.onChecked}
							onPreviewClicked={this.onPreviewClicked} 
					 	 />
				  	</div>
					
				</div>
			</div>
		 </div>
	);
	}
}


/*

	// selection of preview by pressing ctrl + number
	onKeyDownHandler(e) {
		if (e.keyCode === 49 && e.ctrlKey) {
		  this.onPreviewClicked('0', 'Tom');
		}
	  };
*/
