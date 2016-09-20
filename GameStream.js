
var Stream = require('stream');
var inherits = require('inherits');
var now = require('./misc/now.js');
var PipeBag = require('./stream/PipeBag.js');
var PlaybackControls = require('./playback/PlaybackControls.js');
var statesUtil = require('./states/statesUtil.js');
var CustomWritable = require('./stream/CustomWritable.js');
var Config = require('./misc/Config.js');

var defaultConfig = new Config({
	push: true,
	pushInterval: 0,
	lag: 0,
	fullDataMode: false,
});

function GameStream(config) {
	if (!(this instanceof GameStream)) {
		return new GameStream(config);
	}

	this._pipes = new PipeBag();
	PipeBag.exposeInterface(this, this._pipes);

	config = new Config(defaultConfig, [config]);
	Config.apply(config, this);

	this._playback = new PlaybackControls();
	this._playback.setTime(now() - this.lag);
	PlaybackControls.exposeInterface(this, this._playback);

	this._emitter = new CustomWritable(this._emitGameUpdates.bind(this));
	this._playback.pipe(this._emitter);

	Stream.call(this, { objectMode: true });
}

inherits(GameStream, Stream);

Object.defineProperty(GameStream.prototype, 'state', {
	get: function() { return this.getState(); },
	set: function(stateValues) { this.setStateAt(this.getTime(), stateValues); }
});

Object.defineProperty(GameStream.prototype, 'fullDataMode', {
	get: function() { return this._fullDataMode; },
	set: function(val) {
		val = !!val;
		if (val !== this._fullDataMode) {
			this._fullDataMode = val;
			this._updatePushing();
		}
	}
});

Object.defineProperty(GameStream.prototype, 'push', {
	get: function() { return this._push; },
	set: function(val) {
		val = !!val;
		if (val !== this._push) {
			this._push = val;
			this._updatePushing();
		}
	}
});

Object.defineProperty(GameStream.prototype, 'pushInterval', {
	get: function() { return this._pushInterval; },
	set: function(val) {
		val = val > 0 ? val : 0;
		if (val !== this._pushInterval) {
			this._pushInterval = val;
			this._updatePushing();
		}
	}
});

GameStream.prototype.write = function(outputStates) {
	this._playback.write(outputStates);
	return true;
};

GameStream.prototype.updateAt = function(time, update) {
	this._playback.write([{time: time, update: update}]);
};

GameStream.prototype.updateNow = function(update) {
	var time = now();
	this.updateAt(time, update);
};

GameStream.prototype.setStateAt = function(time, values) {
	throw new Error('TODO: implement me');
	//var state = new GameState(time, values);
};

GameStream.prototype.getState = function() {
	var gameState = this._playback.getState();
	return gameState || undefined;
};

GameStream.prototype._updatePushing = function() {
	if (this._pushIntervalID) {
		clearInterval(this._pushIntervalID);
		delete this._pushIntervalID;
	}
	if (this._eventPushStream) {
		this._pipes.unpipe(this._eventPushStream);
		delete this._eventPushStream;
	}
	if (this._push) {
		this._pushIntervalID = setInterval(
			this._pushUpdates.bind(this),
			this._pushInterval
		);
		if (this._fullDataMode) {
			this._eventPushStream = new CustomWritable(function(states) {
				this.emit('full-data', states);
			}.bind(this));
		} else {
			this._eventPushStream = new CustomWritable(function(states) {
				this.emit('data', statesUtil.merge(states));
			}.bind(this));
		}
		this._pipes.pipe(this._eventPushStream);
	}
};

GameStream.prototype._pushUpdates = function() {
	this._playback.update();
};

GameStream.prototype._emitGameUpdates = function(gameUpdates) {
	if (gameUpdates.length) {
		this._pipes.forEach(function(writable) {
			writable.write(gameUpdates);
		});
	}
};

module.exports = GameStream;
