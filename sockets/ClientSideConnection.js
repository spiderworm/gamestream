
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;
var packetEncryptor = require('./packetEncryptor.js');
var ProxyManager = require('./ProxyManager.js');
var RemoteStreamProxy = require('./RemoteStreamProxy.js');

function ClientSideConnection(config, localProxies) {
	EventEmitter.call(this);

	this.localProxies = localProxies;
	this.remoteProxies = new ProxyManager(
		null,
		function(object) {
			var proxy = RemoteStreamProxy.createFromObject(object, this);
			return proxy;
		}.bind(this)
	);

	var url = 'ws://' + config.host + ':' + config.port + config.path;

	this._socket = new WebSocket(url);
	this._socket.addEventListener('message', this._handleMessage.bind(this));
}

inherits(ClientSideConnection, EventEmitter);

ClientSideConnection.prototype.send = function(packet) {
	var encrypted = packetEncryptor.encrypt(packet);
	this._socket.send(encrypted);
};

ClientSideConnection.prototype._handleMessage = function(message) {
	var packet = packetEncryptor.decrypt(message.data);
	this.emit('packet', packet);
};

module.exports = ClientSideConnection;
