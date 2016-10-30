
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;
var jsonUtil = require('../misc/jsonUtil.js');
var ProxyManager = require('./ProxyManager.js');
var RemoteStreamProxy = require('./RemoteStreamProxy.js');

function ServerSideConnection(socket, localProxies) {
	EventEmitter.call(this);
	this._socket = socket;

	this.localProxies = localProxies;

	this.remoteProxies = new ProxyManager(
		null,
		function(object) {
			var proxy = RemoteStreamProxy.createFromObject(object, this);
			return proxy;
		}.bind(this)
	);

	this._isOpen = true;

	socket.on('message', this._handleMessage.bind(this));

	socket.on('open', function open() {
		this._isOpen = true;
	}.bind(this));

	socket.on('close', function close() {
		this._isOpen = false;
	}.bind(this));
}

inherits(ServerSideConnection, EventEmitter);

ServerSideConnection.prototype.send = function(packet) {
	var encrypted = jsonUtil.stringify(packet);
	this._socket.send(encrypted);
};

ServerSideConnection.prototype.isOpen = function() {
	return this._isOpen;
};

ServerSideConnection.prototype._handleMessage = function(message) {
	var packet = jsonUtil.parse(message);
	this.emit('packet', packet);
};

module.exports = ServerSideConnection;
