define(function() {
	
	var utils = utils || {};

	// querySelectorAll shortcut
	utils.$ = function(selector) {
		var qsa = document.querySelectorAll(selector);
		return (qsa.length === 1 ? qsa[0] : qsa);
	};

	// Print something in the HTML
	utils.debug = function(message) {
		var debug = document.querySelector('#debug');
		if (!debug) {
			debug = document.createElement('div');
			debug.setAttribute('id', 'debug');
			document.body.appendChild( debug );
		}

		debug.textContent = message; // innerText
	};

	// Compute a random value between 'a' and 'b'
	utils.rand = function(a, b) {
		return a + Math.random() * (b - a);
	};

	// Get distance between 2 objects
	// (assuming these objects have .x and .y properties)
	utils.getDistance = function(a, b){
		return Math.sqrt((a.x-b.x)*(a.x-b.x) + (a.y-b.y)*(a.y-b.y));
	};

	// Detect collision between 2 objects
	// (assuming these objects have .x .y .width .height properties)
	utils.collide = function(a, b) {

		if (a === undefined || b === undefined)
			return false;

		if(typeof a.width === "undefined" || typeof a.height === "undefined" || typeof b.width === "undefined" || typeof b.height === "undefined")
			return false;

		return !(b.x >= a.x + a.width // Trop à droite
				|| b.x + b.width <= a.x // Trop à gauche
				|| b.y >= a.y + a.height // Trop en bas
				|| b.y + b.height <= a.y) // Trop en haut
	};

	// Teste si un interval est passé
	utils.interval = function(time, interval) {
		return Math.abs(time - new Date().getTime()) / 1000 > interval;
	};

	// Pickup a random value into an Array
	Array.prototype.pickup = Array.pickup || function() {
		return this[ Math.floor(Math.random()*this.length) ];
	};

	// Convertie une position récupérée par le Leap Motion vers quelque chose d'exploitable sur les dimensions d'un canvas 2D
	utils.leapToScene = function( canvasEl, frame, leapPos )
	{
		var iBox = frame.interactionBox;

		var left = iBox.center[0] - iBox.size[0]/2;
		var top = iBox.center[1] + iBox.size[1]/2;

		var x = leapPos[0] - left;
		var y = leapPos[1] - top;

		x /= iBox.size[0];
		y /= iBox.size[1];

		x *= canvasEl.width;
		y *= canvasEl.height;

		return {
			x : x,
			y : -y
		};

	};

	return utils;

});