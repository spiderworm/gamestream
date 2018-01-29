
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;
var StreamBuffer = require('./StreamBuffer.js');
var Writable = require('./Writable.js');

function Readable() {
	EventEmitter.call(this);
	this.buffer = new StreamBuffer();
	this._writables = [];
	this._isPaused = false;

	this.__handleDownstreamPipe = (writable) => {
		if (writable === this) {
			console.error("circular pipe detected");
		} else {
			this.emit(Readable.EVENTS.DOWNSTREAM_PIPE, writable);
		}
	};
}

Readable.EVENTS = {
	READABLE: 'readable',
	CLOSE: 'close', // TODO: implement
	DOWNSTREAM_PIPE: 'downstream-pipe',
	END: 'end', // TODO: implement
	ERROR: 'error' // TODO: implement,
};

inherits(Readable, EventEmitter);

Readable.applyTo = function(Klass) {
	for (var prop in this.prototype) {
		Klass.prototype[prop] = this.prototype[prop];
	}
};

Readable.prototype.destroy = function(error) {
	console.error('not implemented');
};

Readable.prototype.isPaused = function() {
	return this._isPaused;
};

Readable.prototype.pause = function() {
	this._isPaused = true;
};

Readable.prototype.pipe = function(writable, options) {
	writable = Writable.create(writable);

	this._writables.push(writable);

	writable.emit(Writable.EVENTS.PIPE, this);

	writable.on(Readable.EVENTS.DOWNSTREAM_PIPE, this.__handleDownstreamPipe);

	this.emit(Readable.EVENTS.DOWNSTREAM_PIPE, writable);

	return writable;
};

Readable.prototype.push = function(arr) {
	if (arr) {
		var wasEmpty;
		if (this.buffer.isEmpty()) {
			wasEmpty = true;
		}
		arr.forEach((item) => this.buffer.push(item));
		if (wasEmpty && !this.buffer.isEmpty()) {
			this.emit(Readable.EVENTS.READABLE);
		}
	}
	if (!this.isPaused()) {
		var output = this.read();
		this._writables.forEach(writable => {
			writable.write(output);
		});
	}
};

Readable.prototype.read = function(size) {
	return this.buffer.flush();
};

Readable.prototype.resume = function() {
	this._isPaused = false;
	this.push();
};

Readable.prototype.setEncoding = function(encoding) {
	console.error('not implemented');
};

Readable.prototype.unpipe = function(writable) {
	var unpiped;

	if (!writable) {
		unpiped = this._writables;
		this._writables = [];
	} else {
		var i = this._writables.indexOf(writable);
		if (i !== -1) {
			unpiped = [writable];
			this._writables.splice(i, 1);
		}
	}

	unpiped.forEach(writable => {
		writable.emit(Writable.EVENTS.UNPIPE, this);
		writable.removeListener(
			Readable.EVENTS.DOWNSTREAM_PIPE,
			this.__handleDownstreamPipe
		);
	});
};

Readable.prototype.unshift = function(chunk) {
	console.error('not implemented');
};

Readable.prototype.wrap = function(stream) {
	console.error('not implemented');
};

module.exports = Readable;
