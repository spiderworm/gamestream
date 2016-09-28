
var DemoThrees = require('../shared/view/DemoThrees.js');
var PhysicsSystem = require('./physics/PhysicsSystem.js');
var ViewSystem = require('./view/ViewSystem.js');
var now = require('../../../misc/now.js');
var FloorEntity = require('./entities/FloorEntity.js');
var GameStream = require('../GameStream.js');
var Entity = require('./ecs/Entity.js');

function DemoGame(isHost) {
	this.isHost = !!isHost;

	this.systems = {
		physics: new PhysicsSystem(),
		view: new ViewSystem()
	};

	this.entities = {
		floor: new FloorEntity()
	};

	this.threes = new DemoThrees();

	this.stream = new GameStream();

	if (!this.isHost) {
		this.stream.on('data', this.applyState.bind(this));
	}
}

DemoGame.prototype.tick = function() {
	var time = now();
	if (!this._lastTick) {
		this._lastTick = time;
	}
	var delta = time - this._lastTick;
	this._lastTick = time;
	this.eachSystem(function(system) {
		system.tick(delta, this.entities);
	}.bind(this));
	if (this.isHost) {
		this.streamState();
	}
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
	var update = getState(this.entities);
	this.stream.updateNow(update);
};

DemoGame.prototype.applyState = function(state) {
	function applyEntitiesState(state, entities) {
		Object.keys(state).forEach(function(key) {
			if (state[key] === undefined) {
				if (entities[key]) {
					entities[key].life.alive = false;
				}
			} else {
				if (entities[key]) {
					Entity.apply(entities[key], state[key]);
				} else {
					entities[key] = new Entity(state[key]);
				}
			}
		});
	}

	applyEntitiesState(state.update, this.entities);
};

module.exports = DemoGame;
