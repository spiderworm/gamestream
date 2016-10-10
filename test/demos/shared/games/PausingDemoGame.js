
var DemoGame = require('./DemoGame.js');

function PausingDemoGame(name) {
	var game = new DemoGame(name || 'Pausing + Fast-Forwarding Game');
	DemoPausingGame.apply(game);
	return game;
}

PausingDemoGame.apply = function(game) {
	game.description = 'This game receives its state from an upstream game, but it pauses and fast-forwards from time to time. Keep an eye on the speed.';

	function play() {
		game.stream.play();
		setTimeout(pause, 5000);
	}

	function pause() {
		game.stream.pause();
		setTimeout(fastForward, 5000);
	}

	function fastForward() {
		game.stream.fastForward(2);
		setTimeout(play, 4999);
	}

	play();
}

module.exports = PausingDemoGame;
