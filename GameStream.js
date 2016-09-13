
var Stream = require('stream');
var inherits = require('inherits');
var deepAssign = require('deep-assign');
var now = require('./now.js');
var GameState = require('./GameState.js');
var GamePipe = require('./GamePipe');
var GameUpdate = require('./GameUpdate');

function GameStream(opts) {
	if (!(this instanceof GameStream)) return new GameStream(opts);
	opts = opts || {};

	this.pushInterval = opts.pushInterval || 0;
	this.lag = opts.lag || 0;

	this._pipes = [];
	this._states = [];
	this._updateBuffer = [];
	this._speed = 1;
	this.setTime(now() - this.lag);

	Stream.call(this, { objectMode: true });
}

inherits(GameStream, Stream);

Object.defineProperty(GameStream.prototype, 'pushInterval', {
	get: function() { return this._pushInterval; },
	set: function(pushInterval) {
		pushInterval = pushInterval > 0 ? pushInterval : 0;
		if (this._pushIntervalID) {
			clearInterval(this._pushIntervalID);
		}
		this._pushInterval = pushInterval;
		this._pushIntervalID = setInterval(
			this._pushUpdates.bind(this),
			pushInterval
		);
	}
});

Object.defineProperty(GameStream.prototype, 'speed', {
	get: function() { return this._speed; },
	set: function(speed) { this.setSpeed(speed); }
});

Object.defineProperty(GameStream.prototype, 'time', {
	get: function() { return this.getTime(); },
	set: function(time) { this.setTime(time); }
});

GameStream.prototype.write = function(gameStates) {
	gameStates.forEach(function(gameState) {
		this.updateAt(gameState.time, gameState.update);
	}.bind(this));
	return true;
};

GameStream.prototype.pipe = function(writable) {
	var pipe = new GamePipe(writable);
	this._pipes.push(pipe);
	writable.emit('pipe', this);
};

GameStream.prototype.unpipe = function(writable) {
	var i = this._pipes.findIndex(function(pipe) {
		return pipe.writable === writable;
	});
	if (i > -1) {
		var pipe = this._pipes.splice(i,1)[0];
		pipe.writable.emit('unpipe', this);
	}
};

GameStream.prototype.updateAt = function(time, update) {
	var state = new GameState(time, update);
	this._insertLateState(state);
};

GameStream.prototype.updateNow = function(update) {
	var time = now();
	this.updateAt(time, update);
};

GameStream.prototype.play = function() {
	this.setSpeed(1);
};

GameStream.prototype.pause = function() {
	this.setSpeed(0);
};

GameStream.prototype.fastForward = function(speed) {
	if (!speed) {
		speed = 2;
	}
	this.setSpeed(speed);
};

GameStream.prototype.rewind = function(speed) {
	if (!speed) {
		speed = 1;
	}
	speed = -speed;
	this.setSpeed(speed);
};

GameStream.prototype.setSpeed = function(speed) {
	if (!speed && speed !== 0) {
		speed = 1;
	}
	this._times = {
		lastActual: now(),
		lastComputed: this.getTime()
	};
	this._speed = speed;
};

GameStream.prototype.getTime = function() {
	var real = now();
	var realDelta = real - this._times.lastActual;
	var time = Math.floor(this._times.lastComputed + (this._speed * realDelta));
	return time;
};

GameStream.prototype.setTime = function(time) {
	this._times = {
		lastActual: now(),
		lastComputed: time
	};
};

GameStream.prototype._insertLateState = function(gameState) {
	for (var i=this._states.length - 1; i >= 0; i--) {
		var testState = this._states[i];
		if (testState.time < gameState.time) {
			return this._insertStateAt(gameState, i + 1);
		} else if (testState.time === gameState.time) {
			return this._updateStateAt(gameState, i);
		}
	}
	this._insertStateAt(gameState, 0);
};

GameStream.prototype._insertStateAt = function(gameState, index) {
	this._states.splice(index, 0, gameState);
	this._computeStateValuesAt(index);
	return gameState;
};

GameStream.prototype._updateStateAt = function(gameState, index) {
	throw new Error('not implemented yet');
};

GameStream.prototype._computeStateValuesAt = function(index) {
	for (var i=index; i<this._states.length; i++) {
		if (i > 0) {
			this._states[i].computeValues(this._states[i - 1]);
		}
	}
};

GameStream.prototype._bufferUpdate = function(gameState) {
	var update = new GameUpdate(gameState);
	this._updateBuffer.push(update);
};

GameStream.prototype._pushUpdates = function() {
	if (this._speed === 0) {
		return;
	}
	var endTime = this.getTime();
	if (this._speed > 0) {
		this._bufferForward(this._lastBuffered, endTime);
	} else {
		this._bufferReverse(this._lastBuffered, endTime);
	}
};

GameStream.prototype._bufferForward = function(gameState, endTime) {
	var updates = [];
	var lastBuffered;
	for (var i=this._states.indexOf(gameState) + 1; i<this._states.length; i++) {
		var testState = this._states[i];
		if (testState.time > endTime) {
			break;
		}
		updates.push(new GameUpdate(testState));
		lastBuffered = testState;
	}
	if (updates.length) {
		this._updateBuffer = this._updateBuffer.concat(updates);
		this._lastBuffered = lastBuffered;
		this._checkBufferedUpdates();
	}
};

GameStream.prototype._bufferReverse = function(gameState, endTime) {
	var updates = [];
	var lastBuffered;
	for (var i=this._states.indexOf(gameState) - 1; i>=0; i--) {
		var testState = this._states[i];
		if (testState.time < endTime) {
			break;
		}
		updates.push(new GameUpdate(testState));
		lastBuffered = testState;
	}
	if (updates.length) {
		this._updateBuffer = this._updateBuffer.concat(updates);
		this._lastBuffered = lastBuffered;
		this._checkBufferedUpdates();
	}
};

GameStream.prototype._checkBufferedUpdates = function() {
	if (this._updateBuffer.length) {
		var gameUpdates = this._updateBuffer;
		this._updateBuffer = [];
		this._emitGameUpdates(gameUpdates);
	}
};

GameStream.prototype._emitGameUpdates = function(gameUpdates) {
	if (gameUpdates.length) {
		var updates = [{}].concat(gameUpdates.map(function(gameUpdate) { return gameUpdate.update; }));
		var squashed = deepAssign.apply(null, updates);
		this.emit('data', squashed);
		this._pipes.forEach(function(pipe) {
			pipe.writable.write(gameUpdates);
		});
	}
};

module.exports = GameStream;
