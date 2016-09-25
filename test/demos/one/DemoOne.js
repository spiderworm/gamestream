
var DemoGame = require('../shared/DemoGame.js');
var CubeEntity = require('../shared/entities/CubeEntity.js');
var GameStream = require('../GameStream.js');
var DemoCanvas = require('../shared/view/DemoCanvas.js');
var DemoThrees = require('../shared/view/DemoThrees.js');

function DemoOne() {
	this.games = [];

	var canvas = new DemoCanvas();

	this.threes = new DemoThrees(canvas);

	var cube1 = new CubeEntity();

	var game = new DemoGame();
	game.entities['cube1'] = cube1;
	//game.systems.view.threes.camera.position.set(10,0,.25);
	//game.systems.view.threes.camera.lookAt({x: 0, y: 0, z: 0});

	this.games.push(game);

	var tick = (function() {
		requestAnimationFrame(tick);
		this.tick();
	}).bind(this);
	tick();
}

DemoOne.prototype.tick = function() {
	this.games.forEach(function(game) {
		game.tick();
	}.bind(this));
	this.render();	
};

DemoOne.prototype.render = function() {
	this.threes.renderer.clear();
	if (this.games.length === 0) {
		return;
	}
	var colCount = Math.ceil(Math.sqrt(this.games.length));
	var rowCount = Math.ceil(this.games.length / colCount);
	var totalWidth = window.innerWidth;
	var totalHeight = window.innerHeight;
	var width = totalWidth / colCount;
	var height = totalHeight / rowCount;
	var aspect = width / height;
	var col = colCount;
	var row = 0;
	this.threes.renderer.setSize(totalWidth, totalHeight);
	this.games.forEach(function(game, i) {
		var sceneThrees = game.systems.view.threes;
		col++;
		if (col > colCount) {
			col = 1;
			row++;
		}
		this.threes.renderer.clearDepth();
		this.threes.renderer.setViewport(
			(col - 1) * width,
			totalHeight - (row * height),
			width,
			height
		);
		sceneThrees.camera.aspect = aspect;
		sceneThrees.camera.updateProjectionMatrix();
		this.threes.renderer.render(sceneThrees.scene, sceneThrees.camera);
	}.bind(this));
};

module.exports = DemoOne;
