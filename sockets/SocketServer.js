
var Stream = require('stream');
var inherits = require('inherits');
var WebSocketServer = require('ws').Server;
var defaultSocketConfig = require('./defaultSocketConfig.js');
var Config = require('../misc/Config.js');
var Packet = require('./Packet.js');
var ServerSideConnection = require('./ServerSideConnection.js');
var GameStream = require('../GameStream.js');
var ProxyManager = require('./ProxyManager.js');
var LocalStreamProxy = require('./LocalStreamProxy.js');

var localProxies = new ProxyManager(
	function(stream) {
		var proxy = LocalStreamProxy.createFromStream(
			stream,
			{
				allowDelegateRequest: true
			}
		);
		proxy.target = stream;
		return proxy;
	},
	null
);

function SocketServer(config) {
	config = new Config(defaultSocketConfig, [config]);
	Stream.call(this, { objectMode: true });

	this._connections = [];

	this._socketServer = new WebSocketServer({ port: config.port });

	this._socketServer.on('connection', function(socket) {
		var connection = new ServerSideConnection(socket, localProxies);
		this._connections.push(connection);
		connection.on('packet', function(packet) {
			this._handlePacket(packet, connection);
		}.bind(this));

		if (pipedTo) {
			var packet = new Packet.EventPacket(
				'pipe',
				'socket',
				localProxies.getObjectFromLocalStream(pipedTo)
			);
			connection.send(packet);
		}
	}.bind(this));

	var pipedTo = null;

	this.on('pipe', function(upstream) {
		pipedTo = upstream;
		var packet = new Packet.EventPacket(
			'pipe',
			'socket',
			localProxies.getObjectFromLocalStream(upstream)
		);
		this.sendToAll(packet);
	}.bind(this));

	this.on('unpipe', function(upstream) {
		if (upstream === pipedTo) {
			pipedTo = null;
		}
		var packet = new Packet.EventPacket(
			'unpipe',
			'socket',
			localProxies.getObjectFromLocalStream(upstream)
		);
		this.sendToAll(packet);
	}.bind(this));
}

inherits(SocketServer, Stream);

SocketServer.prototype.write = function(gameStates) {
	var packet = new Packet.StatesPacket('socket', gameStates);
	this.sendToAll(packet);
};

SocketServer.prototype.sendToAll = function(packet) {
	this._connections.forEach(function(connection) {
		try {
			connection.send(packet);
		} catch(e) {
			if (!connection.isOpen()) {
				var i = this._connections.indexOf(connection);
				this._connections.splice(i,1);
				return;
			}
			console.error('unhandled error sending packet to connection', e);
		}
	}.bind(this));
};

SocketServer.prototype._handlePacket = function(packet, connection) {
	if (packet.target === "socket") {
		switch(packet.type) {
			case Packet.types.STATES:
				console.error('SocketServer: state cannot be pushed upstream');
			break;
			case Packet.types.EVENT:
				this._handleEventPacket(packet, connection);
			break;
		}
	} else {
		var proxy = localProxies.getProxyFromObject(packet.target);
		proxy.handlePacket(packet, connection);
	}
};

SocketServer.prototype._handleEventPacket = function(packet, connection) {
	console.error('SocketServer: events cannot be pushed upstream');
};

module.exports = SocketServer;
