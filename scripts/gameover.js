define(['config', 'IM', 'canvas', 'utils', 'input', 'stars'], function(config, IM, canvas, utils, input, stars) {
	
	function GameOver()
	{
		/**
		 * Properties
		**/

		/**
		 * Methods
		**/

		this.init = function()
		{
			document.getElementById('game-root').appendChild( canvas.canvas );
		};

		this.update = function()
		{
			input.update();
			stars.update();

			// Restart ?
			if (input.leap.swipes.length > 0)
				window.location.reload();
		};

		this.render = function()
		{
			//canvas.ctx.clearRect(0, 0, config.SCREEN_WIDTH, config.SCREEN_HEIGHT);
			canvas.ctx.fillStyle = 'rgba(0, 0, 0, .5)';
			canvas.ctx.fillRect(0, 0, config.SCREEN_WIDTH, config.SCREEN_HEIGHT);

			stars.render();

			//GameOver text
			canvas.ctx.font = '72pt silkscreennormal';
			canvas.ctx.textAlign = 'center';
			canvas.ctx.textBaseline = 'middle';
			canvas.ctx.fillStyle = 'white';
			canvas.ctx.fillText('GAME OVER', canvas.canvas.width * .5, canvas.canvas.height * .5);
			canvas.ctx.font = '56pt silkscreennormal';
			canvas.ctx.fillText('Score : ' + window.finalScore, canvas.canvas.width * .5, canvas.canvas.height * .5 + 72);
			canvas.ctx.font = '26pt silkscreennormal';
			canvas.ctx.fillText('Swipe anywhere to restart', canvas.canvas.width * .5, canvas.canvas.height * .5 + 125);

			this.renderHandsAndFingers();
			this.renderSwipes();
			this.renderCircles();
		};

		this.renderHandsAndFingers = function()
		{
			canvas.ctx.fillStyle = '#f00';
			canvas.ctx.strokeStyle = '#900';
			canvas.ctx.lineWidth = 4;
			canvas.ctx.globalAlpha = .25;

			for (var i = 0, c = input.leap.hands.length; i < c; i++)
			{
				var hand = input.leap.hands[i];

				// Rendering palm
				canvas.ctx.beginPath();
				canvas.ctx.arc(hand.palm.x, hand.palm.y, 30, 0, Math.PI * 2, true);
				canvas.ctx.closePath();
				canvas.ctx.fill();
				canvas.ctx.stroke();

				for (var j = 0, d = hand.fingers.length; j < d; j++)
				{
					var finger = hand.fingers[j];

					// Rendering fingers
					canvas.ctx.beginPath();
					canvas.ctx.arc(finger.x, finger.y, 10, 0, Math.PI * 2, true);
					canvas.ctx.closePath();
					canvas.ctx.fill();
					canvas.ctx.stroke();
				}
			}

			canvas.ctx.lineWidth = 1;
			canvas.ctx.globalAlpha = 1;
		};

		this.renderSwipes = function()
		{
			// Setting up the style for the stroke
			canvas.ctx.strokeStyle = "#FFA040";
			canvas.ctx.lineWidth = 3;

			for (var i = 0, c = input.leap.swipes.length; i < c; i++)
			{
				var swipe = input.leap.swipes[i];

				// if (i === 0)
				// {
					//console.log(swipe);
					var startPos = utils.leapToScene(canvas.canvas, config.LEAP_FRAME, swipe.startPosition);
					var pos = utils.leapToScene(canvas.canvas, config.LEAP_FRAME, swipe.position);

					

					// Drawing the path
					canvas.ctx.beginPath();

					// Move to the start position
					canvas.ctx.moveTo( startPos.x , startPos.y );

					// Draw a line to current position
					canvas.ctx.lineTo( pos.x , pos.y );

					canvas.ctx.closePath();
					canvas.ctx.stroke();
					
				// }
			}

			canvas.ctx.lineWidth = 1;
		};

		this.renderCircles = function()
		{
			canvas.ctx.lineWidth = 5;
			canvas.ctx.fillStyle = '#0096c6';
			canvas.ctx.strokeStyle = '#006688';

			for (var i in input.leap.circles)
			{
				for (var j = 0, d = input.leap.circles[ '' + i ].length; j < d; j++)
				{
					var circlePoint = input.leap.circles[ '' + i ][j];

					canvas.ctx.beginPath();
					canvas.ctx.moveTo( circlePoint.prevX, circlePoint.prevY );
					canvas.ctx.lineTo( circlePoint.x, circlePoint.y );
					canvas.ctx.closePath();
					canvas.ctx.stroke();
				}
			}
/*
			for (var i = 0, c = input.leap.circles.length; i < c; i++)
			{
				var circle = input.leap.circles[i];
				var pos = utils.leapToScene( canvas.canvas, config.LEAP_FRAME, circle.center );

				canvas.ctx.beginPath();
				canvas.ctx.arc( pos.x, pos.y, circle.radius, 0, Math.PI * 2, true );
				canvas.ctx.closePath();
				canvas.ctx.fill();
				canvas.ctx.stroke();
			}*/

			canvas.ctx.lineWidth = 1;
		};
	}

	return new GameOver();
});