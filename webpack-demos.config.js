
var path = require("path");

var webpackDemosConfig = {
	entry: {
		"index": "./test/demos/index.js",
		"one": "./test/demos/one.js",
		"controls": "./test/demos/controls.js",
		"client-server": "./test/demos/client-server.js"
	},
	output: {
		path: path.resolve(__dirname, "built"),
		filename: "./test/demos/[name].js"
	},
	devtool: 'source-map',
	node: {
		fs: 'empty',
		tls: 'empty'
	}
};

module.exports = webpackDemosConfig;
