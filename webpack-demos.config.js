
var webpackDemosConfig = {
	context: "./test/demos/",
	entry: {
		"index": "./index.js",
		"one": "./one.js",
		"controls": "./controls.js",
		"client-server": "./client-server.js"
	},
	output: {
		filename: "./test/demos/[name].js"
	},
	devtool: 'source-map',
	node: {
		fs: 'empty',
		tls: 'empty'
	}
};

module.exports = webpackDemosConfig;
