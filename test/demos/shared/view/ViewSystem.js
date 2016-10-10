
var THREE = require('three');
var DemoSceneThrees = require('./DemoSceneThrees.js');

function ViewSystem() {
	this._threes = new DemoSceneThrees();
}

ViewSystem.prototype.tick = function(ms, entities) {
	Object.keys(entities).forEach(function(id) {
		var entity = entities[id];
		this._updateEntityView(entity);
		this._updateEntityShape(entity);
		this._updateEntityPosition(entity);
		this._updateEntityRotation(entity);
	}.bind(this));
};

ViewSystem.prototype.getThrees = function() {
	return this._threes;
};

ViewSystem.prototype.getEntityThree = function(entity) {
	var three = undefined;
	if (entity && entity.view && entity.view._three) {
		three = entity.view._three;
	}
	return three;
};

ViewSystem.prototype._updateEntityView = function(entity) {
	if (entity.view) {
		if (
			entity.life.alive &&
			entity.view.alive &&
			entity.physics &&
			entity.physics.alive
		) {
			if (!entity.view._three) {
				entity.view._three = new THREE.Object3D();
				this._threes.scene.add(entity.view._three);
			}
		} else {
			if (entity.view._three) {
				this._threes.scene.remove(entity.view._three);
				delete entity.view._three;
			}
		}
	}
};

ViewSystem.prototype._updateEntityShape = function(entity) {
	if (entity.view && entity.view._three && entity.shapes) {
		Object.keys(entity.shapes).forEach(function(id) {
			if (id === 'alive') {
				return;
			}
			var shape = entity.shapes[id];

			if (!shape._three) {
				var geometry;
				var material = new THREE.MeshPhongMaterial({
					color: entity.view.color,
					wireframe: false
				});

				switch (shape.type) {
					case 'sphere':
						geometry = new THREE.SphereGeometry(
							shape.size / 2,
							15,
							15
						);
					break;
					case 'cube':
						geometry = new THREE.BoxGeometry(
							shape.size.x,
							shape.size.y,
							shape.size.z
						);
					break;
				}

				if (geometry) {
					shape._three = new THREE.Mesh(geometry, material);
					shape._three.castShadow = true;
					shape._three.receiveShadow = true;
					entity.view._three.add(shape._three);
				}
			}

		});
	}
};

ViewSystem.prototype._updateEntityPosition = function(entity) {
	if (entity.view && entity.view._three) {
		entity.view._three.position.set(
			entity.physics.position.x,
			entity.physics.position.y,
			entity.physics.position.z
		);
	}
};

ViewSystem.prototype._updateEntityRotation = function(entity) {
	if (entity.view && entity.view._three) {
		entity.view._three.quaternion.set(
			entity.physics.rotation.x,
			entity.physics.rotation.y,
			entity.physics.rotation.z,
			entity.physics.rotation.w
		);
	}
};

module.exports = ViewSystem;
