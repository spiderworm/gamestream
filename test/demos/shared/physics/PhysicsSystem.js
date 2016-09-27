
var CANNON = require('cannon');

function PhysicsSystem() {
	this._cannon = new CANNON.World();
	this._cannon.gravity.set(0, 0, -5);
}

PhysicsSystem.prototype.tick = function(ms, entities) {
	Object.keys(entities).forEach(function(id) {
		var entity = entities[id];
		this._updateEntityPhysics(entity);
		this._updateEntityShape(entity);
		this._updateEntityPosition(entity);
	}.bind(this));
	this._cannon.step(1/60, ms/1000, 30);
	Object.keys(entities).forEach(function(id) {
		var entity = entities[id];
		this._applyEntityPosition(entity);
	}.bind(this));
};

PhysicsSystem.prototype._updateEntityPhysics = function(entity) {
	if (entity.physics) {
		if (entity.life.alive && entity.physics.alive) {
			if (!entity.physics._cannon) {
				var type = entity.physics.static === true ? CANNON.Body.STATIC : CANNON.Body.DYNAMIC;
				var mass = entity.physics.mass || 1;
				if (type === CANNON.Body.STATIC) {
					mass = 0;
				}
				entity.physics._cannon = new CANNON.Body({
					mass: mass,
					type: type
				});
				entity.physics._cannon.position.set(
					entity.physics.position.x,
					entity.physics.position.y,
					entity.physics.position.z
				);
				this._cannon.addBody(entity.physics._cannon);
			}
		} else {
			if (entity.physics._cannon) {
				this._cannon.removeBody(entity.physics._cannon);
				delete entity.physics._cannon;
			}
		}
	}
};

PhysicsSystem.prototype._updateEntityShape = function(entity) {
	if (entity.physics && entity.physics._cannon && entity.shapes) {

		Object.keys(entity.shapes).forEach(function(id) {
			var shape = entity.shapes[id];

			if (!shape._cannon) {
				var cannonShape;

				switch (shape.type) {
					case 'sphere':
						cannonShape = new CANNON.Sphere(shape.size / 2);
					break;
					case 'cube':
						cannonShape = new CANNON.Box(
							new CANNON.Vec3(
								shape.size.x / 2,
								shape.size.y / 2,
								shape.size.z / 2
							)
						);
					break;
				}

				if (cannonShape) {
					shape._cannon = cannonShape;
					entity.physics._cannon.addShape(
						cannonShape,
						new CANNON.Vec3(
							shape.position.x,
							shape.position.y,
							shape.position.z
						)
					);
				}

			}

		});

	}
};

PhysicsSystem.prototype._updateEntityPosition = function(entity) {
	if (entity.physics && entity.physics._cannon) {
		entity.physics._cannon.position.set(
			entity.physics.position.x,
			entity.physics.position.y,
			entity.physics.position.z
		);
	}
};

PhysicsSystem.prototype._applyEntityPosition = function(entity) {
	if (entity.physics && entity.physics._cannon) {
		entity.physics.position = {
			x: entity.physics._cannon.position.x,
			y: entity.physics._cannon.position.y,
			z: entity.physics._cannon.position.z
		};
	}
};

module.exports = PhysicsSystem;
