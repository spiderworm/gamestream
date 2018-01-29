
var inherits = require('inherits');
var Writable = require('./Writable.js');
var Duplex = require('./Duplex.js');
var EventEmitter = require('events').EventEmitter;
var State = require('../state/State.js');

function Combiner(combine) {
	EventEmitter.call(this);
	Duplex.call(this);

	this.__combiner = {
		connections: []
	};

	this.on(Writable.EVENTS.PIPE, source => {
		var connection = {
			source: source,
			writable: (states) => {
				states = states.map(state => {
					state = State.fromObject(state);
					state.update = combine(source, state.update);
					return state;
				});
				this.push(states);
			}
		}
		source.pipe(connection.writable);
		this.__combiner.connections.push(connection);
	});

	this.on(Writable.EVENTS.UNPIPE, source => {
		for (var i = this.__combiner.connections.length; i >= 0; i--) {
			if (this.__combiner.connections[i].source === source) {
				var connection = this.__combiner.connections.splice(i, 1)[0];
				source.unpipe(connection.writable);
			}
		}
	});
}

inherits(Combiner, EventEmitter);
Duplex.applyTo(Combiner);

Combiner.prototype.write = function(states) {};

module.exports = Combiner;
