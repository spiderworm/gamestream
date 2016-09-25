
var clone = require('clone');

function isObject(v) {
	return (
		typeof v === 'object' &&
		v !== null
	);
}

function ObjectFactory(config) {
	config = config || {};
	config.clone = config.hasOwnProperty('clone') ? !!config.clone : false;
	config.deep = config.hasOwnProperty('deep') ? !!config.deep : true;
	config.narrow = config.hasOwnProperty('narrow') ? !!config.narrow : false;

	var factory = (function factory(target, modifiers) {
		if (!isObject(target)) {
			return target;
		}
		if (config.clone === true) {
			if (config.deep === true) {
				target = this.clone(target);
			} else {
				target = this.assign({}, target);
			}
		}
		if (modifiers) {
			modifiers.forEach(function(modifier) {
				if (config.narrow === true) {
					if (config.deep) {
						this.assignNarrowDeep(target, modifier);
					} else {
						this.assignNarrow(target, modifier);
					}
				} else {
					if (config.deep) {
						this.assignDeep(target, modifier);
					} else {
						this.assign(target, modifier);
					}
				}
			}.bind(this));
		}
		return target;
	}).bind(this);

	return factory;
}

ObjectFactory.prototype.clone = function(a) {
	return clone(a);
};

ObjectFactory.prototype.assign = function(a, b) {
	return Object.assign(a, b);
};

ObjectFactory.prototype.assignDeep = function(a, b) {
	for (var i in b) {
		if (isObject(b[i])) {
			if (!isObject(a[i])) {
				a[i] = {};
			}
			this.assignDeep(a[i], b[i]);
		} else {
			a[i] = b[i];
		}
	}
	return a;
};

ObjectFactory.prototype.assignNarrow = function(a, b) {
	for (var i in b) {
		if (a.hasOwnProperty(i)) {
			a[i] = b[i];
		}
	}
};

ObjectFactory.prototype.assignNarrowDeep = function(a, b) {
	for (var i in b) {
		if (a.hasOwnProperty(i)) {
			if (isObject(b[i])) {
				if (!isObject(a[i])) {
					a[i] = {};
				}
				this.assignNarrowDeep(a[i], b[i]);
			} else {
				a[i] = b[i];
			}
		}
	}
};

function ObjectFactoryFactory() {}

ObjectFactoryFactory.prototype.createFactory = function(config) {
	return new ObjectFactory(config);
};

ObjectFactoryFactory.prototype.clone = new ObjectFactory({clone: true, deep: true, narrow: false});

ObjectFactoryFactory.prototype.cloneNarrow = new ObjectFactory({clone: true, deep: true, narrow: true});

ObjectFactoryFactory.prototype.assignDeep = new ObjectFactory({clone: false, deep: true, narrow: false});

var objectFactory = new ObjectFactoryFactory();
module.exports = objectFactory;
