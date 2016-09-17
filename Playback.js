
var now = require('./now.js');
var OutputState = require('./OutputState.js');
var PlaybackTimer = require('./PlaybackTimer.js');
var GameState = require('./GameState.js');
var statesUtil = require('./statesUtil.js');


function Playback(gameStatesBag) {
	this._states = gameStatesBag;
	this._buffer = [];
	this._history = {};
	var time = now();
	this._time = new PlaybackTimer(time, time);
	this.setSpeed(1);
}

Playback.exposeInterface = function(target, playback) {
	var instance = null;
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
		})
	});
};

Object.defineProperty(Playback.prototype, 'speed', {
	get: function() { return this._time.speed; },
	set: function(speed) { this.setSpeed(speed); }
});

Object.defineProperty(Playback.prototype, 'time', {
	get: function() { return this._time.playback; },
	set: function(time) { this._time.playback = time; }
});

Playback.prototype.getState = function() {
	return this._states.getStateAt(this.getTime());
};

Playback.prototype.play = function() {
	this.setSpeed(1);
};

Playback.prototype.pause = function() {
	this.setSpeed(0);
};

Playback.prototype.fastForward = function(speed) {
	if (!speed) {
		speed = 2;
	}
	this.setSpeed(speed);
};

Playback.prototype.rewind = function(speed) {
	if (!speed) {
		speed = 1;
	}
	speed = -speed;
	this.setSpeed(speed);
};

Playback.prototype.setSpeed = function(speed) {
	this.bufferUpdates();
	var update = new OutputState(now());
	update.speed = speed;
	this._buffer.push(update);
	this._time.setSpeed(speed);
};

Playback.prototype.getTime = function() {
	return this._time.playback;
};

Playback.prototype.setTime = function(time) {
	this._time.setPlaybackTime(time);
};

Playback.prototype.bufferUpdates = function() {
	if (this._time.speed === 0) {
		return;
	}
	var reverse = this._time.speed < 0;
	var endTime = this.getTime();
	var states;
	if (!reverse) {
		states = this._states.getAllAfter(this._lastBuffered, endTime);
	} else {
		states = this._states.getAllBefore(this._lastBuffered, endTime);
	}
	if (states.length > 0) {
		this._bufferStates(states, reverse);
		this._lastBuffered = states[states.length - 1];
	}
};

Playback.prototype.bufferRewrites = function(state) {
	var history = this._time.getPlaybackHistory(state.time);
	if (history.length) {
		var rewrites = history.map(function(point) {
			return OutputState.fromGameState(point.time, state, point.speed < 0, true);
		});
		var currentState = this.getState();
		last = currentState.values.retroactiveProp;
		var fixedOutput = statesUtil.createUnrewritePatch(rewrites, currentState);
		fixedOutput.time = this._time.getPlaybackTime(currentState.time);
		rewrites.push(fixedOutput);
		this._buffer = this._buffer.concat(rewrites);
	}
};

Playback.prototype.flushUpdates = function() {
	var states = this._buffer;
	this._buffer = [];
	return states;
};

Playback.prototype._bufferStates = function(states, reverse) {
	states = states.map(function(state) {
		var time = this._time.getRealTime(state.time);
		var outputState = OutputState.fromGameState(time, state, reverse);
		return outputState;
	}.bind(this));
	this._buffer = this._buffer.concat(states);
};

module.exports = Playback;
