
var inherits = require("inherits");
var ComboPipe = require("../stream/ComboPipe.js");
var Duplex = require("../stream/Duplex.js");
var GameStream = require("../GameStream.js");
var Config = require("../misc/Config.js");
var MappingTransform = require("../mapping/MappingTransform.js");
var Writable = require("../stream/Writable.js");

var defaultConfig = new Config({
	map: null,
	playerID: null,
	info: {},
	output: null
});

function InputStream(config) {
	var config = new Config(defaultConfig, [config]);

	var pipes = [];

	var gameStream = new GameStream({
		info: config.info
	});
	pipes.push(gameStream);

	var map;

	if (config.map) {
		map = config.map;
	} else if (config.playerID) {
		map = {
			input: {}
		};
		map.input[playerID] = true;
	}

	if (map) {
		var mapper = new MappingTransform(map);
		pipes.push(mapper);
	}

	if (config.output) {
		var output = Duplex.create(config.output);
		pipes.push(output);
	}

	ComboPipe.call(this, pipes);

	this._config = config;
	this._gameStream = gameStream;
}

inherits(InputStream, ComboPipe);

InputStream.prototype.updateAt = function(state) {
	this._gameStream.updateAt(state);
};

InputStream.prototype.updateNow = function(state) {
	this._gameStream.updateNow(state);
};

module.exports = InputStream;
