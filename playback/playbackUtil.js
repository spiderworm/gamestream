
var now = require('../misc/now.js');

function playbackToReal(playbackTime, lastRealTime, lastPlaybackTime, speed) {
	return lastRealTime + ((playbackTime - lastPlaybackTime) * (1 / speed));
}

function realToPlayback(realTime, lastRealTime, lastPlaybackTime, speed) {
	return lastPlaybackTime + (speed * (realTime - lastRealTime));
}

var playbackUtil = {
	now: now,
	playbackToReal: playbackToReal,
	realToPlayback: realToPlayback
};

module.exports = playbackUtil;
