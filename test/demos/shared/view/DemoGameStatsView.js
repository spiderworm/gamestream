
function DemoGameStatsView(demoGame) {
	this.game = demoGame;

	this.nodes = {};

	var rootNode = new RootNode();
	this.nodes.root = rootNode;
	this.node = rootNode;

	var headerNode = new HeaderNode(demoGame);
	rootNode.appendChild(headerNode);
	this.nodes.header = headerNode;

	var descriptionNode = new DescriptionNode(demoGame);
	rootNode.appendChild(descriptionNode);
	this.nodes.description = descriptionNode;
}

DemoGameStatsView.prototype.update = function() {
	this.nodes.header.update();
	this.nodes.description.update();
};

function RootNode() {
	this.node = document.createElement('section');
	this.node.style.boxSizing = 'border-box';
	this.node.style.border = '1px solid rgba(0,0,0,.5)';
	this.node.style.padding = '5px';
	this.node.style.position = 'absolute';
	this.node.display = this.display.bind(this);
	return this.node;
}

RootNode.prototype.display = function(x, y, width, height) {
	this.node.style.left = x + 'px';
	this.node.style.top = y + 'px';
	this.node.style.width = width + 'px';
	this.node.style.height = height + 'px';
};

function HeaderNode(game) {
	this.game = game;
	this.node = document.createElement('h1');
	this.node.update = this.update.bind(this);
	return this.node;
}

HeaderNode.prototype.update = function() {
	this.node.innerText = this.game.name;
};

function DescriptionNode(game) {
	this.game = game;
	this.node = document.createElement('div');
	this.node.innerHTML = '\
		<p class="description"></p>\
		<ul>\
			<li>speed: <span class="speed"></span></li>\
		</ul>\
	';
	this.nodes = {
		description: this.node.querySelector('.description'),
		speed: this.node.querySelector('.speed')
	};
	this.node.update = this.update.bind(this);
	return this.node;
}

DescriptionNode.prototype.update = function() {
	this.nodes.description.innerText = this.game.description || '';
	var speed = this.game.stream.speed;
	var speedText = "playing";
	if (speed < 0) {
		if (speed < -2) {
			speedText = "rewinding fast";
		} else {
			speedText = "rewinding";	
		}
	} else if (speed === 0) {
		speedText = "paused";
	} else {
		if (speed >= 2) {
			speedText = "fast-forwarding";
		} else if (speed > 1) {
			speedText = "playing slightly fast";
		} else if (speed === 1) {
			speedText = "playing";
		} else {
			speedText = "playing slowly";
		}
	}
	this.nodes.speed.innerText = this.game.stream.speed + ' (' + speedText + ')';
};

module.exports = DemoGameStatsView;
