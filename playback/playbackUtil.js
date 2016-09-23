
var now = require('../misc/now.js');

function playbackToReal(playbackTime, referencePoint) {
	return referencePoint.real + ((playbackTime - referencePoint.play) * (1 / referencePoint.speed));
}

function realToPlayback(realTime, referencePoint) {
	return referencePoint.play + (referencePoint.speed * (realTime - referencePoint.real));
}

var playbackUtil = {
	now: now,
	playbackToReal: playbackToReal,
	realToPlayback: realToPlayback
};

module.exports = playbackUtil;
