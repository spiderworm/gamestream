
var DemoGame = require('./DemoGame.js');
var GameStream = require('../GameStream.js');
var DemoDomNodes = require('./view/DemoDomNodes.js');
var DemoThrees = require('./view/DemoThrees.js');
var ConsoleLogger = require('../ConsoleLogger.js');

function Demo() {
	this.games = [];
	this.nodes = new DemoDomNodes();
	this.threes = new DemoThrees(this.nodes.canvas);

	var tick = (function() { requestAnimationFrame(tick); this.tick(); }).bind(this);
	//var tick = (function() { setInterval(this.tick.bind(this), 500); }).bind(this);

	tick();
}

Demo.prototype.tick = function() {
	this.games.forEach(function(game) {
		game.tick();
	}.bind(this));
	this.render();	
};

Demo.prototype.render = function() {
	this.threes.renderer.clear();
	this.nodes.overlay.clear();
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
		if (game.systems.view) {
			var gameThrees = game.systems.view.threes;
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
			gameThrees.camera.aspect = aspect;
			gameThrees.camera.updateProjectionMatrix();
			this.threes.renderer.render(gameThrees.scene, gameThrees.camera);

			this.nodes.overlay.appendChild(game.statsView.node);
			game.statsView.node.display(
				(col - 1) * width,
				(row - 1) * height,
				width,
				height
			);
		}
	}.bind(this));
};

module.exports = Demo;
