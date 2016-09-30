
var Demo = require('../shared/Demo.js');
var DemoGame = require('../shared/DemoGame.js');
var CubeEntity = require('../shared/entities/CubeEntity.js');
var GameStream = require('../GameStream.js');
var ConsoleLogger = require('../ConsoleLogger.js');

function DemoOne() {
	var demo = new Demo();

	var game1 = new DemoGame(true);
	demo.games.push(game1);

	var game2 = new DemoGame(false);
	demo.games.push(game2);
	game2.stream.setTime((+new Date()) - 500);
	game1.stream.pipe(game2.stream);

	var game3 = new DemoGame(false);
	demo.games.push(game3);
	game2.stream.pipe(game3.stream);

	var game4 = new DemoGame(false);
	demo.games.push(game4);
	game3.stream.pipe(game4.stream);
	game4.stream.setTime((+new Date()) - 5000);

	this._runGame(game1);

	return demo;
}

DemoOne.prototype._runGame = function(game) {

	function addCube() {
		addCube.count = addCube.count || 0;
		addCube.count++;
		var cubeName = 'cube' + addCube.count;
		var cube = new CubeEntity();
		game.entities[cubeName] = cube;

		setTimeout(addCube, 200);
		setTimeout(function() {removeCube(cube);}, 4100);
	}

	function removeCube(cube) {
		cube.life.alive = false;
	}

	addCube();

};

module.exports = DemoOne;
