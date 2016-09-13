
var Stream = require('stream');
var inherits = require('inherits');
var WebSocketServer = require('ws').Server;

function GameClients() {
	this.socketServer = new WebSocketServer({ port: 8080 });
	Stream.call(this, { objectMode: true });
}

inherits(GameClients, Stream);

GameClients.prototype.write = function(gameStates) {
	this.socketServer.clients.forEach(function(client) {
		try {
			client.send(JSON.stringify(gameStates));
		} catch(e) {
			console.info('unable to send to a client');
		}
	});
};

module.exports = GameClients;
