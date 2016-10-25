
var inherits = require('inherits');
var StreamProxy = require('./StreamProxy.js');
var GameStream = require('../GameStream.js');
var Packet = require('./Packet.js');
var LocalStreamProxy = require('./LocalStreamProxy.js');
var now = require('../misc/now.js');

function RemoteStreamProxy(id, config, connection) {
	StreamProxy.call(this, id, config);
	this._connection = connection;
	this.on(GameStream.events.DELEGATE_REQUESTED, this._requestDelegate.bind(this));
}

inherits(RemoteStreamProxy, StreamProxy);

RemoteStreamProxy.prototype.write = function(states) {
	var packet = new Packet.StatesPacket(this.toObject(), states);
	this._connection.send(packet);
};

RemoteStreamProxy.prototype.updateNow = function(update) {
	var packet = new Packet.StateUpdatePacket(this.toObject(), now(), update);
	this._connection.send(packet);
};

RemoteStreamProxy.prototype.hostDelegate = function(delegate) {
	var delegateProxy = LocalStreamProxy.createFromStream(delegate, {
		allowStateWrite: true,
		allowMessages: true
	});
	this._connection.localProxies.add(delegateProxy);
	var packet = new Packet.CommandPacket(
		GameStream.events.DELEGATE_HOSTED,
		this.toObject(),
		delegateProxy.toObject()
	);
	this._connection.send(packet);
};

RemoteStreamProxy.prototype.message = function(msg) {
	var packet = new Packet.EventPacket(
		'message',
		this.toObject(),
		msg
	);
	this._connection.send(packet);
};

RemoteStreamProxy.prototype._requestDelegate = function(targetStream) {
	var packet = new Packet.EventPacket(
		GameStream.events.DELEGATE_REQUESTED,
		this.toObject(),
		this._connection.localProxies.getObjectFromLocalStream(targetStream)
	);
	this._connection.send(packet);
};

RemoteStreamProxy.createFromObject = function(object, connection) {
	var proxy = new RemoteStreamProxy(object.id, object.config, connection);
	return proxy;
};

module.exports = RemoteStreamProxy;
