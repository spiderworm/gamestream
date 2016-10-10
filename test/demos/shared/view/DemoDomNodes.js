
function DemoCanvas() {
	var canvas = document.createElement('canvas');
	canvas.style.width = '100%';
	canvas.style.height = '100%';
	canvas.style.position = 'absolute';
	canvas.style.zIndex = 1;
	return canvas;
}

function DemoOverlay() {
	var node = document.createElement('div');
	node.style.width = '100%';
	node.style.height = '100%';
	node.style.position = 'absolute';
	node.style.zIndex = 2;
	node.style.pointerEvents = 'none';
	node.clear = function() {
		node.innerHTML = '';
	};
	return node;
}

function DemoRootNode(canvas) {
	var rootNode = document.createElement('div');
	rootNode.style.position = 'absolute';
	rootNode.style.zIndex = -1;
	rootNode.style.top = rootNode.style.bottom = rootNode.style.left = rootNode.style.right = 0;
	return rootNode;
}

function DemoDomNodes() {
	this.canvas = new DemoCanvas();
	this.overlay = new DemoOverlay();
	this.root = new DemoRootNode();
	this.root.appendChild(this.canvas);
	this.root.appendChild(this.overlay);
	document.body.appendChild(this.root);
}

module.exports = DemoDomNodes;
