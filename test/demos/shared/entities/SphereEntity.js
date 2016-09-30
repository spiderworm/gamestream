
var Entity = require('../ecs/Entity.js');

function SphereEntity() {
	return new Entity({
		physics: {
			position: {
				x: 0,
				y: 0,
				z: 4
			},
			rotation: {
				w: 1,
				x: 0,
				y: 0,
				z: 0
			}
		},
		view: {
			color: 0x00ffcc
		},
		shapes: [
			{
				type: 'sphere',
				size: 1,
				position: {
					x: 0,
					y: 0,
					z: 0
				}
			}
		]
	});
}

module.exports = SphereEntity;
