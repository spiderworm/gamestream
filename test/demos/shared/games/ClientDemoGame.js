
var ReceiverDemoGame = require('./ReceiverDemoGame.js');
var GameStream = require('../../GameStream.js');

function ClientDemoGame(name) {
	var game = new ReceiverDemoGame(name);
	ClientDemoGame.apply(game);
	return game;
}

ClientDemoGame.apply = function(game) {
	game.stream.on('pipe', function(upstream) {
		game.stream.requestDelegateFrom(upstream);
	});
}

module.exports = ClientDemoGame;
