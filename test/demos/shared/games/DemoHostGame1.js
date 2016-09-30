
var DemoGame = require('../DemoGame.js');
var CubeEntity = require('../entities/CubeEntity.js');
var SphereEntity = require('../entities/SphereEntity.js');

function DemoHostGame1(name) {
	var game = new DemoGame(true, name || 'Host Game');
	game.description = 'This is a game that generates the actual gameplay. This might represent for example a game running on a server. It has the controlling game logic, and its state is usually streamed to downstream games.';

	function addCube() {
		addEntity(
			getNextEntityId('cube'),
			new CubeEntity()
		);
		setTimeout(addSphere, 500);
	}

	function addSphere() {
		addEntity(
			getNextEntityId('sphere'),
			new SphereEntity()
		);
		setTimeout(addCube, 500);
	}

	function addEntity(name, entity) {
		game.entities[name] = entity;
		setTimeout(function() {removeEntity(entity);}, 4100);
	}

	function removeEntity(cube) {
		cube.life.alive = false;
	}

	function getNextEntityId(base) {
		var count = getNextEntityId.count || 0;
		count++;
		getNextEntityId.count = count;
		return base + count;
	}

	setTimeout(addCube, 500);

	return game;
}

module.exports = DemoHostGame1;

