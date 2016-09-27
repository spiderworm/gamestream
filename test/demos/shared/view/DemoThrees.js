
var THREE = require('three');

function DemoThrees(canvas) {
	this.renderer = new THREE.WebGLRenderer({canvas: canvas});
	this.renderer.setClearColor(0xffffff, 1);
	this.renderer.autoClear = false;
}

module.exports = DemoThrees;
