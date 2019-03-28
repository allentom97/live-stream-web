import React, { Component } from 'react';
import Response from './Response';
import Header from './Header';
import Video from './Video';
import Previews from './Previews';
import io from 'socket.io-client';


const socket = io('http://ldb-broadcasting-server.herokuapp.com:80');
//const socket = io('localhost:6500');
const pcConfig = {
	iceTransports: 'relay',
	'iceServers': [{
		'urls': 'stun:stun.l.google.com:19032'
	}]
};
const answerOptions = {'OfferToReceiveAudio':true,'OfferToReceiveVideo':true};
const adapter = require("webrtc-adapter");
let peers = {};
let socketConnections = {};
let stateContainer;

// Socket

socket.on('connect', () => {
	console.log('web client connected');
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

socket.on('options-response', (socketName, message) =>{	
	var text = "Option: " + message;
	document.getElementById(socketName).innerHTML = text;
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
		IDs.push(Object.keys(socketConnections)[i]);
	}
	for(var id in toIDs){
		var toID = Object.keys(socketConnections)[id];
		socket.emit('options-message', toID, IDs, options);
	}
};

function sendText(toIDs, message){
	for(var id in toIDs){
		var toID = Object.keys(socketConnections)[id];
		socket.emit('text-message', toID, message);
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
		liveID: ''
	}


	
	componentDidMount(){
		stateContainer = this;	
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
		var videoE = document.getElementById('mainStream'); videoE.muted = false;
	};
	
	onSendText(message){
		if(this.state.checked.length !== 0){
			if(message !== ''){
				sendText(this.state.checked, message);
			} else {
				alert('Please enter a message')
			}
		} else {
			alert('No Recipients Selected')
		}
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
				<div className="dashboard-container" style={this.state.directorStyle}>
					<div className="director-container">      
						<div > 
							{this.state.videoScreen && 		
								<Video
									currentStream={this.state.currentStream}
								/>
							}

							<Response 
								videoScreen={this.state.videoScreen}
								onSendText={this.onSendText}
								checked={this.state.checked}
								sendingOptions={this.sendingOptions}
							/>	
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



