
var Entity = require('../ecs/Entity.js');

function PlayerEntity() {
	return new Entity({
		physics: {
			position: {
				x: -4 + (8 * Math.random()),
				y: -4 + (8 * Math.random()),
				z: .5
			},
			rotation: {
				w: 1,
				x: 0,
				y: 0,
				z: 0
			},
			friction: 0
		},
		view: {
			color: 0xff00cc
		},
		shapes: [
			{
				type: 'cube',
				size: {
					x: .5,
					y: .5,
					z: .5
				},
				position: {
					x: 0,
					y: 0,
					z: 0
				}
			}
		],
		controls: {
			forward: 0,
			jump: false,
			turn: 0
		}
	});
}

module.exports = PlayerEntity;
