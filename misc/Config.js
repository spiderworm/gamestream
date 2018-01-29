
var objectHero = require('object-hero');

var assignNarrow = objectHero.createFactory({
	clone: false,
	deep: false,
	narrow: true
});

var assign = objectHero.createFactory({
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
