
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
	config.copyUndefined = config.hasOwnProperty('copyUndefined') ? !! config.copyUndefined : true;

	var factory = (function factory(target, modifiers) {
		if (!isObject(target)) {
			return target;
		}
		if (config.clone === true) {
			if (config.deep === true) {
				target = this.clone(target, config);
			} else {
				target = this.assign({}, target, config);
			}
		}
		if (modifiers) {
			modifiers.forEach(function(modifier) {
				if (config.narrow === true) {
					if (config.deep) {
						this.assignNarrowDeep(target, modifier, config);
					} else {
						this.assignNarrow(target, modifier, config);
					}
				} else {
					if (config.deep) {
						this.assignDeep(target, modifier, config);
					} else {
						this.assign(target, modifier, config);
					}
				}
			}.bind(this));
		}
		return target;
	}).bind(this);

	return factory;
}

ObjectFactory.prototype.clone = function(a, config) {
	var b = clone(a);
	if (!config.copyUndefined) {
		this.purgeUndefined(b, config);
	}
	return b;
};

ObjectFactory.prototype.assign = function(a, b, config) {
	for (var i in b) {
		if (b[i] === undefined && config.copyUndefined === false) {
			delete a[i];
		} else {
			a[i] = b[i];
		}
	}
	return a;
};

ObjectFactory.prototype.assignDeep = function(a, b, config) {
	for (var i in b) {
		if (isObject(b[i])) {
			if (!isObject(a[i])) {
				a[i] = {};
			}
			if (isObject(a[i])) {
				this.assignDeep(a[i], b[i], config);
			}
		} else {
			if (b[i] === undefined && config.copyUndefined === false) {
				delete a[i];
			} else {
				a[i] = b[i];
			}
		}
	}
	return a;
};

ObjectFactory.prototype.assignNarrow = function(a, b, config) {
	for (var i in b) {
		if (a.hasOwnProperty(i)) {
			if (b[i] === undefined && config.copyUndefined === false) {
				delete a[i];
			} else {
				a[i] = b[i];
			}
		}
	}
};

ObjectFactory.prototype.assignNarrowDeep = function(a, b, config) {
	for (var i in b) {
		if (a.hasOwnProperty(i)) {
			if (isObject(b[i])) {
				if (!isObject(a[i])) {
					a[i] = {};
				}
				this.assignNarrowDeep(a[i], b[i], config);
			} else {
				if (b[i] === undefined && config.copyUndefined === false) {
					delete a[i];
				} else {
					a[i] = b[i];
				}
			}
		}
	}
};

ObjectFactory.prototype.purgeUndefined = function(a, config) {
	for (var i in a) {
		if (a[i] === undefined) {
			delete a[i];
		} else if (isObject(a[i])) {
			this.purgeUndefined(a[i], config);
		}
	}
};

function ObjectFactoryFactory() {}

ObjectFactoryFactory.prototype.createFactory = function(config) {
	return new ObjectFactory(config);
};

var objectFactory = new ObjectFactoryFactory();

objectFactory.isObject = isObject;
objectFactory.clone = new ObjectFactory({clone: true, deep: true, narrow: false});
objectFactory.cloneNarrow = new ObjectFactory({clone: true, deep: true, narrow: true});
objectFactory.assignDeep = new ObjectFactory({clone: false, deep: true, narrow: false});

module.exports = objectFactory;
