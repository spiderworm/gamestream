
var commonConfig = require('./webpack.config.js');
var merge = require('merge');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var config = {
	output: {
		publicPath: "/gamestream/",
		filename: "./build/[name].js"
	},
	plugins: [
		new CopyWebpackPlugin([
			{ from: "./test/demos/index.html", to: "./build/test/demos/index.html" },
			{ from: "./test/demos/one.html", to: "./build/test/demos/one.html" }
		])
	]
};

config = merge(commonConfig, config);

module.exports = config;
