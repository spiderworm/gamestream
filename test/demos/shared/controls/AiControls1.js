
function AiControls1(controlsStream) {

	setTimeout(turnLeft, 1000);
	setTimeout(turnRight, 2000);
	setTimeout(moveForward, 3000);

	function turnLeft() {
		controlsStream.updateNow({
			turn: -1
		});
	}

	function turnRight() {
		controlsStream.updateNow({
			turn: 1
		});
	}

	function moveForward() {
		controlsStream.updateNow({
			forward: 1,
			turn: 0
		});
	}

}

AiControls1.prototype.tick = function() {};

module.exports = AiControls1;
