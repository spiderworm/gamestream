
var Demo = require('../shared/Demo.js');
var DemoGame = require('../shared/DemoGame.js');
var ConsoleLogger = require('../ConsoleLogger.js');
var DemoHostGame1 = require('../shared/games/DemoHostGame1.js');
var DemoClientGame = require('../shared/games/DemoClientGame.js');

function ClientServerDemo() {
	var demo = new Demo();

	var host = new DemoHostGame1('Host Game');
	host.description = "This represents a host game running on a server. Clients will connect and disconnect from it on their own, and state is piped from this host to each individual client. We expect that clients that connect will immediately display the same state as the host game.";
	demo.games.push(host);

	var client1 = new DemoClientGame('Client 1');
	client1.description = "This represents a client that is persistantly connected to the host game."
	demo.games.push(client1);
	host.stream.pipe(client1.stream);

	var clientCount = 1;

	var clientConnectInterval = 5000;
	var clientDuration = clientConnectInterval * 1.5;

	function connectClient() {
		clientCount++;
		var client = new DemoClientGame('Client ' + clientCount);
		client.description = "This client just connected to the host game, but will disconnect soon. It should immediately display the full host game state and stay in sync while connected. It will disconnect after " + (clientDuration / 1000) + " seconds.";
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
	}

	connectClient();

	return demo;
}

module.exports = ClientServerDemo;
