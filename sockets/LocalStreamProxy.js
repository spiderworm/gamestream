
var inherits = require('inherits');
var StreamProxy = require('./StreamProxy.js');
var Packet = require('./Packet.js');
var GameStream = require('../GameStream.js');
var Config = require('../misc/Config.js');

var defaultPerms = new Config({
	allowStateWrite: false,
	allowDelegateHost: false,
	allowDelegateRequest: false,
	allowMessages: false
});

function LocalStreamProxy(stream, permissions) {
	StreamProxy.call(this, null, stream);

	this._perms = new Config(defaultPerms, [permissions]);

	this.target = stream;
}

inherits(LocalStreamProxy, StreamProxy);

LocalStreamProxy.prototype.handlePacket = function(packet, connection) {
	switch(packet.type) {
		case Packet.types.EVENT:
			this._handleEventPacket(packet, connection);
		break;
		case Packet.types.COMMAND:
			this._handleCommandPacket(packet, connection);
		break;
		case Packet.types.STATE_UPDATE:
			this._handleUpdatePacket(packet, connection);
		break;
		default:
			console.error('LocalStreamProxy.handlePacket: no handler for', packet.type);
		break;
	}
};

LocalStreamProxy.prototype._handleEventPacket = function(packet, connection) {
	switch(packet.eventType) {
		case GameStream.events.DELEGATE_REQUESTED:
			if (this._perms.allowDelegateRequest) {
				var requestor = connection.remoteProxies.getProxyFromObject(packet.data);
				this.target.emit(packet.eventType, requestor);
			}
		break;
		case 'message':
			if (this._perms.allowMessages) {
				var msg = packet.data;
				this.target.emit(packet.eventType, msg);
			}
		break;
	}
};

LocalStreamProxy.prototype._handleCommandPacket = function(packet, connection) {
	switch(packet.commandType) {
		case GameStream.events.DELEGATE_HOSTED:
			if (this._perms.allowDelegateHost) {
				var delegate = connection.remoteProxies.getProxyFromObject(packet.data);
				this.target.hostDelegate(delegate);
			}
		break;
		default:
			console.error('LocalStreamProxy._handleEventPacket: no handler for', packet.commandType);
		break;
	}
};

LocalStreamProxy.prototype._handleUpdatePacket = function(packet, connection) {
	if (this._perms.allowStateWrite) {
		this.target.updateAt(packet.time, packet.update);
	}
};

LocalStreamProxy.createFromStream = function(stream, permissions) {
	var proxy = new LocalStreamProxy(stream, permissions);
	return proxy;
};

module.exports = LocalStreamProxy;
