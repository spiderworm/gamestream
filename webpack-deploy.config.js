
var commonConfig = require('./webpack.config.js');
var merge = require('merge');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var config = {
	output: {
		publicPath: "/gamestream/",
		filename: "./built/[name].js"
	},
	plugins: [
		new CopyWebpackPlugin(
			[
				{ from: "./*.html", to: "./built/" },
				{ from: "./**/*.html", to: "./built/" }
			],
			{
				ignore: [
					'./built/**/*',
					'./node_modules/*.html',
					'./node_modules/**/*.html'
				]
			}
		)
	]
};

config = merge(commonConfig, config);

module.exports = config;
