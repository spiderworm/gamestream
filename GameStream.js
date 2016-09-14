
var Stream = require('stream');
var inherits = require('inherits');
var deepAssign = require('deep-assign');
var now = require('./now.js');
var GameState = require('./GameState.js');
var GameStatesBag = require('./GameStatesBag.js');
var addPipeBagTo = require('./addPipeBagTo.js');
var Playback = require('./Playback.js');
var TimedUpdate = require('./TimedUpdate.js');

function GameStream(opts) {
	if (!(this instanceof GameStream)) return new GameStream(opts);
	opts = opts || {};

	this.pushInterval = opts.pushInterval || 0;
	this.lag = opts.lag || 0;

	this._states = new GameStatesBag();
	this._playback = new Playback(this._states);
	this._playback.setTime(now() - this.lag);
	Playback.exposeInterface(this, this._playback);

	addPipeBagTo(this);

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

GameStream.prototype.write = function(gameStates) {
	gameStates.forEach(function(gameState) {
		this.updateAt(gameState.time, gameState.update);
	}.bind(this));
	return true;
};

GameStream.prototype.updateAt = function(time, update) {
	var state = new GameState(time, update);
	this._states.insertLate(state);
};

GameStream.prototype.updateNow = function(update) {
	var time = now();
	this.updateAt(time, update);
};

GameStream.prototype._pushUpdates = function() {
	this._playback.bufferUpdates();
	var updates = this._playback.flushUpdates();
	this._emitGameUpdates(updates);
};

GameStream.prototype._emitGameUpdates = function(gameUpdates) {
	if (gameUpdates.length) {
		var squashed = TimedUpdate.squash(gameUpdates);
		this.emit('update', squashed.update);
		this.emit('data',gameUpdates);
		this.eachPipe(function(writable) {
			writable.write(gameUpdates);
		});
	}
};

module.exports = GameStream;
