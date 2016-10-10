
var PhysicsSystem = require('../physics/PhysicsSystem.js');
var ViewSystem = require('../view/ViewSystem.js');
var FloorEntity = require('../entities/FloorEntity.js');
var GameStream = require('../../GameStream.js');
var Entity = require('../ecs/Entity.js');
var GarbageCollectorSystem = require('../life/GarbageCollectorSystem.js');
var PlayerControlsSystem = require('../controls/PlayerControlsSystem.js');
var DemoGameStatsView = require('../view/DemoGameStatsView.js');
var PlayerEntity = require('../entities/PlayerEntity.js');

function DemoGame(name) {
	this.name = name || '';
	this.description = '';

	this.systems = {
		controls: new PlayerControlsSystem(),
		physics: new PhysicsSystem(),
		view: new ViewSystem()
	};

	this.garbageCollector = new GarbageCollectorSystem();

	this.entities = {
		floor: new FloorEntity()
	};

	this.stream = new GameStream({
		maxStorage: 200
	});

	this.statsView = new DemoGameStatsView(this);
}

DemoGame.prototype.createPlayer = function() {
	var player = new PlayerEntity();
	var count = 0;
	var name;

	do {
		count++;
		name = 'player' + count;
	} while(this.entities[name]);

	this.entities[name] = player;
	return name;
};

DemoGame.prototype.tick = function() {
	var time = this.stream.time;
	if (!this._lastTick) {
		this._lastTick = time;
	}
	var delta = time - this._lastTick;
	this._lastTick = time;
	if (delta !== 0) {
		this.eachSystem(function(system) {
			system.tick(delta, this.entities);
		}.bind(this));
		this.garbageCollector.tick(delta, this.entities);
	}
	this.statsView.update();
};

DemoGame.prototype.eachSystem = function(callback) {
	Object.keys(this.systems).forEach(function(id) {
		callback(this.systems[id]);
	}.bind(this));
};

DemoGame.prototype.toObject = function() {
	function toObject(obj) {
		var o = obj;
		if (obj instanceof Object) {
			o = {};
			Object.keys(obj).forEach(function(key) {
				if (key.indexOf('_') !== 0) {
					o[key] = toObject(obj[key]);
				}
			});
		}
		return o;
	}
	var obj = toObject(this.entities);
	return obj;
};

DemoGame.prototype.streamState = function() {
	function clearDead(update, garbageCollector) {
		var deadKeys = garbageCollector.flush();

		deadKeys.forEach(function(key) {
			update[key] = undefined;
		});

		return update;
	}

	var update = this.toObject();
	update = clearDead(update, this.garbageCollector);
	this.stream.updateNow(update);
};

DemoGame.prototype.streamPhysicsState = function() {
	var update = this.toObject();
	this.physicsStream.updateNow(update.player1.physics);
};

DemoGame.prototype.applyState = function(state) {
	function applyEntitiesState(update, entities) {
		if (update) {
			Object.keys(update).forEach(function(key) {
				if (update[key] === undefined) {
					if (entities[key]) {
						entities[key].life.alive = false;
					}
				} else {
					if (entities[key]) {
						Entity.apply(entities[key], update[key]);
					} else {
						entities[key] = new Entity(update[key]);
					}
				}
			});
		}
	}

	applyEntitiesState(state.update, this.entities);
};

module.exports = DemoGame;
