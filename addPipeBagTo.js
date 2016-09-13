
var Pipe = require('./GamePipe');

function PipeBag() {
	this._pipes = [];	
}

PipeBag.prototype.pipe = function(writable) {
	var pipe = new Pipe(writable);
	this._pipes.push(pipe);
	writable.emit('pipe', this);
};

PipeBag.prototype.unpipe = function(writable) {
	var i = this._pipes.findIndex(function(pipe) {
		return pipe.writable === writable;
	});
	if (i > -1) {
		var pipe = this._pipes.splice(i,1)[0];
		pipe.writable.emit('unpipe', this);
	}
};

PipeBag.prototype.eachPipe = function(callback) {
	this._pipes.forEach(function(pipe, i) {
		callback(pipe.writable, i);
	});
};

function addPipeBagTo(obj) {
	Object.assign(obj, PipeBag.prototype);
	PipeBag.apply(obj);
	return obj;
};

module.exports = addPipeBagTo;
