
var Stream = require('stream');
var inherits = require('inherits');
var Config = require('../misc/Config.js');
var now = require('../misc/now.js');

var defaultConfig = new Config({
	logTimestamp: true,
	logUpdates: true,
	logSpeed: true,
	logRewrites: true,
	logValues: false,
	logReverseUpdates: false,
	logFull: false,
	getDelay: false,
	duration: Infinity
});

function ConsoleLogger(config) {
	Stream.call(this, { objectMode: true });
	config = new Config(defaultConfig, [config]);
	Config.apply(config, this);
	this._logging = true;
	this.log = this.log.bind(this);
	if (config.duration !== Infinity) {
		setTimeout(this.end.bind(this), config.duration);
	}
}

inherits(ConsoleLogger, Stream);

ConsoleLogger.prototype.write = function(datas) {
	if (this._logging) {
		this.log(datas);
	}
};

ConsoleLogger.prototype.log = function(datas) {
	var time = now();
	if (!datas.forEach) {
		datas = [datas];
	}
	datas.forEach(function(data) {
		this._log(time, data);
	}.bind(this));
};

ConsoleLogger.prototype.end = function() {
	if (this._logging) {
		this._logging = false;
	}
};

ConsoleLogger.prototype._log = function(receivedTime, data) {
	var showLog = (
		this.logFull ||
		(this.logUpdates && data.update) ||
		(this.logSpeed && data.speed !== undefined) ||
		(this.logRewrites && data.rewrite)
	);
	if (!showLog) {
		return;
	}
	var delay = '';
	if (this.getDelay) {
		var ms = this.getDelay(data, receivedTime);
		if (ms || ms === 0) {
			delay = ['after a', ms, 'ms delay'].join(' ');
		}
	}
	console.log('---received data', delay);
	if (this.logFull) {
		console.log(JSON.stringify(data));
	} else {
		if (this.logTimestamp) {
			console.log('time:   ', data.time);
		}
		if (this.logSpeed && data.speed !== undefined) {
			console.log('speed:  ', JSON.stringify(data.speed));
		}
		if (this.logRewrites && data.rewrite) {
			console.log('rewrite:', !!data.rewrite);
		}
		if (this.logUpdates && data.update) {
			console.log('update: ', JSON.stringify(data.update));
		}
		if (this.logReverseUpdates && data.reverseUpdate) {
			console.log('reverse update:', JSON.stringify(data.reverseUpdate));
		}
		if (this.logValues && data.values) {
			console.log('values: ', JSON.stringify(data.values));
		}
	}
	console.log('');
}

module.exports = ConsoleLogger;
