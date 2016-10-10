
var Duplex = require('../stream/Duplex.js');
var inherits = require('inherits');
var objectFactory = require('../misc/objectFactory.js');
var statesUtil = require('../states/statesUtil.js');

function StateSquasher(map) {
	Duplex.call(this);
}

inherits(StateSquasher, Duplex);

StateSquasher.prototype.write = function(states) {
	this._pipes.out([statesUtil.merge(states)]);
};

module.exports = StateSquasher;
