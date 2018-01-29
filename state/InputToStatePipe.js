
var inherits = require('inherits');
var TransformPipe = require('../stream/TransformPipe.js');
var State = require('./State.js');

function InputToStatePipe() {
	TransformPipe.call(this, states => {
		return states.map(state => {
			return State.fromObject(state);
		});
	});
}

inherits(InputToStatePipe, TransformPipe);

module.exports = InputToStatePipe;
