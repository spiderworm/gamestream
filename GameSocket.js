
var addPipeBagTo = require('./addPipeBagTo.js');

function GameSocket(url) {
	addPipeBagTo(this);

	var ws = new WebSocket(url);
	ws.addEventListener('message', function(raw) {
		var msg = JSON.parse(raw.data);
		this.eachPipe(function(writable) {
			writable.write(msg);
		});
	}.bind(this));
}

module.exports = GameSocket;
