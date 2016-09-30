
var webpackDemosConfig = require('./webpack-demos.config.js');
var clone = require('./misc/objectFactory.js').clone;

webpackDemosConfig = clone(webpackDemosConfig);

delete webpackDemosConfig.output.path;

module.exports = webpackDemosConfig;
