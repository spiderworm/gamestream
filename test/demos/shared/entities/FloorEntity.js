
var Entity = require('../ecs/Entity.js');

function FloorEntity() {
	return new Entity({
		physics: {
			position: {
				x: 0,
				y: 0,
				z: 0
			},
			static: true
		},
		shapes: [
			{
				type: 'cube',
				size: {
					x: 10,
					y: 10,
					z: .1
				},
				position: {
					x: 0,
					y: 0,
					z: 0
				}
			}
		],
		view: {
			color: 0xff0000
		}
	});
}

module.exports = FloorEntity;
