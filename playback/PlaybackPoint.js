
var playbackUtil = require('./playbackUtil.js');

function PlaybackPoint(realTime, playTime, speed) {
	this.real = realTime;
	this.play = playTime;
	this.speed = speed;
}

PlaybackPoint.fromPoint = function(playbackPoint) {
	return new PlaybackPoint(playbackPoint.real, playbackPoint.play, playbackPoint.speed);
};

PlaybackPoint.currentFromPoint = function(playbackPoint) {
	var real = playbackUtil.now();
	return new PlaybackPoint(
		real,
		playbackUtil.realToPlayback(real, playbackPoint),
		playbackPoint.speed
	);
};

module.exports = PlaybackPoint;
