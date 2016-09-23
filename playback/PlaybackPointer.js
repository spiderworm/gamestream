
var PlaybackTimer = require('./PlaybackTimer.js');
var now = require('../misc/now.js');
var PlaybackLogger = require('./PlaybackLogger.js');

function PlaybackPointer(statesTimeStore) {
	this._timeStore = statesTimeStore;
	var time = now();
	this._time = new PlaybackTimer(time);
	this._logs = new PlaybackLogger(this._time.getPoint());
	this._lastBuffered = undefined;
}

Object.defineProperty(PlaybackPointer.prototype, 'speed', {
	get: function() { return this._time.speed; },
	set: function(v) { this.setSpeed(v); }
});

Object.defineProperty(PlaybackPointer.prototype, 'time', {
	get: function() { return this._time.playback; },
	set: function(v) { this.setTime(v); }
});

PlaybackPointer.prototype.setSpeed = function(speed) {
	var point = this._time.setSpeed(speed);
	this._logs.logPoint(point);
};

PlaybackPointer.prototype.setTime = function(playbackTime) {
	var point = this._time.setPlaybackTime(playbackTime);
	this._logs.logPoint(point);
};

PlaybackPointer.prototype.advance = function() {
	this._logs.setCurrentPoint(this._time.getPoint());
	if (this._time.speed === 0) {
		return [];
	}
	var endTime = this._time.playback;
	var states;
	if (this._time.speed > 0) {
		states = this._findPassedStatesForward(endTime);
	} else {
		states = this._findPassedStatesReverse(endTime);
	}
	if (states.length > 0) {
		this._lastBuffered = states[states.length - 1];
	}
	return states;
};

PlaybackPointer.prototype.getHistory = function(realTime) {
	var history = this._logs.getPlaybackHistory(realTime);
	return history;
};

PlaybackPointer.prototype.getPlaybackTime = function(realTime) {
	return this._time.getPlaybackTime(realTime);
};

PlaybackPointer.prototype.getRealTime = function(playbackTime) {
	return this._time.getRealTime(playbackTime);
};

PlaybackPointer.prototype.getCurrentState = function() {
	return this._timeStore.getAt(this._time.playback);
};

PlaybackPointer.prototype.getCurrentPoint = function() {
	return this._logs.current;
};

PlaybackPointer.prototype.moveTo = function(playTime) {
	var point = this._time.getPoint();
	point.speed = undefined;
	this._logs.logPoint(point);
	var point = this._time.setPlaybackTime(playTime);
	this._logs.logPoint(point);
};

PlaybackPointer.prototype._findPassedStatesForward = function(endTime) {
	var i1 = (
		this._lastBuffered ?
		this._timeStore.states.indexOf(this._lastBuffered) + 1:
		0
	);
	var i2 = i1;
	var endIndexes = this._timeStore.indexesAt(endTime);
	if (endIndexes.length) {
		i2 = endIndexes[endIndexes.length - 1] + 1;
	}
	var states = this._timeStore.states.slice(i1, i2);
	return states;
};

PlaybackPointer.prototype._findPassedStatesReverse = function(endTime) {
	var i2 = (
		this._lastBuffered ?
		this._timeStore.states.indexOf(this._lastBuffered) :
		this._timeStore.states.length
	);
	var i1 = i2;
	var endIndexes = this._timeStore.indexesAt(endTime);
	if (endIndexes.length) {
		i1 = endIndexes[0];
	}
	var states = this._timeStore.states.slice(i1, i2).reverse();
	return states;
};

module.exports = PlaybackPointer;
