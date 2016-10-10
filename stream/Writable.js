
var Stream = require('stream');
var inherits = require('inherits');

function Writable() {
	Stream.call(this, { objectMode: true });
}

inherits(Writable, Stream);

Writable.prototype.write = function() {
	console.error('Writable.write not implemented');	
};

module.exports = Writable;
