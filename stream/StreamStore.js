
var inherits = require('inherits');
var Writable = require('./Writable.js');
var StreamBuffer = require('./StreamBuffer.js');

function StreamStore() {
	Writable.call(this);
	this.buffer = new StreamBuffer();
}

inherits(StreamStore, Writable);

StreamStore.prototype.write = function(chunk, encoding, callback) {
	this.buffer.push(chunk);
};

module.exports = StreamStore;
