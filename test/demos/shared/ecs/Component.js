
var objectFactory = require('../misc/objectFactory.js');

function Component(config) {
	Component.apply(this, config);
	this.alive = true;
}

Component.apply = function(component, vals) {
	objectFactory.assignDeep(component, [vals]);
};

module.exports = Component;
