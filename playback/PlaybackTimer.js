
var now = require('../misc/now.js');
var playbackUtil = require('./playbackUtil.js');

function PlaybackTimer(playTime, realTime) {
	this._lastPlayback = playTime;
	this._lastReal = realTime;
	this._speed = 1;
}

Object.defineProperty(PlaybackTimer.prototype, 'real', {
	get: function() { return this.getRealTime(); }
});

Object.defineProperty(PlaybackTimer.prototype, 'playback', {
	get: function() { return this.getPlaybackTime(); },
	set: function(v) { this.setPlaybackTime(v); }
});

Object.defineProperty(PlaybackTimer.prototype, 'speed', {
	get: function() { return this._speed; },
	set: function(v) { this.setSpeed(v); }
});

PlaybackTimer.prototype.setSpeed = function(speed) {
	this._stablize();
	this._speed = speed;
};

PlaybackTimer.prototype.getRealTime = function(playTime) {
	if (!playTime && playTime !== 0) {
		return now();
	}
	return playbackUtil.playbackToReal(playTime, this._lastReal, this._lastPlayback, this._speed);
};

PlaybackTimer.prototype.getPlaybackTime = function(realTime) {
	if (!realTime && realTime !== 0) {
		realTime = this.getRealTime();
	}
	return playbackUtil.realToPlayback(realTime, this._lastReal, this._lastPlayback, this._speed);
};

PlaybackTimer.prototype.setPlaybackTime = function(playTime) {
	this._lastReal = now();
	this._lastPlayback = playTime;
};

PlaybackTimer.prototype._stablize = function() {
	var real = now();
	var play = this.getPlaybackTime(real);
	this._lastReal = real;
	this._lastPlayback = play;
};

module.exports = PlaybackTimer;
