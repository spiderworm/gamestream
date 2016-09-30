
var Stream = require('stream');
var inherits = require('inherits');
var PipeBag = require('./PipeBag.js');

function Readable() {
	Stream.call(this, { objectMode: true });
	this._pipes = new PipeBag(this);
	PipeBag.exposeInterface(this, this._pipes);
}

inherits(Readable, Stream);

module.exports = Readable;
