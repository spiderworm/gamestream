
var PipeBag = require('../stream/PipeBag.js');
var defaultSocketConfig = require('./defaultSocketConfig.js');

function Socket(config) {
	this._pipes = new PipeBag();
	PipeBag.exposeInterface(this, this._pipes);

	var host = config.host || defaultSocketConfig.host;
	var port = config.port || defaultSocketConfig.port;
	var path = config.path || defaultSocketConfig.path;
	var url = 'ws://' + host + ':' + port + path;

	var ws = new WebSocket(url);
	ws.addEventListener('message', function(raw) {
		var msg = JSON.parse(raw.data);
		this.eachPipe(function(writable) {
			writable.write(msg);
		});
	}.bind(this));
}

module.exports = Socket;
