
var Stream = require('stream');
var inherits = require('inherits');
var now = require('../misc/now.js');
var OutputState = require('../states/OutputState.js');
var RewriteOutputState = require('../states/RewriteOutputState.js');
var PlaybackPointer = require('./PlaybackPointer.js');
var statesUtil = require('../states/statesUtil.js');
var PipeBag = require('../stream/PipeBag.js');
var CustomWritable = require('../stream/CustomWritable.js');

function PlaybackControls() {
	Stream.call(this, { objectMode: true });

	this._buffer = [];

	this._pointer = new PlaybackPointer();

	this._pipes = new PipeBag(this);
	PipeBag.exposeInterface(this, this._pipes);

	this.on('pipe', function(statesStorage) {
		this._pointer.setStatesStore(statesStorage._timeStore);
	}.bind(this));
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
	return this._bufferRewrites(data);
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
		this._bufferUpdates();
		var update = new OutputState(now());
		update.speed = speed;
		this._buffer.push(update);
		this._pointer.setSpeed(speed);
	}
};

PlaybackControls.prototype.getTime = function() {
	return this._pointer.time;
};

PlaybackControls.prototype.setTime = function(time) {
	this._pointer.time = time;
};

PlaybackControls.prototype.tick = function() {
	this._bufferUpdates();
	var updates = this._flushUpdates();
	this._pipes.forEach(function(writable) {
		writable.write(updates);
	});
};

PlaybackControls.prototype._bufferUpdates = function() {
	if (!this._pointer || this._pointer.speed === 0) {
		return;
	}
	var states = this._pointer.advance();
	if (states.length > 0) {
		var reverse = this._pointer.speed < 0;
		this._bufferStates(states, reverse);
	}
};

PlaybackControls.prototype._flushUpdates = function() {
	var states = this._buffer;
	this._buffer = [];
	return states;
};

PlaybackControls.prototype._bufferRewrites = function(states) {
	states.forEach(function(state) {
		var history = this._pointer.getHistory(state.time);
		if (history.length) {
			var rewrites = history.map(function(point) {
				return RewriteOutputState.fromState(state, point.time, point.speed < 0);
			});
			var currentState = this.getState();
			if (currentState) {
				var fixedOutput = statesUtil.createUnrewritePatch(rewrites, currentState);
				fixedOutput.time = this._pointer.getPlaybackTime(currentState.time);
				rewrites.push(fixedOutput);
				this._buffer = this._buffer.concat(rewrites);
			}
		}
	}.bind(this));
};

PlaybackControls.prototype._bufferStates = function(states, reverse) {
	states = states.map(function(state) {
		var time = this._pointer.getRealTime(state.time);
		var outputState = OutputState.fromState(state, time, reverse);
		return outputState;
	}.bind(this));
	this._buffer = this._buffer.concat(states);
};

module.exports = PlaybackControls;
