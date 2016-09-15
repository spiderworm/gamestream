
var cloneUtil = require('./cloneUtil.js');

function OutputState(time, update) {
	this.time = time;
	if (update) {
		this.update = cloneUtil.clone(update);
	}
}

module.exports = OutputState;
