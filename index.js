
var GameStream = require('./GameStream.js');
GameStream.SocketServer = require('./SocketServer.js');
GameStream.Socket = require('./Socket.js');
GameStream.mergeStates = require('./statesUtil.js').merge;

module.exports = GameStream;
