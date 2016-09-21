
var Stream = require('stream');
var inherits = require('inherits');
var WebSocketServer = require('ws').Server;
var defaultSocketConfig = require('./defaultSocketConfig.js');
var Config = require('../misc/Config.js');

function SocketServer(config) {
	config = new Config(defaultSocketConfig, [config]);
	this.socketServer = new WebSocketServer({ port: config.port });
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
