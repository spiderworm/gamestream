
var Duplex = require('./Duplex.js');
var inherits = require('inherits');
var Config = require('../misc/Config.js');
var objectFactory = require('../misc/objectFactory.js');

var defaultConfig = new Config({
	info: {}
});

function GameStreamDuplex(config) {
	Duplex.call(this);
	config = new Config(defaultConfig, [config]);
	this._info = objectFactory.clone(config.info);
}

inherits(GameStreamDuplex, Duplex);

Object.defineProperty(GameStreamDuplex.prototype, 'info', {
	get: function() {
		return objectFactory.clone(this._info);
	}
});

GameStreamDuplex.prototype.message = function(msg) {
	this.emit('message', msg);
};

GameStreamDuplex.prototype.delegate = function() {
	console.error('delegate not implemented');
};

GameStreamDuplex.prototype.undelegate = function() {
	console.error('undelegate not implemented');
};

GameStreamDuplex.prototype.hostDelegate = function() {
	console.error('hostDelegate not implemented');
};

GameStreamDuplex.prototype.unhostDelegate = function() {
	console.error('unhostDelegate not implemented');
};

GameStreamDuplex.prototype.requestDelegateFrom = function() {
	console.error('requestDelegateFrom not implemented');
};

module.exports = GameStreamDuplex;
