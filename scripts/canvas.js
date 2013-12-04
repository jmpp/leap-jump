define(['config'], function(config) {
	var canvas = document.createElement('canvas');

	canvas.width = config.SCREEN_WIDTH;
	canvas.height = config.SCREEN_HEIGHT;
	// canvas.style.border = '1px solid black';
	canvas.style.display = 'block';
	canvas.style.margin = '0px auto';
	canvas.style.width = canvas.width + 'px';
	canvas.style.height = canvas.height + 'px';
	canvas.style.position = 'absolute';
	canvas.style.top = 0;
	canvas.style.left = 0;
	canvas.style.right = 0;
	canvas.style.bottom = 0;

	return {
		canvas : canvas,
		ctx : canvas.getContext('2d')
	};
});