
var THREE = require('three');

function DemoThrees(canvas) {
	this.renderer = new THREE.WebGLRenderer({
		canvas: canvas,
		antialias: true
	});
	this.renderer.setClearColor(0xffffff, 1);
	this.renderer.autoClear = false;
	this.renderer.shadowMap.enabled = true;
	this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
}

module.exports = DemoThrees;
