
var Entity = require('../ecs/Entity.js');

function CubeEntity() {
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
			color: 0x00ff00
		},
		shapes: [
			{
				type: 'cube',
				size: {
					x: 1,
					y: 1,
					z: 1
				},
				position: {
					x: 0,
					y: 0,
					z: 0
				}
			}
		]
	});
}

module.exports = CubeEntity;
