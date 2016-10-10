
var Stream = require('stream');
var inherits = require('inherits');
var playbackUtil = require('./playbackUtil.js');
var OutputState = require('../states/OutputState.js');
var RewriteOutputState = require('../states/RewriteOutputState.js');
var CatchUpOutputState = require('../states/CatchUpOutputState.js');
var PipeBag = require('../stream/PipeBag.js');
var CustomWritable = require('../stream/CustomWritable.js');

function PlaybackControls(playbackPointer) {
	Stream.call(this, { objectMode: true });

	this._pointer = playbackPointer;

	this._pipes = new PipeBag(this);
	PipeBag.exposeInterface(this, this._pipes);
}

inherits(PlaybackControls, Stream);

PlaybackControls.exposeInterface = function(target, playback) {
	var methods = [
		'play', 'pause', 'fastForward', 'rewind',
		'setSpeed', 'getTime', 'setTime'
	];
	methods.forEach(function(name) {
		target[name] = playback[name].bind(playback);
	});
	var properties = ['time', 'speed'];
	properties.forEach(function(property) {
		Object.defineProperty(target, property, {
			get: function() { return playback[property]; },
			set: function(val) { playback[property] = val; }
		});
	});
};

Object.defineProperty(PlaybackControls.prototype, 'speed', {
	get: function() { return this._pointer.speed; },
	set: function(speed) { this.setSpeed(speed); }
});

Object.defineProperty(PlaybackControls.prototype, 'time', {
	get: function() { return this._pointer.time; },
	set: function(time) { this._pointer.time = time; }
});

PlaybackControls.prototype.write = function(data) {
	this._outputRewrites(data);
	return true;
};

PlaybackControls.prototype.getState = function() {
	return this._pointer.getCurrentState();
};

PlaybackControls.prototype.play = function() {
	this.setSpeed(1);
};

PlaybackControls.prototype.pause = function() {
	this.setSpeed(0);
};

PlaybackControls.prototype.fastForward = function(speed) {
	if (!speed) {
		speed = 2;
	}
	this.setSpeed(speed);
};

PlaybackControls.prototype.rewind = function(speed) {
	if (!speed) {
		speed = 1;
	}
	this.setSpeed(-speed);
};

PlaybackControls.prototype.setSpeed = function(speed) {
	if (speed !== this._pointer.speed) {
		this._updatePointer();
		this._pointer.setSpeed(speed);
		var update = new OutputState(playbackUtil.now());
		update.speed = speed;
		this._pipes.out([update]);
	}
};

PlaybackControls.prototype.getTime = function() {
	return this._pointer.time;
};

PlaybackControls.prototype.setTime = function(time) {
	this._pointer.time = time;
};

PlaybackControls.prototype.tick = function() {
	this._updatePointer();
};

PlaybackControls.prototype._updatePointer = function() {
	if (this._pointer.speed === 0) {
		return;
	}
	var states = this._pointer.advance();
	if (states.length > 0) {
		var point = this._pointer.getCurrentPoint();
		states = createOutputStates(states, point);
		this._pipes.out(states);
	}
};

PlaybackControls.prototype._outputRewrites = function(states) {
	var rewrites = createRewriteStates(states, this._pointer);
	if (rewrites.length > 0) {
		var currentState = this._pointer.getCurrentState();
		var time = this._pointer.getPlaybackTime(currentState.time);
		var unrewriteState = CatchUpOutputState.fromRewriteStates(rewrites, currentState, time);
		this._pipes.out(rewrites.concat(unrewriteState));
	}
};

function createOutputStates(states, playbackPoint) {
	return states.map(function(state) {
		var time = playbackUtil.playbackToReal(state.time, playbackPoint);
		var reverse = playbackPoint.speed < 0;
		var outputState = OutputState.fromState(state, time, reverse);
		return outputState;
	});
}

function createRewriteStates(states, playbackPointer) {
	var currentState = playbackPointer.getCurrentState();
	var allRewrites = [];
	states.forEach(function(state) {
		var history = playbackPointer.getHistory(state.time);
		if (history.length > 0) {
			var rewrites = history.map(function(point) {
				return RewriteOutputState.fromState(state, point.time, point.speed < 0);
			});
			allRewrites = allRewrites.concat(rewrites);
		}
	});
	return allRewrites;
}

module.exports = PlaybackControls;
