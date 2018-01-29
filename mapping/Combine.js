
var inherits = require("inherits");
var Readable = require("../stream/Readable.js");
var MappingTransform = require("./MappingTransform.js");

function Combine(getSourceID, map) {
	Readable.call(this);

	getSourceID = getSourceID || (() => { console.error('Not implemented'); });
	map = map || {};
	this.__combine = {
		getSourceID: getSourceID,
		map: map,
		sources: {}
	};
}

inherits(Combine, Readable);

Combine.prototype.combine = function(readable) {
	var id = this.__combine.getSourceID(readable);
	if (id || id === 0) {
		var sources = this.__combine.sources;
		if (sources[id]) {
			if (sources[id].readable !== readable) {
				console.error('Stream cannot be combined because stream ID already in use');
			} else {
				return;
			}
		} else {
			sources[id] = new SourceAndMap(readable, this.__combine.map, this);
		}
	}
};



function SourceAndMap(readable, map, combine) {
	this.readable = readable;
	this.mapper = new MappingTransform(map);
	this.output = this.readable.pipe(this.mapper).pipe(states => {
		combine.push(states);
	});
}

module.exports = Combine;

