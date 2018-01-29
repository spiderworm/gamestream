
var classUtil = {
	defineProperty: function(Klass, publicProperty, _privateProperty, setter) {
		if (!setter) {
			setter = function(val) { this[_privateProperty] = val; };
		}
		Object.defineProperty(Klass.prototype, publicProperty, {
			get: function() { return this[_privateProperty]; },
			set: setter
		});
	}, 
	defineReadOnlyProperty: function(Klass, publicProperty, _privateProperty) {
		this.defineProperty(Klass, publicProperty, _privateProperty, function() {});
	}
};

module.exports = classUtil;
