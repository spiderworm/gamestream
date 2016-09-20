
var GameStream = require('./GameStream.js');
GameStream.SocketServer = require('./sockets/SocketServer.js');
GameStream.Socket = require('./sockets/Socket.js');
GameStream.mergeStates = require('./states/statesUtil.js').merge;

module.exports = GameStream;
