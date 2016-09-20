
var Stream = require('stream');
var inherits = require('inherits');

function CustomWritable(callback) {
	this._callback = callback;
}

inherits(CustomWritable, Stream);

CustomWritable.prototype.write = function(data) {
	this._callback(data);
};

module.exports = CustomWritable;
