
var inherits = require('inherits');
var Duplex = require('./stream/Duplex.js');
var objectFactory = require('./misc/objectFactory.js');
var ConsoleLogger = require('./debug/ConsoleLogger.js');

function DelegateResolver() {
	Duplex.call(this);

	this._hostedDelegates = [];
	this._delegates = [];

	this._handleDelegateData = this._handleDelegateData.bind(this);
	this._handleDelegateFullData = this._handleDelegateFullData.bind(this);
}

inherits(DelegateResolver, Duplex);

Object.defineProperty(DelegateResolver.prototype, 'hostedDelegates', {
	get: function() { return this._hostedDelegates.concat([]); }
});

DelegateResolver.prototype.write = function(data) {
	this._handleStreamedFullData(data);
	return true;
};

DelegateResolver.prototype.addDelegate = function(readable) {
	this._delegates.push(readable);
	readable.on('data', this._handleDelegateData);
	readable.on('full-data', this._handleDelegateFullData);
};

DelegateResolver.prototype.removeDelegate = function(readable) {
	var i = this._delegates.indexOf(readable);
	if (i !== -1) {
		this._delegates.splice(i, 1);
		readable.removeListener('data', this._handleDelegateData);
		readable.removeListener('full-data', this._handleDelegateFullData);
	}
};

DelegateResolver.prototype.hostDelegate = function(readable) {
	this._hostedDelegates.push(readable);
};

DelegateResolver.prototype.unhostDelegate = function(readable) {
	var i = this._hostedDelegates.indexOf(readable);
	if (i !== -1) {
		this._delegates.splice(i, 1);
	}
};

DelegateResolver.prototype._handleStreamedFullData = function(data) {

	var NOT_FOUND = {};

	function clear(target, map) {
		if (!map) {
			return NOT_FOUND;
		}
		for (var i in map) {
			if (objectFactory.isObject(map[i])) {
				if (objectFactory.isObject(target[i])) {
					return clear(target[i], map[i]);
				}
			} else {
				if (map[i] && target.hasOwnProperty(i)) {
					var result = target[i];
					delete target[i];
					return result;
				}
			}
		}
		return NOT_FOUND;
	}

	this._hostedDelegates.forEach(function(hostedDelegate) {
		var readyStates = [];
		data.forEach(function(state) {
			var update, values;
			if (state.update) {
				update = clear(state.update, hostedDelegate.map);
			}
			if (update !== NOT_FOUND) {
				readyStates.push({
					time: state.time,
					update: update
				});
			}
		});
		if (readyStates.length > 0) {
			hostedDelegate.write(readyStates);
		}
	});

	this._delegates.forEach(function(delegate) {
		data.forEach(function(state) {
			if (state.update) {
				clear(state.update, delegate.map);
			}
		});
	});

	this._pipes.out(data);
};

DelegateResolver.prototype._handleDelegateData = function(state) {
	this._handleDelegateFullData([state]);
};

DelegateResolver.prototype._handleDelegateFullData = function(data) {
	this._pipes.out(data);
};

module.exports = DelegateResolver;
