
var merge = require('merge');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var config = {
	entry: {
		"demo-index": [
			"./test/demos/index.js"
		],
		"demo-one": [
			"./test/demos/one.js"
		]
	},
	devtool: 'source-map',
	output: {
		filename: "./[name].js"
	},
	node: {
		fs: 'empty',
		tls: 'empty'
	}
};

module.exports = config;
