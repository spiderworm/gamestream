
var ESCAPE = '\\';
var ESCAPE_REGEX = /\\/g;
var ESCAPED_ESCAPE = ESCAPE + ESCAPE;
var ESCAPED_ESCAPE_REGEX = /\\\\/g;
var UNDEFINED = 'undefined';
var ESCAPED_UNDEFINED = ESCAPE + UNDEFINED;

var jsonUtil = {
	stringify: function(obj) {
		return JSON.stringify(escape(obj));
	},
	stringifyForLogs: function(obj) {
		var result = this.stringify(obj);
		result = unescapeStringified(result);
		return result;
	},
	parse: function(str) {
		return unescape(JSON.parse(str));
	}
};

function escape(obj) {
	for (var prop in obj) {
		if (obj[prop] === undefined) {
			obj[prop] = UNDEFINED;
		} else if (obj[prop] === UNDEFINED) {
			obj[prop] = ESCAPED_UNDEFINED;
		} else if (typeof obj[prop] === 'string') {
			var str = obj[prop].replace(ESCAPE_REGEX, ESCAPED_ESCAPE);
			obj[prop] = str;
		} else if (typeof obj[prop] === 'object') {
			escape(obj[prop]);
		}
	}
	return obj;
}

function unescape(obj) {
	for (var prop in obj) {
		if (obj[prop] === UNDEFINED) {
			obj[prop] = undefined;
		} else if (obj[prop] === ESCAPED_UNDEFINED) {
			obj[prop] = UNDEFINED;
		} else if (typeof obj[prop] === 'string') {
			var str = obj[prop].replace(ESCAPED_ESCAPE_REGEX, ESCAPE);
			obj[prop] = str;
		} else if (typeof obj[prop] === 'object') {
			unescape(obj[prop]);
		}
	}
	return obj;

}

function unescapeStringified(str) {
	var result = str;
	result = result.replace(
		/("(?:[^\\"]|\\.)*"\s*:\s*)("(?:[^\\"]|\\.)*")/g,
		function(match, key, value) {
			var valueBefore = value;
			if (value === '"' + UNDEFINED + '"') {
				value = UNDEFINED;
			} else if (value === '"' + ESCAPE + ESCAPED_ESCAPE + '"') {
				value = '"' + UNDEFINED + '"';
			} else {
				value = value.replace(ESCAPED_ESCAPE_REGEX, ESCAPE);
			}
			return key + value;
		}
	);
	return result;
}

/* for testing
var a = {
	a: "\\undefined",
	b: "undefined",
	c: "hello\\dude",
	"d": {
		a: "\\undefined",
		b: "undefined",
		"undefined": undefined
	}
};

console.info(jsonUtil.parse(jsonUtil.stringify(a)));
//console.info(jsonUtil.stringifyForLogs(a));
*/

module.exports = jsonUtil;
