
var SourceDemoGame = require('./SourceDemoGame.js');
var GameStream = require('../../GameStream.js');

function HostDemoGame(name) {
	var game = new SourceDemoGame(name);
	HostDemoGame.apply(game);
	return game;
}

HostDemoGame.apply = function(game) {
	game.stream.push = true;

	game.stream.on(GameStream.events.DELEGATE_REQUESTED, function(downStream) {

		var playerName = game.createPlayer();
		var player = game.entities[playerName];

		setTimeout(function() {

			var controlsMap = {};
			controlsMap[playerName] = {
				controls: true
			};

			var controlStream = game.stream.delegate(
				{
					map: controlsMap,
					info: {
						type: 'playerControls',
						entityName: playerName
					}
				},
				downStream
			);

			controlStream.on('data', function(state) {
				game.applyState(state);
			});

/*
			var physicsMap[playerName] = {
				physics: true
			};

			var physicsStream = game.stream.delegate(
				{
					map: physicsMap,
					info: {
						type: 'playerPhysics',
						entityName: playerName
					}
				},
				downStream
			);
*/
			function checkDisconnect(stream) {
				if (stream === downStream) {
					player.life.alive = false;
					game.stream.undelegate(controlStream, downStream);
					//game.stream.undelegate(physicsStream, downStream);
					game.stream.removeListener('downstream-disconnect', checkDisconnect);
				}
			}

			game.stream.on('downstream-disconnect', checkDisconnect);

		}, 500);

	});
}

module.exports = HostDemoGame;
