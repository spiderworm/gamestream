
var Pipe = require('./Pipe.js');

function PipeBag(parent) {
	this._parent = parent;
	this._pipes = [];
	this._emitDownstreamConnect = this._emitDownstreamConnect.bind(this);
	this._emitDownstreamDisconnect = this._emitDownstreamDisconnect.bind(this);
}

PipeBag.exposeInterface = function(target, pipeBag) {
	var methods = [
		'pipe', 'unpipe'
	];
	methods.forEach(function(name) {
		target[name] = pipeBag[name].bind(pipeBag);
	});
};

PipeBag.prototype.pipe = function(writable) {
	var pipe = new Pipe(writable);
	this._pipes.push(pipe);
	writable.emit('pipe', this._parent);
	writable.on('downstream-connect', this._emitDownstreamConnect);
	writable.on('downstream-disconnect', this._emitDownstreamDisconnect);
	this._emitDownstreamConnect(writable);
	writable.___parent = this._parent;
};

PipeBag.prototype.unpipe = function(writable) {
	var i = this._pipes.findIndex(function(pipe) {
		return pipe.writable === writable;
	});
	if (i > -1) {
		var pipe = this._pipes.splice(i,1)[0];
		writable.emit('unpipe', this._parent);
		writable.removeListener('downstream-connect', this._emitDownstreamConnect);
		writable.removeListener('downstream-disconnect', this._emitDownstreamDisconnect);
		this._emitDownstreamDisconnect(writable);
		delete writable.___parent;
	}
};

PipeBag.prototype.out = function(data) {
	this.forEach(function(writable) {
		writable.write(data);
	});
};

PipeBag.prototype.forEach = function(callback) {
	this._pipes.forEach(function(pipe, i) {
		callback(pipe.writable, i);
	});
};

PipeBag.prototype._emitDownstreamConnect = function(writable) {
	this._parent.emit('downstream-connect', writable);
};

PipeBag.prototype._emitDownstreamDisconnect = function(writable) {
	this._parent.emit('downstream-disconnect', writable);
};

module.exports = PipeBag;
