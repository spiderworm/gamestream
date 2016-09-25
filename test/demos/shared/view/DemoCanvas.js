
function DemoCanvas() {
	var canvas = document.createElement('canvas');
	canvas.style.position = 'absolute';
	canvas.style.zIndex = -1;
	canvas.style.top = canvas.style.bottom = canvas.style.left = canvas.style.right = 0;
	document.body.appendChild(canvas);
	return canvas;
}

module.exports = DemoCanvas;
