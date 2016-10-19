
var inherits = require('inherits');
var GameStreamDuplex = require('../stream/GameStreamDuplex.js');
var GameStream = require('../GameStream.js');

function StreamProxy(id, config) {
	GameStreamDuplex.call(this, config);
	if (id || id === 0) {
		this.id = id;
	} else {
		this.id = Math.floor(1e9 * Math.random());
	}
}

inherits(StreamProxy, GameStreamDuplex);

StreamProxy.prototype.toObject = function() {
	return {
		id: this.id,
		config: {
			info: this.info
		}
	};
};

StreamProxy.prototype.updateNow = function(state) {
	console.error('StreamProxy.updateNow: not implemented');
};

module.exports = StreamProxy;
