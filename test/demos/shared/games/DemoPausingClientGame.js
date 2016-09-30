
var DemoClientGame = require('./DemoClientGame.js');

function DemoPausingClientGame(name) {
	var game = new DemoClientGame(name || 'Pausing/FastForwarding Game');
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

	return game;
}

module.exports = DemoPausingClientGame;
