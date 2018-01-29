
var inherits = require('inherits');
var Duplex = require('./Duplex.js');

function TransformPipe(transform) {
	Duplex.call(this);
	this.__transform = transform;
}

inherits(TransformPipe, Duplex);

TransformPipe.prototype.push = function(states) {
	states = this.__transform(states);
	Duplex.prototype.push.call(this, states);
};

module.exports = TransformPipe;
