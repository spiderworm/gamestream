
var DemoGame = require('../DemoGame.js');

function DemoClientGame(name) {
	var game = new DemoGame(false, name || 'Client Game');
	game.description = 'This game receives state from an upstream game.';
	return game;
}

module.exports = DemoClientGame;
