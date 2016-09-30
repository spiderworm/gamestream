
var demosConfig = require('./webpack-demos.config.js');
var clone = require('./misc/objectFactory.js').clone;
var CopyWebpackPlugin = require('copy-webpack-plugin');

demosConfig = clone(
	demosConfig,
	[
		{
			output: {
				publicPath: "/gamestream/",
				filename: "./built/test/demos/[name].js"
			}
		}
	]
);

var webFilesConfig = {
	entry: "./index.js",
	output: {
		filename: "./built/index.js"
	},
	plugins: [
		new CopyWebpackPlugin(
			[
				{ from: "./**/*.html", to: "./built/" },
				{ from: "./**/*.css", to: "./built/" }
			],
			{
				ignore: [
					'./built/**/*',
					'./node_modules/**/*'
				]
			}
		)
	],
	devtool: 'source-map',
	node: {
		fs: 'empty',
		tls: 'empty'
	}
};

var configs = [demosConfig, webFilesConfig];

module.exports = configs;
