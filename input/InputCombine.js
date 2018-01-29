
var inherits = require("inherits");
var Combine = require("../mapping/Combine.js");

function InputCombine(getUserID, map) {
	Combine.call(
		this,
		(getUserID || ((gameStream) => {
			return gameStream.info.userID || false;
		})),
		(map || {
			input: true
		})
	);
}

inherits(InputCombine, Combine);

module.exports = InputCombine;
