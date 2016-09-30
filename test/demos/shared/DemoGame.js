
var DemoThrees = require('../shared/view/DemoThrees.js');
var PhysicsSystem = require('./physics/PhysicsSystem.js');
var ViewSystem = require('./view/ViewSystem.js');
var FloorEntity = require('./entities/FloorEntity.js');
var GameStream = require('../GameStream.js');
var Entity = require('./ecs/Entity.js');
var GarbageCollectorSystem = require('./life/GarbageCollectorSystem.js');
var DemoGameStatsView = require('./view/DemoGameStatsView.js');

function DemoGame(isHost, name) {
	this.isHost = !!isHost;

	this.name = name || '';
	this.description = '';

	this.systems = {
		physics: new PhysicsSystem(),
		view: new ViewSystem()
	};

	this.garbageCollector = new GarbageCollectorSystem();

	this.entities = {
		floor: new FloorEntity()
	};

	this.threes = new DemoThrees();

	this.stream = new GameStream();

	this.statsView = new DemoGameStatsView(this);

	if (!this.isHost) {
		this.stream.on('data', this.applyState.bind(this));
	}
}

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
		if (this.isHost) {
			this.streamState();
		}
		this.garbageCollector.tick(delta, this.entities);
	}
	this.statsView.update();
};

DemoGame.prototype.eachSystem = function(callback) {
	Object.keys(this.systems).forEach(function(id) {
		callback(this.systems[id]);
	}.bind(this));
};

DemoGame.prototype.streamState = function() {
	function getState(obj) {
		var o = obj;
		if (obj instanceof Object) {
			o = {};
			Object.keys(obj).forEach(function(key) {
				if (key.indexOf('_') !== 0) {
					o[key] = getState(obj[key]);
				}
			});
		}
		return o;
	}

	function clearDead(update, garbageCollector) {
		var deadKeys = garbageCollector.flush();

		deadKeys.forEach(function(key) {
			update[key] = undefined;
		});

		return update;
	}

	var update = getState(this.entities);
	update = clearDead(update, this.garbageCollector);
	this.stream.updateNow(update);
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
