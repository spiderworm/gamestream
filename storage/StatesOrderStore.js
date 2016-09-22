
function StatesOrderStore() {
	this._states = [];
	this._maxLength = 1000;
}

StatesOrderStore.prototype.insertLate = function(state) {
	for (var i=this._states.length; i > 0; i--) {
		if (this._states[i - 1].id < state.id) {
			return this._insertAt(i);
		}
	}
	return this._insertAt(0);
};

StatesOrderStore.prototype.getAt = function(time) {
	for (var i=this._states.length - 1; i>0; i--) {
		if (this._states[i].time <= time) {
			return this._states[i];
		}
	}
	return this._states[0];
};

StatesOrderStore.prototype._insertAt = function(state, index) {
	this._states.splice(index, 0, state);
	this._trim();
};

StatesOrderStore.prototype._trim = function() {
	if (this._states.length > this._maxLength) {
		this._states.splice(0, this._states.length - this._maxLength);
	}
};

module.exports = StatesOrderStore;
