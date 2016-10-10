
var Duplex = require('./Duplex.js');
var inherits = require('inherits');

function GameStreamDuplex() {
	Duplex.call(this);
}

inherits(GameStreamDuplex, Duplex);

GameStreamDuplex.prototype.requestDelegateFrom = function() {
	console.error('requestDelegateFrom not implemented');
};

GameStreamDuplex.prototype.assignDelegate = function() {
	console.error('assignDelegate not implemented');
};

module.exports = GameStreamDuplex;
