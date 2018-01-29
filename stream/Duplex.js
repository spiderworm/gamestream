
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;
var Readable = require('./Readable.js');
var Writable = require('./Writable.js');

function Duplex() {
	EventEmitter.call(this);
	Readable.call(this);
	Writable.call(this);
}

inherits(Duplex, EventEmitter);
Readable.applyTo(Duplex);
Writable.applyTo(Duplex);

Duplex.applyTo = function(Klass) {
	for (var prop in this.prototype) {
		Klass.prototype[prop] = this.prototype[prop];
	}
};

Duplex.create = function(o) {
	switch (typeof o) {
		case "function":
			return Duplex.fromFunction(o);
		break;
		case "object":
			if (o.write && o.read) {
				return o;
			}
		break;
	}
	return new Duplex(o);
}

Duplex.fromFunction = function(func) {
	var duplex = new Duplex();
	duplex.push = func;
	return duplex;
};

Duplex.prototype.write = function(chunk, encoding, callback) {
	this.push(chunk);
};

module.exports = Duplex;
