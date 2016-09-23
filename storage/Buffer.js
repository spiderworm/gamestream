
var Stream = require('stream');
var inherits = require('inherits');
var PipeBag = require('../stream/PipeBag.js');

function Buffer() {
	this._pipes = new PipeBag(this);
	PipeBag.exposeInterface(this, this._pipes);
	Stream.call(this, { objectMode: true });
	this._items = [];
}

inherits(Buffer, Stream);

Buffer.prototype.write = function(vals) {
	this._items = this._items.concat(vals);
};

Buffer.prototype.flush = function() {
	var items = this._items;
	this._items = [];
	this._pipes.out(items);
};

module.exports = Buffer;
