
var inherits = require('inherits');
var Config = require('./misc/Config.js');
var Duplex = require('./stream/Duplex.js');
var Readable = require('./stream/Readable.js');
var InputToStatePipe = require('./state/InputToStatePipe.js');
var StatesStore = require('./state/StatesStore.js');

var defaultConfig = new Config({
	info: {}
});

function GameStream(config) {
	Duplex.call(this);

	config = new Config(defaultConfig, [config]);

	this.info = config.info;

	this._input = new InputToStatePipe();
	this._output = new StatesStore();
	this._input.pipe(this._output);
}

inherits(GameStream, Duplex);

GameStream.prototype.updateNow = function(inputState) {
	this.updateAt(Date.now(), inputState);
};

GameStream.prototype.updateAt = function(time, inputState) {
	this.write([{ time: time, update: inputState }]);
};

GameStream.prototype.write = function(states) {
	if (this.debug) {
		debugger;
	}
	this._input.write(states);
	this.push(states);
};

module.exports = GameStream;
