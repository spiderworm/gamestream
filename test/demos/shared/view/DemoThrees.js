
var THREE = require('three');

function DemoThrees(canvas) {
	this.scenes = [];

	this.renderer = new THREE.WebGLRenderer({canvas: canvas});
	this.renderer.setClearColor(0xffffff, 1);
	this.renderer.autoClear = false;

	var tick = (function() {
		requestAnimationFrame(tick);
		this.tick();
	}).bind(this);

	tick();
}

DemoThrees.prototype.tick = function() {
	this.renderer.clear();
	if (this.scenes.length === 0) {
		return;
	}
	var colCount = Math.ceil(Math.sqrt(this.scenes.length));
	var rowCount = Math.ceil(this.scenes.length / colCount);
	var totalWidth = window.innerWidth;
	var totalHeight = window.innerHeight;
	var width = totalWidth / colCount;
	var height = totalHeight / rowCount;
	var aspect = width / height;
	var col = colCount;
	var row = 0;
	this.renderer.setSize(totalWidth, totalHeight);
	this.scenes.forEach(function(sceneThrees, i) {
		col++;
		if (col > colCount) {
			col = 1;
			row++;
		}
		this.renderer.clearDepth();
		this.renderer.setViewport(
			(col - 1) * width,
			totalHeight - (row * height),
			width,
			height
		);
		sceneThrees.camera.aspect = aspect;
		sceneThrees.camera.updateProjectionMatrix();
		this.renderer.render(sceneThrees.scene, sceneThrees.camera);
	}.bind(this));
};

module.exports = DemoThrees;
