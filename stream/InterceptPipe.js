
var inherits = require('inherits');
var Writable = require('./Writable.js');

function InterceptPipe(callback) {
	Writable.call(this);
	this.__intercept = callback;
}

inherits(InterceptPipe, Writable);

InterceptPipe.prototype.write = function(states) {
	this.__intercept(states);
};

module.exports = InterceptPipe;
