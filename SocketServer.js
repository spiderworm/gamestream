
var Stream = require('stream');
var inherits = require('inherits');
var WebSocketServer = require('ws').Server;
var defaultSocketConfig = require('./defaultSocketConfig.js');

function SocketServer(config) {
	config = config || {};
	var port = config.port || defaultSocketConfig.port;
	this.socketServer = new WebSocketServer({ port: port });
	Stream.call(this, { objectMode: true });
}

inherits(SocketServer, Stream);

SocketServer.prototype.write = function(gameStates) {
	this.socketServer.clients.forEach(function(client) {
		try {
			client.send(JSON.stringify(gameStates));
		} catch(e) {
			console.info('unable to send to a client');
		}
	});
};

module.exports = SocketServer;
