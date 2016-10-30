
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;
var jsonUtil = require('../misc/jsonUtil.js');
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

	var protocol = config.ssl ? 'wss' : 'ws';

	var url = protocol + '://' + config.host + ':' + config.port + '/' + config.path;

	this._socket = new WebSocket(url);
	this._socket.addEventListener('message', this._handleMessage.bind(this));
}

inherits(ClientSideConnection, EventEmitter);

ClientSideConnection.prototype.send = function(packet) {
	var encrypted = jsonUtil.stringify(packet);
	this._socket.send(encrypted);
};

ClientSideConnection.prototype._handleMessage = function(message) {
	var packet = jsonUtil.parse(message.data);
	this.emit('packet', packet);
};

module.exports = ClientSideConnection;
