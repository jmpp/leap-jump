define(['config', 'difficulty', 'IM', 'sounds', 'canvas', 'utils', 'input', 'HUD', 'stars', 'bonus', 'player', 'bullets', 'armageddons', 'obstacles'], function(config, difficulty, IM, sounds, canvas, utils, input, HUD, stars, bonus, player, bullets, armageddons, obstacles) {
	
	function Game()
	{
		/**
		 * Properties
		**/

		this.initialized = false;

		/**
		 * Methods
		**/

		this.init = function()
		{
			sounds.theme.play();
			armageddons.lastFireTime = config.CURRENT_TIMING + 3000;
		};

		this.update = function()
		{
			// Updating difficulty
			this.updateDifficulty();

			if (!this.initialized && !isNaN(config.CURRENT_TIMING))
			{
				var img = IM.getInstance('img/notif_tapToShot');
				HUD.addNotification(
					'tapShot',
					canvas.canvas.width * .5 - img.width * .5,
					canvas.canvas.height * .5 - img.height * .5,
					img,
					2500
				);

				this.initialized = true;
			}

			input.update();
			stars.update();
			bonus.update();
			player.update();
			obstacles.update();
			bullets.update();
			armageddons.update();
			HUD.update();

			IM.update();
		};

		this.render = function()
		{
			//canvas.ctx.clearRect(0, 0, config.SCREEN_WIDTH, config.SCREEN_HEIGHT);
			canvas.ctx.fillStyle = 'rgba(0, 0, 0, .5)';
			canvas.ctx.fillRect(0, 0, config.SCREEN_WIDTH, config.SCREEN_HEIGHT);

			stars.render();
			// bonus.update();
			bonus.render();
			player.render();
			obstacles.render();
			bullets.render();
			armageddons.render();
			HUD.render();

			this.renderHandsAndFingers();
			//this.renderSwipes();
			this.renderCircles();
		};

		this.updateDifficulty = function()
		{
			if (player.level === 1 && player.score > 50000)
			{
				player.level = 2;

				// Adding notification
				// -------------------
				HUD.addNotification(
					'levelup',
					canvas.canvas.width * .5,
					canvas.canvas.height * .5,
					'LEVEL UP : ' + player.level,
					1250
				);

				config.OBSTACLE_INTERVAL_ASTEROID 	= difficulty['level_'+player.level].OBSTACLE_INTERVAL_ASTEROID;
				config.OBSTACLE_INTERVAL_SOLDAT 	= difficulty['level_'+player.level].OBSTACLE_INTERVAL_SOLDAT;
				config.OBSTACLE_INTERVAL_FIGHTER 	= difficulty['level_'+player.level].OBSTACLE_INTERVAL_FIGHTER;
				config.OBSTACLE_DAMAGE 				= difficulty['level_'+player.level].OBSTACLE_DAMAGE;
			}
			else if (player.level === 2 && player.score > 100000)
			{
				player.level = 3;

				// Adding notification
				// -------------------
				HUD.addNotification(
					'levelup',
					canvas.canvas.width * .5,
					canvas.canvas.height * .5,
					'LEVEL UP : ' + player.level,
					1250
				);

				config.OBSTACLE_INTERVAL_ASTEROID 	= difficulty['level_'+player.level].OBSTACLE_INTERVAL_ASTEROID;
				config.OBSTACLE_INTERVAL_SOLDAT 	= difficulty['level_'+player.level].OBSTACLE_INTERVAL_SOLDAT;
				config.OBSTACLE_INTERVAL_FIGHTER 	= difficulty['level_'+player.level].OBSTACLE_INTERVAL_FIGHTER;
				config.OBSTACLE_DAMAGE 				= difficulty['level_'+player.level].OBSTACLE_DAMAGE;
			}
			else if (player.level === 3 && player.score > 150000)
			{
				player.level = 4;

				// Adding notification
				// -------------------
				HUD.addNotification(
					'levelup',
					canvas.canvas.width * .5,
					canvas.canvas.height * .5,
					'LEVEL UP : ' + player.level,
					1250
				);

				config.OBSTACLE_INTERVAL_ASTEROID 	= difficulty['level_'+player.level].OBSTACLE_INTERVAL_ASTEROID;
				config.OBSTACLE_INTERVAL_SOLDAT 	= difficulty['level_'+player.level].OBSTACLE_INTERVAL_SOLDAT;
				config.OBSTACLE_INTERVAL_FIGHTER 	= difficulty['level_'+player.level].OBSTACLE_INTERVAL_FIGHTER;
				config.OBSTACLE_DAMAGE 				= difficulty['level_'+player.level].OBSTACLE_DAMAGE;
			}
			else if (player.level === 4 && player.score > 200000)
			{
				player.level = 5;

				// Adding notification
				// -------------------
				HUD.addNotification(
					'levelup',
					canvas.canvas.width * .5,
					canvas.canvas.height * .5,
					'LEVEL UP : ' + player.level,
					1250
				);

				config.OBSTACLE_INTERVAL_ASTEROID 	= difficulty['level_'+player.level].OBSTACLE_INTERVAL_ASTEROID;
				config.OBSTACLE_INTERVAL_SOLDAT 	= difficulty['level_'+player.level].OBSTACLE_INTERVAL_SOLDAT;
				config.OBSTACLE_INTERVAL_FIGHTER 	= difficulty['level_'+player.level].OBSTACLE_INTERVAL_FIGHTER;
				config.OBSTACLE_DAMAGE 				= difficulty['level_'+player.level].OBSTACLE_DAMAGE;
			}
			else if (player.level === 5 && player.score > 300000)
			{
				player.level = 6;

				// Adding notification
				// -------------------
				HUD.addNotification(
					'levelup',
					canvas.canvas.width * .5,
					canvas.canvas.height * .5,
					'LEVEL UP : ' + player.level,
					1250
				);

				config.OBSTACLE_INTERVAL_ASTEROID 	= difficulty['level_'+player.level].OBSTACLE_INTERVAL_ASTEROID;
				config.OBSTACLE_INTERVAL_SOLDAT 	= difficulty['level_'+player.level].OBSTACLE_INTERVAL_SOLDAT;
				config.OBSTACLE_INTERVAL_FIGHTER 	= difficulty['level_'+player.level].OBSTACLE_INTERVAL_FIGHTER;
				config.OBSTACLE_DAMAGE 				= difficulty['level_'+player.level].OBSTACLE_DAMAGE;
			}
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

	return new Game();
});