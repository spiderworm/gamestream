
var Demo = require('../shared/Demo.js');
var HostDemoGame = require('../shared/games/HostDemoGame.js');
var ClientDemoGame = require('../shared/games/ClientDemoGame.js');
var ObjectDroppingGame = require('../shared/games/ObjectDroppingGame.js');
var AiControls1 = require('../shared/controls/AiControls1.js');
var HumanControls = require('../shared/controls/HumanControls.js');
var THREE = require('three');
var GameStream = require('../GameStream.js');

function ClientServerDemo() {
	var demo = new Demo();

	var host = new HostDemoGame('Host Game');
	ObjectDroppingGame.apply(host);
	host.description = "This represents a host game running on a server. Clients will connect and disconnect from it on their own, and state is piped from this host directly to each respective client. We expect that clients that connect will immediately display the same state as the host game.";
	demo.games.push(host);

	var clientLag = 100;

	var humanClient = new HumanClient(name, demo);
	humanClient.description = "This represents a client that is persistantly connected to the host game. It runs " + clientLag + " ms behind the host game.";
	humanClient.stream.time = +new Date() - clientLag;
	demo.games.push(humanClient);
	host.stream.pipe(humanClient.stream);

	var clientCount = 1;

	var clientConnectInterval = 5000;
	var clientDuration = clientConnectInterval * 1.5;

	function connectClient() {
		clientCount++;
		var count = clientCount;
		var client = new AiClient('Client ' + count);
		client.stream.time = +new Date() - clientLag;
		client.description = "This client just connected to the host game, but will disconnect soon. It should immediately display the full host game state and stay in sync (" + clientLag + " ms behind) while connected. It will disconnect after " + (clientDuration / 1000) + " seconds.";

		demo.games.push(client);
		host.stream.pipe(client.stream);

		setTimeout(function() { disconnectClient(client); }, clientDuration);
		setTimeout(connectClient, clientConnectInterval);
	}

	function disconnectClient(client) {
		var i = demo.games.indexOf(client);
		if (i !== -1) {
			demo.games.splice(i,1);
		}
		host.stream.unpipe(client.stream);
		client.stream.push = false;
	}

	connectClient();

	return demo;
}




function AiClient(name) {
	var client = new ClientDemoGame(name);

	client.stream.on(GameStream.events.DELEGATE_HOSTED, function(controlsStream) {
		var controls = new AiControls1(controlsStream);
		client.systems.localControls = controls;
	});

	return client;
}





function HumanClient(name, demo) {

	var humanClient = new ClientDemoGame(name);

	humanClient.stream.on(GameStream.events.DELEGATE_HOSTED, function(gamestream) {
		var info = gamestream.info;
		if (info.type === "playerControls") {
			console.info('player controls');
			controlsGranted(gamestream);
		}
		if (info.type === "playerPhysics") {
			console.info('player physics');
			physicsGranted(gamestream);
		}
	});

	function controlsGranted(controlsStream) {
		controlsStream.on('data', function(state) {
			humanClient.applyState(state);
		});

		controlsStream.time = humanClient.stream.time;
		//humanClient.stream.delegate(controlsStream);

		var controls = new HumanControls(
			controlsStream,
			demo.nodes.canvas,
			function() { controlBegin(controlsStream); },
			controlEnd
		);

		humanClient.systems.localControls = controls;
	}

	function controlBegin(controlsStream) {
		var clientThrees = humanClient.systems.view.getThrees();
		clientThrees.outsideCamera = clientThrees.camera;
		clientThrees.playerCamera = clientThrees.camera.clone(true);
		var playerEntity = humanClient.entities[controlsStream.info.entityName];
		var playerThree = humanClient.systems.view.getEntityThree(playerEntity);
		if (playerEntity && playerThree) {
			playerThree.add(clientThrees.playerCamera);
			clientThrees.playerCamera.position.set(0, 2, 1);
			clientThrees.playerCamera.lookAt({x: 0, y: 0, z: 1});
			clientThrees.camera = clientThrees.playerCamera;
		}
	}

	function controlEnd() {
		var clientThrees = humanClient.systems.view.getThrees();
		clientThrees.camera = clientThrees.outsideCamera;
	}

	function physicsGranted(physicsStream) {
		//physicsStream._stateFactory.pipe(new GameStream.StateDebugger());
		physicsStream.pipe(new GameStream.ConsoleLogger({
			duration: 1000,
			logFull: true
		}));
		humanClient.physicsStream = physicsStream;
		setInterval(function() { humanClient.streamPhysicsState(); }, 500);
	}

	return humanClient;
}

module.exports = ClientServerDemo;
