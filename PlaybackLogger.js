
function PlaybackLogger() {
	this._points = [];
	this.current = {};
}

PlaybackLogger.prototype.logPoint = function(realTime, playTime, speed) {
	this._points.push({
		realTime: realTime,
		playTime: playTime,
		speed: speed
	});
};

PlaybackLogger.prototype.setCurrentPoint = function(realTime, playTime) {
	this._current = {
		realTime: realTime,
		playTime: playTime
	};
};

PlaybackLogger.prototype.getPlaybackHistory = function(realTime) {
	var results = [];
	var previous;
	var points = [].concat(this._points);
	points.push(this._current);
	points.forEach(function(next) {
		if (previous) {
			if (previous.speed === 0 && previous.realTime === realTime) {
				results.push({
					time: previous.playTime,
					speed: previous.speed
				});
			} else if (
				(previous.speed > 0 && realTime >= previous.realTime && realTime < next.realTime) ||
				(previous.speed < 0 && realTime <= previous.realTime && realTime > next.realTime)
			) {
				var time = previous.playTime + ((realTime - previous.realTime) * previous.speed);
				results.push({
					time: time,
					speed: previous.speed
				});
			}
		}
		previous = next;
	});
	return results;
};

module.exports = PlaybackLogger;
