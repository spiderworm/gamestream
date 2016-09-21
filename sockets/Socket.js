
var PipeBag = require('../stream/PipeBag.js');
var defaultSocketConfig = require('./defaultSocketConfig.js');
var Config = require('../misc/Config.js');

function Socket(config) {
	this._pipes = new PipeBag();
	PipeBag.exposeInterface(this, this._pipes);
	config = new Config(defaultSocketConfig, [config]);
	var url = 'ws://' + config.host + ':' + config.port + config.path;

	var ws = new WebSocket(url);
	ws.addEventListener('message', function(raw) {
		var msg = JSON.parse(raw.data);
		this._pipes.forEach(function(writable) {
			writable.write(msg);
		});
	}.bind(this));
}

module.exports = Socket;
