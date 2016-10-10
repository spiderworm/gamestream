
var Demo = require('../shared/Demo.js');
var SourceDemoGame = require('../shared/games/SourceDemoGame.js');
var ReceiverDemoGame = require('../shared/games/ReceiverDemoGame.js');
var CubeStackingGame = require('../shared/games/CubeStackingGame.js');
var CubeEntity = require('../shared/entities/CubeEntity.js');
var GameStream = require('../GameStream.js');

function DemoOne() {
	var demo = new Demo();

	var game1 = new SourceDemoGame('source');
	CubeStackingGame.apply(game1);
	demo.games.push(game1);

	var game2 = new ReceiverDemoGame('downstream 1');
	demo.games.push(game2);
	game2.stream.setTime((+new Date()) - 500);
	game1.stream.pipe(game2.stream);

	var game3 = new ReceiverDemoGame('downstream 2');
	demo.games.push(game3);
	game2.stream.pipe(game3.stream);

	var game4 = new ReceiverDemoGame('downstream 3');
	demo.games.push(game4);
	game3.stream.pipe(game4.stream);
	game4.stream.setTime((+new Date()) - 2000);

	return demo;
}

module.exports = DemoOne;
