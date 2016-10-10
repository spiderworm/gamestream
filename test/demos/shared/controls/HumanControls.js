
var keys = require('keystate-fresh');

function HumanControls(controlsStream, element, onControlStart, onControlEnd) {
	this.stream = controlsStream;

	this._onLockChange = this._onLockChange.bind(this);
	this._onMouseMove = this._onMouseMove.bind(this);

	this._onControlStart = onControlStart;
	this._onControlEnd = onControlEnd;

	this._element = element;

	document.addEventListener('pointerlockchange', this._onLockChange, false);

	this._element.addEventListener('click', function() {
		this._element.requestPointerLock();
	}.bind(this));
}

HumanControls.prototype.tick = function() {
	var forward = 0;
	var turn = 0;
	if (this._controlling) {
		if (keys.w) {
			forward++;
		}
		if (keys.s) {
			forward--;
		}
		if (this._turnBuffer) {
			turn -= this._turnBuffer.x / 10;
			this._turnBuffer = { x: 0, y: 0 };
		}
	}
	this.stream.updateNow({
		forward: forward,
		turn: turn
	});
};

HumanControls.prototype._onLockChange = function(event) {
	if (document.pointerLockElement === this._element) {
		this._controlling = true;
		this._turnBuffer = { x: 0, y: 0};
		document.addEventListener("mousemove", this._onMouseMove, false);
		if (this._onControlStart) {
			this._onControlStart();
		}
	} else {
		this._controlling = false;
		document.removeEventListener("mousemove", this._onMouseMove, false);
		if (this._onControlEnd) {
			this._onControlEnd();
		}
	}
};

HumanControls.prototype._onMouseMove = function(moveEvent) {
	this._turnBuffer.x += moveEvent.movementX;
	this._turnBuffer.y += moveEvent.movementY;
};

module.exports = HumanControls;
