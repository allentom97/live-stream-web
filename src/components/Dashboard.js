import React, { Component } from 'react';
import Header from './Header';
import io from 'socket.io-client';
import { timingSafeEqual } from 'crypto';

const socket = io('http://localhost:6500');
const pcConfig = {
	iceTransports: 'relay',
	'iceServers': [{
		'urls': 'stun:stun.l.google.com:19032'
	}]
};
const offerOptions = {'OfferToReceiveAudio':true,'OfferToReceiveVideo':true};

let pc = new RTCPeerConnection(pcConfig);

// send any ice candidates to the other peer
pc.onicecandidate = ({candidate}) => {
	if (candidate !== undefined){
		sendMessage({
			sender: 'web',
			type: 'candidate',
			candidate: candidate
		});
	}
}
let counter = 0

// // let the "negotiationneeded" event trigger offer generation
// pc.onnegotiationneeded = async () => {
//   try {
	
//   	stream.getTracks().forEach((track) => pc.addTrack(track, stream));
//     await pc.setLocalDescription(await pc.createOffer({offerToReceiveVideo: true, offerToReceiveAudio: true}));
//     // send the offer to the other peer
//     sendMessage({
//         sender: 'web',
//         type: 'offer',
//         label: pc.localDescription
//     })
//   } catch (err) {
//     console.error(err);
//   }
// };

//once remote track media arrives, show it in remote video element
pc.ontrack = e => {
	console.log(e.streams)
	if (counter == 0){
		document.getElementById('mainStream').srcObject = e.streams[0]
		counter ++;
	}
  };

setInterval(() => {
	console.log(pc)
}, 10000)

// SERVER

socket.on('connect', () => {
	console.log('web client connected')
	sendMessage({
		sender: 'web', 
		type: 'connected'
	})
	console.log(pc)
});



socket.on('message-for-web', async (message)=> {
	try{
			if (message.type === 'offer'){
				await pc.setRemoteDescription(message.label)
				await pc.setLocalDescription(await pc.createAnswer(offerOptions));
				sendMessage({
					sender: 'web',
					type: 'answer',
					label: pc.localDescription
				})
			} else if (message.type === 'answer'){
				//mobile only one to send answer
			} else if (message.type === 'candidate'){
				if (message.candidate != null){
					pc.addIceCandidate(message.candidate);
				}
			} else if (message.type === 'bye'){
			}
	} catch(error){
		console.log(error)
	}
})

function sendMessage(message){
	socket.emit('message', message)
}



let container

export default class Dashboard extends Component {

	constructor(props){
		super(props);
		this.videoRef = React.createRef();
	}

	state = {
		remoteSrc: null,
		peers: {
			1: 1, 
			2: 2
		},
	}

	updateVideoStream() {
		if (this.videoRef.current.srcObject !== this.state.remoteSrc) {
		  this.videoRef.current.srcObject = this.state.remoteSrc
		}
	  }

	componentDidMount(){
		container = this;
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
								<p className="current-stream">Currently Viewing Stream:</p>
								<video playsInline autoPlay controls className="video-player" id='mainStream' ></video>
							</div>
						</div>
			  		</div>
					<div>      
					  	<div className="previews-container">
						  	{ !this.state.peers &&
								this.state.peers.map(( peer ) => {
									return (
										<div className="preview-container">
											<p className="preview-text">Stream: {peer}</p>
											<video autoplays='true' muted='true' className="preview-video"> </video>
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

