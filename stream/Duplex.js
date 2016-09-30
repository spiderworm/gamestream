
var Writable = require('./Writable.js');
var Readable = require('./Readable.js');
var inherits = require('inherits');

function Duplex() {
	Writable.call(this);
	Readable.call(this);
}

inherits(Duplex, Writable);
inherits(Duplex, Readable);

module.exports = Duplex;
