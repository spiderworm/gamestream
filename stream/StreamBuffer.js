
function StreamBuffer() {
	this._buffer = [];
}

StreamBuffer.prototype.flush = function() {
	var result = this._buffer;
	this._buffer = [];
	return result;	
};

StreamBuffer.prototype.push = function(data) {
	this._buffer.push(data);
};

StreamBuffer.prototype.isEmpty = function() {
	return this._buffer.length === 0;
};

module.exports = StreamBuffer;
