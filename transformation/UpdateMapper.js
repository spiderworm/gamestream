
var Duplex = require('../stream/Duplex.js');
var inherits = require('inherits');
var objectFactory = require('../misc/objectFactory.js');
var StatesSquasher = require('./StatesSquasher.js');
var CustomWritable = require('../stream/CustomWritable.js');

function UpdateMapper(map) {
	Duplex.call(this);
	this._map = map;

	var eventEmitter = new CustomWritable(function(states) {
		this.emit('data', states);
	}.bind(this));

	var statesSquasher = new StatesSquasher();

	statesSquasher.pipe(eventEmitter);
	this._pipes.pipe(statesSquasher);
}

inherits(UpdateMapper, Duplex);

UpdateMapper.prototype.write = function(arr) {
	var results = [];
	arr.forEach(function(state) {
		state = this.map(state);
		if (state) {
			results.push(state);
		}
	}.bind(this));
	if (results.length > 0) {
		this._pipes.out(results);
	}
};

UpdateMapper.prototype.map = function(state) {

	function updateTree(target, update) {
		for (var i in target) {
			if (objectFactory.isObject(target[i])) {
				updateTree(target[i], update);
			} else {
				target[i] = objectFactory.clone(update);
			}
		}
	}

	var result;
	if (state && state.update) {
		result = state;
		var update = objectFactory.clone(this._map);
		updateTree(update, result.update);
		result.update = update;
	}
	return result;
};

module.exports = UpdateMapper;
