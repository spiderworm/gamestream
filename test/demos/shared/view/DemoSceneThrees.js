
var THREE = require('three');

function DemoSceneThrees() {
	this.scene = new THREE.Scene();

	this.camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		1,
		10000
	);
	this.camera.position.set(0,8,3);
	this.camera.up.set(0,0,1);
	this.camera.lookAt(new THREE.Vector3(0,0,3));
	this.scene.add(this.camera);
}

module.exports = DemoSceneThrees;
