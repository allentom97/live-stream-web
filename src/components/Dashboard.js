import React, { Component } from 'react';
import Header from './Header';
import io from 'socket.io-client';

const socket = io('http://localhost:6500');

socket.on('connect', () => {
	console.log('client connected')
	socket.emit('offer', 'web hello')
});

socket.on('offer', (data) => {
// Set remote description and send the answer
});

socket.on('answer', (data) =>{
// Set remote description
});

socket.on('candidate', (data) => {
// Add ICE candidate to RTCPeerConnection
});

let container

export default class Dashboard extends Component {

	constructor(props){
		super(props);
	}

	state = {
		selfViewSrc: null,
		peers: {1: 1},
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
								<video autoplays='true' className="video-player" id="remoteStream" src={this.state.selfViewSrc}></video>
							</div>
						</div>
			  		</div>
					<div>      
					  	<div className="previews-container">
						  	{ !this.state.peers &&
								this.state.peers.map(( peer ) => {
									return (
										<div className="preview-container">
											<p className="preview-text">Stream:</p>
											<video autoplays playsinline muted className="preview-video"> </video>
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

