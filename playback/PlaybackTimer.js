
var playbackUtil = require('./playbackUtil.js');
var PlaybackPoint = require('./PlaybackPoint.js');

function PlaybackTimer(playTime) {
	this._rebase(
		playbackUtil.now(),
		playTime,
		1
	);
}

Object.defineProperty(PlaybackTimer.prototype, 'real', {
	get: function() { return this.getRealTime(); }
});

Object.defineProperty(PlaybackTimer.prototype, 'playback', {
	get: function() { return this.getPlaybackTime(); },
	set: function(v) { this.setPlaybackTime(v); }
});

Object.defineProperty(PlaybackTimer.prototype, 'speed', {
	get: function() { return this._basePoint.speed; },
	set: function(v) { this.setSpeed(v); }
});

PlaybackTimer.prototype.getPoint = function() {
	return PlaybackPoint.currentFromPoint(this._basePoint);
};

PlaybackTimer.prototype.setSpeed = function(speed) {
	var time = playbackUtil.now();
	this._rebase(
		time,
		playbackUtil.realToPlayback(time, this._basePoint),
		speed
	);
	return PlaybackPoint.fromPoint(this._basePoint);
};

PlaybackTimer.prototype.getRealTime = function(playTime) {
	if (!playTime && playTime !== 0) {
		return playbackUtil.now();
	}
	return playbackUtil.playbackToReal(playTime, this._basePoint);
};

PlaybackTimer.prototype.getPlaybackTime = function(realTime) {
	if (!realTime && realTime !== 0) {
		realTime = this.getRealTime();
	}
	return playbackUtil.realToPlayback(realTime, this._basePoint);
};

PlaybackTimer.prototype.setPlaybackTime = function(playTime) {
	this._rebase(
		playbackUtil.now(),
		playTime,
		this._basePoint.speed
	);
	return PlaybackPoint.fromPoint(this._basePoint);
};

PlaybackTimer.prototype._rebase = function(realTime, playTime, speed) {
	this._basePoint = new PlaybackPoint(
		realTime,
		playTime,
		speed
	);
};

module.exports = PlaybackTimer;
