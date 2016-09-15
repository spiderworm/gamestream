
var now = require('./now.js');

function PlaybackTimer(playTime, realTime) {
	this._lastPlayback = playTime;
	this._lastReal = realTime;
	this._speed = 0;
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
	return this._lastReal + ((playTime - this._lastPlayback) * (1 / this._speed));
};

PlaybackTimer.prototype.getPlaybackTime = function(realTime) {
	if (!realTime && realTime !== 0) {
		realTime = this.getRealTime();
	}
	return this._lastPlayback + (this._speed * (realTime - this._lastReal));
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
