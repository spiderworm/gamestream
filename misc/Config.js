
var objectFactory = require('./objectFactory.js');

var assignNarrow = objectFactory.createFactory({
	clone: false,
	deep: true,
	narrow: true
});

var assign = objectFactory.createFactory({
	clone: false,
	narrow: false,
	deep: true
});

function Config(defaults, overrides) {
	assign(this, [defaults]);
	assignNarrow(this, overrides);
}

Config.apply = function(config, target) {
	assign(target, [config]);
};

module.exports = Config;
