
var demosConfig = require('./webpack-demos.config.js');
var clone = require('./misc/objectFactory.js').clone;
var CopyWebpackPlugin = require('copy-webpack-plugin');

demosConfig = clone(
	demosConfig,
	[
		{
			output: {
				publicPath: "/gamestream/"
			}
		}
	]
);

demosConfig.plugins = demosConfig.plugins || [];

demosConfig.plugins.push(
	new CopyWebpackPlugin(
		[
			{ from: "./**/*.html", to: "./" },
			{ from: "./**/*.css", to: "./" }
		],
		{
			ignore: [
				'./built/**/*',
				'./node_modules/**/*'
			]
		}
	)
);

module.exports = demosConfig;
