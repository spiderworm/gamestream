
function PlayerControlsSystem() {}

PlayerControlsSystem.prototype.tick = function(ms, entities) {
	Object.keys(entities).forEach(function(id) {
		var entity = entities[id];
		if (entity.controls && entity.controls.alive && entity.life && entity.life.alive) {
			this._tickEntity(ms, entity);
		}
	}.bind(this));
};

PlayerControlsSystem.prototype._tickEntity = function(ms, entity) {
	if (entity.physics) {
		if (entity.physics.velocity) {
			entity.controls.forward = entity.controls.forward || 0;
			entity.physics.velocity.x += entity.controls.forward * ms * .01;
			if (entity.controls.jump) {
				entity.physics.velocity.z = 2;
			}
		}
		if (entity.physics.angularVelocity) {
			entity.controls.turn = entity.controls.turn || 0;
			entity.physics.angularVelocity.z = entity.controls.turn * 10;
		}
		if (entity.physics.rotation) {
			entity.physics.rotation.x = 0;
			entity.physics.rotation.y = 0;
		}
	}
};

module.exports = PlayerControlsSystem;
