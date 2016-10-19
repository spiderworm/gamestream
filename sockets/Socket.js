
var inherits = require('inherits');
var Readable = require('../stream/Readable.js');
var defaultSocketConfig = require('./defaultSocketConfig.js');
var Config = require('../misc/Config.js');
var Packet = require('./Packet.js');
var packetEncryptor = require('./packetEncryptor.js');
var LocalStreamProxy = require('./LocalStreamProxy.js');
var ProxyManager = require('./ProxyManager.js');
var RemoteStreamProxy = require('./RemoteStreamProxy.js');
var ClientSideConnection = require('./ClientSideConnection.js');

var localProxies = new ProxyManager(
	function(stream) {
		var proxy = LocalStreamProxy.createFromStream(
			stream,
			{
				allowStateWrite: true,
				allowDelegateHost: true,
				allowDelegateRequest: true
			}
		);
		proxy.target = stream;
		return proxy;
	},
	null
);

function Socket(config) {
	Readable.call(this);

	config = new Config(defaultSocketConfig, [config]);

	this._connection = new ClientSideConnection(config, localProxies);
	this._connection.on('packet', this._handlePacket.bind(this));
}

inherits(Socket, Readable);

Socket.prototype._handlePacket = function(packet) {
	if (packet.target === "socket") {
		switch(packet.type) {
			case Packet.types.STATES:
				this._handleStatesPacket(packet);
			break;
			case Packet.types.EVENT:
				this._handleEventPacket(packet);
			break;
		}
	} else {
		var proxy = this._connection.localProxies.getProxyFromObject(packet.target);
		proxy.handlePacket(packet, this._connection);
	}
};

Socket.prototype._handleStatesPacket = function(packet) {
	this._pipes.out(packet.states);
};

Socket.prototype._handleEventPacket = function(packet) {
	var data = packet.data;
	switch(packet.eventType) {
		case 'pipe':
		case 'unpipe':
			var proxy = this._connection.remoteProxies.getProxyFromObject(data);
			this.emit(packet.eventType, proxy);
		break;
	}
};

module.exports = Socket;
