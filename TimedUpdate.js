
var cloneUtil = require('./cloneUtil.js');

function TimedUpdate(time, update) {
	this.time = time;
	if (update) {
		this.update = cloneUtil.clone(update);
	}
}

module.exports = TimedUpdate;
