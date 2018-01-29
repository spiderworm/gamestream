
var inherits = require('inherits');
var Duplex = require('./Duplex.js');
var InterceptPipe = require('./InterceptPipe');

function ComboPipe(pipes) {
	Duplex.call(this);

	pipes = [].concat(pipes) || [];

	var inputPipe = new Duplex();
	var outputPipe = new InterceptPipe(states => {
		this.push(states);
	});

	connect(inputPipe, pipes, outputPipe);

	this.__comboPipe = {
		input: inputPipe,
		output: outputPipe,
		pipes: pipes
	};
}

inherits(ComboPipe, Duplex);

ComboPipe.prototype.write = function(states) {
	this.__comboPipe.input.push(states);
};




function connect(input, pipes, output) {
	var last = input;
	pipes.forEach(pipe => { last.pipe(pipe); last = pipe; });
	last.pipe(output);
};

module.exports = ComboPipe;
