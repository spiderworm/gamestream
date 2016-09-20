
var Pipe = require('./Pipe.js');

function PipeBag(parent) {
	this._parent = parent;
	this._pipes = [];	
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
};

PipeBag.prototype.unpipe = function(writable) {
	var i = this._pipes.findIndex(function(pipe) {
		return pipe.writable === writable;
	});
	if (i > -1) {
		var pipe = this._pipes.splice(i,1)[0];
		pipe.writable.emit('unpipe', this._parent);
	}
};

PipeBag.prototype.forEach = function(callback) {
	this._pipes.forEach(function(pipe, i) {
		callback(pipe.writable, i);
	});
};

module.exports = PipeBag;
