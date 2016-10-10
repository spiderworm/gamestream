
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

	var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
	this.scene.add(light);
	this.light1 = light;

	var spotlight = new Spotlight();
	spotlight.position.set(20, 20, 40);
	spotlight.lookAt({x: 1, y: 1, z: 0});
	this.scene.add(spotlight);
	this.light2 = spotlight;

}

function Spotlight() {
	var spotlight = new THREE.SpotLight(0xffffff);
	spotlight.position.set(0, 0, 40);
	spotlight.angle = .25;
	spotlight.penumbra = .8;
	spotlight.lookAt({x: 0, y: 0, z: 0});
	spotlight.castShadow = true;
	spotlight.shadow.radius = 1;
	spotlight.shadow.mapSize.set(1024, 1024);
	return spotlight;
}

module.exports = DemoSceneThrees;
