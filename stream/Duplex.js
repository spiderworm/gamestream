
var Stream = require('stream');
var inherits = require('inherits');
var PipeBag = require('./PipeBag.js');

function Duplex() {
	Stream.call(this, { objectMode: true });
	this._pipes = new PipeBag(this);
	PipeBag.exposeInterface(this, this._pipes);
}

inherits(Duplex, Stream);

Duplex.prototype.write = function() {
	console.error('Duplex.write not implemented');	
};

module.exports = Duplex;
