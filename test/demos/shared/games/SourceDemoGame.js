
var DemoGame = require('./DemoGame.js');

function SourceDemoGame(name) {
	var game = new DemoGame(name);
	SourceDemoGame.apply(game);
	return game;
}

SourceDemoGame.apply = function(game) {
	setInterval(function() {
		game.streamState();
	}, 50);

	return game;
}

module.exports = SourceDemoGame;
