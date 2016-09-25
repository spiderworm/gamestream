
var DemoThrees = require('../shared/view/DemoThrees.js');
var PhysicsSystem = require('./physics/PhysicsSystem.js');
var ViewSystem = require('./view/ViewSystem.js');
var now = require('../../../misc/now.js');
var FloorEntity = require('./entities/FloorEntity.js');

function DemoGame() {
	this.systems = {
		physics: new PhysicsSystem(),
		view: new ViewSystem()
	};

	this.entities = {
		floor: new FloorEntity()
	};

	this.threes = new DemoThrees();
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
};

DemoGame.prototype.eachSystem = function(callback) {
	Object.keys(this.systems).forEach(function(id) {
		callback(this.systems[id]);
	}.bind(this));
};

module.exports = DemoGame;
