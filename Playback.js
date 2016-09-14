
var now = require('./now.js');
var TimedUpdate = require('./TimedUpdate.js');

function Playback(gameStatesBag) {
	this._states = gameStatesBag;
	this._updateBuffer = [];
	this._speed = 1;
}

Playback.exposeInterface = function(target, playback) {
	var instance = null;
	var methods = ['play', 'pause', 'fastForward', 'rewind', 'setSpeed', 'getTime', 'setTime'];
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
	get: function() { return this._speed; },
	set: function(speed) { this.setSpeed(speed); }
});

Object.defineProperty(Playback.prototype, 'time', {
	get: function() { return this.getTime(); },
	set: function(time) { this.setTime(time); }
});

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
	this._times = {
		lastActual: now(),
		lastComputed: this.getTime()
	};
	this._speed = speed;
};

Playback.prototype.getTime = function() {
	var real = now();
	var realDelta = real - this._times.lastActual;
	var time = Math.floor(this._times.lastComputed + (this._speed * realDelta));
	return time;
};

Playback.prototype.setTime = function(time) {
	this._times = {
		lastActual: now(),
		lastComputed: time
	};
};

Playback.prototype.bufferUpdates = function() {
	if (this._speed === 0) {
		return;
	}
	var endTime = this.getTime();
	if (this._speed > 0) {
		this._bufferForwards(this._lastBuffered, endTime);
	} else {
		this._bufferBackwards(this._lastBuffered, endTime);
	}
};

Playback.prototype.flushUpdates = function() {
	var updates = this._updateBuffer;
	this._updateBuffer = [];
	return updates;
};

Playback.prototype._bufferForwards = function(gameState, endTime) {
	var updates = [];
	var lastBuffered;
	for (var i=this._states.indexOf(gameState) + 1; i<this._states.length; i++) {
		var testState = this._states.get(i);
		if (testState.time > endTime) {
			break;
		}
		updates.push(testState);
	}
	this._bufferUpdates(updates);
};

Playback.prototype._bufferBackwards = function(gameState, endTime) {
	var updates = [];
	var lastBuffered;
	for (var i=this._states.indexOf(gameState) - 1; i>=0; i--) {
		var testState = this._states.get(i);
		if (testState.time < endTime) {
			break;
		}
		updates.push(testState);
	}
	this._bufferUpdates(updates);
};

Playback.prototype._bufferUpdates = function(gameStates) {
	if (gameStates.length) {
		this._lastBuffered = gameStates[gameStates.length - 1];
		var time = now();
		this._updateBuffer = this._updateBuffer.concat(
			gameStates.map(function(state) {
				return new TimedUpdate(
					time,
					state.update
				);
			})
		);
	}
};

module.exports = Playback;
