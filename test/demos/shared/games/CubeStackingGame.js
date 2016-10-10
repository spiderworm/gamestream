
var DemoGame = require('./DemoGame.js');
var CubeEntity = require('../entities/CubeEntity.js');

function CubeStackingGame(name) {
	var game = new DemoGame(name || 'Cube Spawning Game');
	CubeStackingGame.apply(game);
	return game;
}

CubeStackingGame.apply = function(game) {
	game.description = 'In this game, cubes spawn into a stack.';

	function addCube() {
		addCube.count = addCube.count || 0;
		addCube.count++;
		var cubeName = 'cube' + addCube.count;
		var cube = new CubeEntity();
		cube.view.color = 0x333333;
		game.entities[cubeName] = cube;

		setTimeout(addCube, 200);
		setTimeout(function() {removeCube(cube);}, 2000);
	}

	function removeCube(cube) {
		cube.life.alive = false;
	}

	addCube();
}

module.exports = CubeStackingGame;

