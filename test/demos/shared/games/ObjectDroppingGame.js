
var DemoGame = require('./DemoGame.js');
var CubeEntity = require('../entities/CubeEntity.js');
var SphereEntity = require('../entities/SphereEntity.js');

function ObjectDroppingGame(name) {
	var game = new DemoGame(name || 'Object Dropping Game');
	ObjectDroppingGame.apply(game);
	return game;
}

ObjectDroppingGame.apply = function(game) {
	game.description = 'This is a game where objects are dropped from the sky.';

	function addCube() {
		var entity = addEntity(
			getNextEntityId('cube'),
			new CubeEntity()
		);
		randomizeLocation(entity);
		randomizeColor(entity);
		setTimeout(addSphere, 500);
	}

	function addSphere() {
		var entity = addEntity(
			getNextEntityId('sphere'),
			new SphereEntity()
		);
		randomizeLocation(entity);
		randomizeColor(entity);
		setTimeout(addCube, 500);
	}

	function addEntity(name, entity) {
		game.entities[name] = entity;
		setTimeout(function() {removeEntity(entity);}, 3000);
		return entity;
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

	function randomizeLocation(entity) {
		entity.physics.position = {
			x: -1 + (2 * Math.random()),
			y: -1 + (2 * Math.random()),
			z: 8 + (1 * Math.random())
		};
	}

	var colors = [
		0xff0000,
		0x66ff66,
		0x0000ff
	];

	function randomizeColor(entity) {
		entity.view.color = colors[Math.floor(colors.length * Math.random())];
	}

	setTimeout(addCube, 500);
}

module.exports = ObjectDroppingGame;

