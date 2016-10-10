
var CANNON = require('cannon');

function PhysicsSystem() {
	var world = new CANNON.World();

	world.gravity.set(0, 0, -9.8);

	world.defaultMaterial = new CANNON.Material("defaultMaterial");
	world.defaultContactMaterial = new CANNON.ContactMaterial(
		world.defaultMaterial,
		world.defaultMaterial,
		{
			friction: 0.4,
			restitution: 0.3,
			contactEquationStiffness: 1e8,
			contactEquationRelaxation: 3,
			frictionEquationStiffness: 1e8,
			frictionEquationRegularizationTime: 3,
		}
	);

	this._cannon = world;
}

PhysicsSystem.prototype.tick = function(ms, entities) {
	Object.keys(entities).forEach(function(id) {
		var entity = entities[id];
		this._updateEntityPhysics(entity);
		this._updateEntityShape(entity);
		this._updateEntityPosition(entity);
		this._updateEntityVelocity(entity);
		this._updateEntityRotation(entity);
		this._updateEntityAngularVelocity(entity);
	}.bind(this));
	this._cannon.step(1/60, ms/1000, 30);
	Object.keys(entities).forEach(function(id) {
		var entity = entities[id];
		this._applyEntityPosition(entity);
		this._applyEntityVelocity(entity);
		this._applyEntityRotation(entity);
		this._applyEntityAngularVelocity(entity);
	}.bind(this));
};

PhysicsSystem.prototype._updateEntityPhysics = function(entity) {
	if (entity.physics) {
		if (entity.life.alive && entity.physics.alive) {
			if (!entity.physics._cannon) {

				var material = this._cannon.defaultContactMaterial;
				if (
					(entity.physics.friction || entity.physics.friction === 0) &&
					entity.physics.friction !== this._cannon.defaultContactMaterial.friction
				) {
					material = new CANNON.Material("entityMaterial");

					var contactMaterial = new CANNON.ContactMaterial(
						material, this._cannon.defaultContactMaterial,
						{
							friction: entity.physics.friction
						}
					);
					this._cannon.addContactMaterial(contactMaterial);
				}

				var type = entity.physics.static === true ? CANNON.Body.STATIC : CANNON.Body.DYNAMIC;
				var mass = entity.physics.mass || 1;
				if (type === CANNON.Body.STATIC) {
					mass = 0;
				}
				entity.physics._cannon = new CANNON.Body({
					mass: mass,
					type: type,
					material: material
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

PhysicsSystem.prototype._updateEntityVelocity = function(entity) {
	if (entity.physics && entity.physics.velocity && entity.physics._cannon) {
		entity.physics._cannon.velocity.set(
			entity.physics.velocity.x,
			entity.physics.velocity.y,
			entity.physics.velocity.z
		);
	}
};

PhysicsSystem.prototype._applyEntityVelocity = function(entity) {
	if (entity.physics && entity.physics._cannon) {
		entity.physics.velocity = {
			x: entity.physics._cannon.velocity.x,
			y: entity.physics._cannon.velocity.y,
			z: entity.physics._cannon.velocity.z
		};
	}
};

PhysicsSystem.prototype._updateEntityRotation = function(entity) {
	if (entity.physics && entity.physics._cannon) {
		entity.physics._cannon.quaternion.set(
			entity.physics.rotation.x,
			entity.physics.rotation.y,
			entity.physics.rotation.z,
			entity.physics.rotation.w
		);
	}
};

PhysicsSystem.prototype._applyEntityRotation = function(entity) {
	if (entity.physics && entity.physics._cannon) {
		entity.physics.rotation = {
			w: entity.physics._cannon.quaternion.w,
			x: entity.physics._cannon.quaternion.x,
			y: entity.physics._cannon.quaternion.y,
			z: entity.physics._cannon.quaternion.z
		};
	}
};

PhysicsSystem.prototype._updateEntityAngularVelocity = function(entity) {
	if (entity.physics && entity.physics.angularVelocity && entity.physics._cannon) {
		entity.physics._cannon.angularVelocity.set(
			entity.physics.angularVelocity.x,
			entity.physics.angularVelocity.y,
			entity.physics.angularVelocity.z
		);
	}
};

PhysicsSystem.prototype._applyEntityAngularVelocity = function(entity) {
	if (entity.physics && entity.physics._cannon) {
		entity.physics.angularVelocity = {
			x: entity.physics._cannon.angularVelocity.x,
			y: entity.physics._cannon.angularVelocity.y,
			z: entity.physics._cannon.angularVelocity.z
		};
	}
};



module.exports = PhysicsSystem;
