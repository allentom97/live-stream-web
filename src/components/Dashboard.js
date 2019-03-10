import React, { Component } from 'react';
import Header from './Header';
import io from 'socket.io-client';

const socket = io('http://localhost:6500');
const pcConfig = {
	iceTransports: 'relay',
	'iceServers': [{
		'urls': 'stun:stun.l.google.com:19032'
	}]
};
const answerOptions = {'OfferToReceiveAudio':true,'OfferToReceiveVideo':true};

let peers = {}
let container;
let sockets = {}
let counter = 0;



// SERVER

socket.on('connect', () => {
	console.log('web client connected')
	socket.emit('connected', {
		sender: 'web'
	})
});

socket.on('new-connection', (socketID, connections) => {
	peers[socketID] = new RTCPeerConnection(pcConfig)
	console.log('connections', connections)
	console.log('peers', peers)
	checkOnIceCandidate(socketID)
	checkOnTrack(socketID, Object.keys(peers).indexOf(socketID))
})

socket.on('removed-connection', (connections)=> {
	console.log('connections', connections)
})

socket.on('message', async (fromID, message)=> {
	if (peers[fromID]){
		try{
			if (message.type === 'offer'){
				await peers[fromID].setRemoteDescription(message.label)
				await peers[fromID].setLocalDescription(await peers[fromID].createAnswer(answerOptions));
				sendMessage(fromID, {
					sender: 'web',
					type: 'answer',
					label: peers[fromID].localDescription
				})
			} else if (message.type === 'candidate'){
				if (message.candidate != null){
					peers[fromID].addIceCandidate(message.candidate);
				}
			} else if (message.type === 'bye'){
				peers[fromID].close()
				delete peers[fromID]
				console.log('peer deleted', peers)
			}
		} catch(error){
			console.log(error)
		}
	}
})

function sendMessage(toID, message){
	socket.emit('message', toID, message)
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

	for (var key in peers) {	
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
		this.state = {
			sockets: [
				{
					1:1
				},
				{ 
					2:2
				}
			],
			currentStream: 0,

		}
	}

	// setMainStream(){
	// 	this.setState({
	// 		currentStream: 1
	// 	})
	// }

	componentDidMount(){
		//container = this;
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
								<p className="current-stream">Currently Viewing Stream: {this.currentStream}</p>
								<video autoPlay controls className="video-player" id='mainStream' ></video>
							</div>
						</div>
			  		</div>
					<div>      
					  	<div className="previews-container">
						  	{ this.state.sockets &&
								this.state.sockets.map(( socket, index ) => {
									return (
										<div key={index} className="preview-container">
											<p className="preview-text">Stream: {index+1}</p>
											<video autoPlay muted className="preview-video" id={index} > </video>
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

