
module.exports = {
	entry: {
		"index": [
			"./index.js"
		],
		"one": [
			"./one.js"
		]
	},
	output: {
		filename: "[name].js"
	},
	node: {
		fs: 'empty',
		tls: 'empty'
	}
};
