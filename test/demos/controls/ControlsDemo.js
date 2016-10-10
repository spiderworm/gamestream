
var Demo = require('../shared/Demo.js');
var DemoGame = require('../shared/games/DemoGame.js');
var SourceDemoGame = require('../shared/games/SourceDemoGame.js');
var ObjectDroppingGame = require('../shared/games/ObjectDroppingGame.js');
var PausingDemoGame = require('../shared/games/PausingDemoGame.js');
var ReceiverDemoGame = require('../shared/games/ReceiverDemoGame.js');

function ControlsDemo() {
	var demo = new Demo();

	var game1 = new SourceDemoGame('Host Game');
	ObjectDroppingGame.apply(game1);
	demo.games.push(game1);

	var game2 = new ReceiverDemoGame('Game 2');
	PausingDemoGame.apply(game2);
	demo.games.push(game2);
	game1.stream.pipe(game2.stream);

	var game3 = new ReceiverDemoGame('Game 3');
	game3.description = 'This game has its state piped from the upstream ' + game2.name + '. Notice that when the upstream game pauses, this game stops receiving state updates. However, because it\'s running its own physics, things still appear to move. Once the upstream game unpauses, this game catches up to its upstream.';
	demo.games.push(game3);
	game2.stream.pipe(game3.stream);

	var game4 = new ReceiverDemoGame('Game 4');
	var lag = 1000;
	game4.stream.setTime((+new Date()) - lag);
	game4.description = 'This game has its state piped from ' + game3.name + ', but lags ' + (lag / 1000) + ' second(s) behind.';
	demo.games.push(game4);
	game3.stream.pipe(game4.stream);

	return demo;
}

module.exports = ControlsDemo;
