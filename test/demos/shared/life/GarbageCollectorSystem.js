
function GarbageCollectorSystem() {
	this._keys = [];
}

GarbageCollectorSystem.prototype.tick = function(ms, entities) {
	Object.keys(entities).forEach(function(key) {
		var entity = entities[key];
		if (!entity.life || !entity.life.alive) {
			delete entities[key];
			this._keys.push(key);
		}
	}.bind(this));
};

GarbageCollectorSystem.prototype.flush = function() {
	var keys = this._keys;
	this._keys = [];
	return keys;
};

module.exports = GarbageCollectorSystem;
