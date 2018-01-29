
var inherits = require('inherits');
var StreamStore = require('../stream/StreamStore.js');

function StatesStore() {
	StreamStore.call(this);
}

inherits(StatesStore, StreamStore);

module.exports = StatesStore;
