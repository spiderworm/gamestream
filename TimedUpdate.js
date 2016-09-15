
var cloneUtil = require('./cloneUtil.js');

function TimedUpdate(time, update) {
	this.time = time;
	this.update = cloneUtil.clone(update);
}

module.exports = TimedUpdate;
