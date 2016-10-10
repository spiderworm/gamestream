
var DemoGame = require('./DemoGame.js');
var GameStream = require('../../GameStream.js');

function ReceiverDemoGame(name) {
	var game = new DemoGame(name);
	ReceiverDemoGame.apply(game);
	return game;
}

ReceiverDemoGame.apply = function(game) {
	game.stream.on('data', game.applyState.bind(game));
}

module.exports = ReceiverDemoGame;
