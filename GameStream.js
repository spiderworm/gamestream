
var Duplex = require('./stream/Duplex.js');
var inherits = require('inherits');
var now = require('./misc/now.js');
var PlaybackControls = require('./playback/PlaybackControls.js');
var statesUtil = require('./states/statesUtil.js');
var CustomWritable = require('./stream/CustomWritable.js');
var Config = require('./misc/Config.js');
var StateFactory = require('./states/factories/StateFactory.js');
var StatesTimeStore = require('./storage/StatesTimeStore.js');
var Buffer = require('./storage/Buffer.js');

var defaultConfig = new Config({
	push: true,
	pushInterval: 0,
	lag: 0,
	fullDataMode: false,
	maxStorage: 1000
});

function GameStream(config) {
	if (!(this instanceof GameStream)) {
		return new GameStream(config);
	}

	Duplex.call(this);

	this._stateFactory = new StateFactory();

	this._store = new StatesTimeStore();

	this._playback = new PlaybackControls(this._store);
	PlaybackControls.exposeInterface(this, this._playback);

	this._outputBuffer = new Buffer();

	this._emitter = new CustomWritable(this._emitGameUpdates.bind(this));

	this._stateFactory.pipe(this._store);
	this._stateFactory.pipe(this._playback);
	this._playback.pipe(this._outputBuffer);
	this._outputBuffer.pipe(this._emitter);

	config = new Config(defaultConfig, [config]);
	Config.apply(config, this);

	this._playback.setTime(now() - this.lag);
}

inherits(GameStream, Duplex);

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

Object.defineProperty(GameStream.prototype, 'maxStorage', {
	get: function() { return this._store.maxLength; },
	set: function(v) { this._store.maxLength = v; }
});

GameStream.prototype.write = function(outputStates) {
	return this._stateFactory.write(outputStates);
};

GameStream.prototype.updateAt = function(time, update) {
	this.write([{time: time, update: update}]);
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

GameStream.prototype.tick = function() {
	this._playback.tick();
	this._outputBuffer.flush();
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
			this.tick.bind(this),
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

GameStream.prototype._emitGameUpdates = function(gameUpdates) {
	if (gameUpdates.length) {
		this._pipes.out(gameUpdates);
	}
};

module.exports = GameStream;
