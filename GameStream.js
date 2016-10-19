
var GameStreamDuplex = require('./stream/GameStreamDuplex.js');
var inherits = require('inherits');
var now = require('./misc/now.js');
var PlaybackPointer = require('./playback/PlaybackPointer.js');
var PlaybackControls = require('./playback/PlaybackControls.js');
var Mapper = require('./Mapper.js');
var DelegateResolver = require('./DelegateResolver.js');
var statesUtil = require('./states/statesUtil.js');
var CustomWritable = require('./stream/CustomWritable.js');
var Config = require('./misc/Config.js');
var StateFactory = require('./states/factories/StateFactory.js');
var StatesTimeStore = require('./storage/StatesTimeStore.js');
var Buffer = require('./storage/Buffer.js');
var ConsoleLogger = require('./debug/ConsoleLogger.js');
var objectFactory = require('./misc/objectFactory.js');

var defaultConfig = new Config({
	push: true,
	pushInterval: 0,
	lag: 0,
	fullDataMode: false,
	maxStorage: 1000,
	map: null,
	info: {}
});

function GameStream(config) {
	if (!(this instanceof GameStream)) {
		return new GameStream(config);
	}

	GameStreamDuplex.call(this);

	this._stateFactory = new StateFactory();

	this._store = new StatesTimeStore();

	var playbackPointer = new PlaybackPointer(this._store);
	this._playback = new PlaybackControls(playbackPointer);
	PlaybackControls.exposeInterface(this, this._playback);

	config = new Config(defaultConfig, [config]);

	this._mapper = new Mapper(config.map);

	this._delegates = new DelegateResolver();

	this._outputBuffer = new Buffer();

	this._emitter = new CustomWritable(this._emitGameUpdates.bind(this));

	this._stateFactory.pipe(this._mapper);
	this._mapper.pipe(this._delegates);
	this._delegates.pipe(this._store);
	this._delegates.pipe(this._playback);

	this._playback.pipe(this._outputBuffer);
	this._outputBuffer.pipe(this._emitter);

	Config.apply(config, this);

	this._playback.setTime(now() - this.lag);
}

inherits(GameStream, GameStreamDuplex);

GameStream.events = {
	DELEGATE_REQUESTED: 'delegate-requested',
	DELEGATE_ADDED: 'delegate-added',
	DELEGATE_REMOVED: 'delegate-removed',
	DELEGATE_HOSTED: 'delegate-hosted',
	DELEGATE_UNHOSTED: 'delegate-unhosted'
};

GameStream.isGameStream = function(obj) {
	return true && obj.write;
};

Object.defineProperty(GameStream.prototype, 'map', {
	get: function() {
		return objectFactory.clone(this._mapper.map);
	}
});

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

GameStream.prototype.write = function(inputStates) {
	return this._stateFactory.write(inputStates);
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

GameStream.prototype.requestDelegateFrom = function(targetStream) {
	targetStream.emit(GameStream.events.DELEGATE_REQUESTED, this);
};

GameStream.prototype.delegate = function(delegateStream, hostStream) {
	if (!GameStream.isGameStream(delegateStream)) {
		var config = delegateStream;
		delegateStream = new GameStream(config);
	}
	this._delegates.addDelegate(delegateStream);
	this.emit(GameStream.events.DELEGATE_ADDED, delegateStream);
	if (hostStream) {
		hostStream.hostDelegate(delegateStream);
	}
	return delegateStream;
};

GameStream.prototype.undelegate = function(delegateStream, hostStream) {
	if (hostStream) {
		hostStream.unhostDelegate(delegateStream);
	}
	this._delegates.removeDelegate(delegateStream, hostStream);
	this.emit(GameStream.events.DELEGATE_REMOVED, delegateStream);
};

GameStream.prototype.hostDelegate = function(delegateStream) {
	this._delegates.hostDelegate(delegateStream);
	this.emit(GameStream.events.DELEGATE_HOSTED, delegateStream);
};

GameStream.prototype.unhostDelegate = function(delegateStream) {
	this._delegates.unhostDelegate(delegateStream);
	this.emit(GameStream.events.DELEGATE_UNHOSTED, delegateStream);
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
