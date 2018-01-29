
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;

function Writable() {
	EventEmitter.call(this);

	this.__writable = {
		parent: null
	};

	this.on(
		Writable.EVENTS.PIPE,
		readable => {
			if (this.__writable.parent && this.__writable.parent !== readable) {
				this.__writable.parent.unpipe(this);
			}
			this.__writable.parent = readable;
		}
	);

	this.on(
		Writable.EVENTS.UNPIPE,
		readable => {
			if (this.__writable.parent === readable) {
				this.__writable.parent = null;
			}
		}
	);
}

inherits(Writable, EventEmitter);

Writable.EVENTS = {
	CLOSE: 'close', // TODO: implement
	DRAIN: 'drain', // TODO: implement
	ERROR: 'error', // TODO: implement
	FINISH: 'finish', // TODO: implement
	PIPE: 'pipe',
	UNPIPE: 'unpipe'
};

Writable.applyTo = function(Klass) {
	for (var prop in this.prototype) {
		Klass.prototype[prop] = this.prototype[prop];
	}
};

Writable.create = function(o) {
	switch (typeof o) {
		case "function":
			return Writable.fromFunction(o);
		break;
		case "object":
			if (o.write) {
				return o;
			}
		break;
	}
	return new Writable(o);
}

Writable.fromFunction = function(func) {
	var writable = new Writable();
	writable.write = func;
	return writable;
};

Writable.prototype.cork = function() {
	console.error('not implemented');
};

Writable.prototype.destroy = function(error) {
	console.error('not implemented');
};

Writable.prototype.end = function(chunk, encoding, callback) {
	console.error('not implemented');
};

Writable.prototype.setDefaultEncoding = function(enocding) {
	console.error('not implemented');
};

Writable.prototype.uncork = function() {
	console.error('not implemented');
};

Writable.prototype.write = function(chunk, encoding, callback) {
	console.error('not implemented');
};

module.exports = Writable;
