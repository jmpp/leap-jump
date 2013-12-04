define(['config', 'IIG', 'IM', 'sounds', 'utils', 'canvas', 'input', 'HUD', 'player', 'bullets'], function(config, IIG, IM, sounds, utils, canvas, input, HUD, player, bullets) {

	function Bonus(params)
	{
		this.img = params.img;
		this.x = params.x;
		this.y = params.y;
		this.width = params.width;
		this.height = params.height;
		this.speedY = 2;
		this.createdTime = params.createdTime;
		this.caught = false;
		this.alpha = 1;
		this.type = params.type; // Can be 'life', 'machinegun', 'armageddon'
	}

	function BonusManager()
	{
		this.bonus = [];
		this.lastAddTime = 0;
		this.addInterval = config.BONUS_INTERVAL;

		this.add = function(img, posX, posY, type)
		{
			this.bonus.push(new Bonus({
				img : img,
				x : posX,
				y : posY,
				width : img.width,
				height : img.height,
				type : type,
				createdTime : config.CURRENT_TIMING
			}));
		};

		this.update = function()
		{
			if (this.lastAddTime === 0 && !isNaN(config.CURRENT_TIMING))
				this.lastAddTime = config.CURRENT_TIMING;

			// Time to add a new bonus ?
			// console.log (config.CURRENT_TIMING+' - '+this.lastAddTime+' > '+this.addInterval);
			if (config.CURRENT_TIMING - this.lastAddTime > this.addInterval)
			{
				// Choosing type
				var type;
				if (player.life < 40)
					type = 'life';
				else
				{
					if (Math.random() >= .75)
						type = 'armageddon';
					else
						type = 'machinegun';
				}

				var img;
				if ('life' === type)
				{
					img = IM.getInstance('img/bonus_life');
				}
				else if ('machinegun' === type)
				{
					img = IM.getInstance('img/bonus_machinegun');
				}
				else if ('armageddon' === type)
				{
					img = IM.getInstance('img/bonus_armageddon');
				}

				this.add(
					img,
					utils.rand(0, canvas.canvas.width * .5),
					utils.rand(0, canvas.canvas.height - 100),
					type
				);

				this.lastAddTime = config.CURRENT_TIMING; 

				// Adding notification
				// -------------------
				var img = IM.getInstance('img/notif_encircleBonus');
				HUD.addNotification(
					'bonus',
					canvas.canvas.width * .5 - img.width * .5,
					canvas.canvas.height * .5 - img.height * .5,
					img,
					3500
				);
			}

			for (var i = 0, c = this.bonus.length; i < c; i++)
			{
				var b = this.bonus[i];

				// Bonus has been caught ? Let's animate it a bit before it disappear.
				if (b.caught)
				{
					b.y -= b.speedY;
					b.alpha -= .05;

					if (b.alpha <= 0)
					{
						this.remove(i);
						c--;

						continue;
					}
				}
				// Checking if bonus has expired
				else if (config.CURRENT_TIMING - b.createdTime > config.BONUS_MAX_TIMING)
				{
					this.remove(i);
					c--;

					continue;
				}

				// Checking collisions with circles gestures
				var maxX, maxY, minX, minY;
				for (var j in input.leap.circles)
				{
					maxX = 0,
					maxY = 0,
					minX = canvas.canvas.width,
					minY = canvas.canvas.height;

					// NEVER DO THIS KIND OF THING AGAIN ! It hurts my delicates developer senses !
					if (input.leap.circles[''+j][0] && input.leap.circles[''+j][0].reset === false)
						continue;

					for (var k = 0, e = input.leap.circles[ '' + j ].length; k < e; k++)
					{
						var circlePoint = input.leap.circles[ '' + j ][k];

						// Max X
						if (circlePoint.x > maxX)
							maxX = circlePoint.x;

						// Min X
						if (circlePoint.x < minX)
							minX = circlePoint.x;

						// Max Y
						if (circlePoint.y > maxY)
							maxY = circlePoint.y;

						// Min Y
						if (circlePoint.y < minY)
							minY = circlePoint.y;
					}

					// Calcul du carré de collision
					var collisionSquare = {
						x : minX,
						y : minY,
						width : maxX - minX,
						height : maxY - minY
					};

					// Debug
					// canvas.ctx.strokeStyle = 'red';
					// canvas.ctx.lineWidth = 10;
					// canvas.ctx.strokeRect(collisionSquare.x, collisionSquare.y, collisionSquare.width, collisionSquare.height);
					// canvas.ctx.lineWidth = 1;

					if (utils.collide(collisionSquare, b))
					{
						sounds.powerup.play();
						HUD.initiateFlashScreen('green');

						// Caught !
						b.caught = true;

						// Do the action
						this.proceed(b);
					}
				}
			}
		};

		this.render = function()
		{
			for (var i = 0, c = this.bonus.length; i < c; i++)
			{
				var b = this.bonus[i];

				canvas.ctx.globalAlpha = b.alpha;
				IM.drawImage(canvas.ctx, b.img, b.x, b.y);
			}
			canvas.ctx.globalAlpha = 1;
		};

		this.remove = function( i )
		{
			if (this.bonus[i] && this.bonus[i].img && this.bonus[i].img instanceof IIG.Image)
				this.bonus[i].img = IM.killInstance(this.bonus[i].img);

			this.bonus.splice(i, 1);
		};

		// Do a specific action of the bonus
		this.proceed = function( bonus )
		{
			// Life gain
			// ---------
			if ('life' === bonus.type)
			{
				// console.log('+bonus life');
				player.life += config.BONUS_LIFE_GAIN;

				if (player.life > 100)
					player.life = 100;

				// Adding notification
				// -------------------
				HUD.addNotification(
					'life',
					canvas.canvas.width * .5,
					canvas.canvas.height * .5,
					'LIFE GAIN !',
					1250
				);
			}
			// Missile
			// -------
			else if ('machinegun' === bonus.type)
			{
				// console.log('+bonus machinegun');
				player.weapon = 'machinegun';
				player.bulletInterval = config.MACHINEGUN_INTERVAL;
				player.weaponTiming = config.CURRENT_TIMING;

				// Adding notification
				// -------------------
				HUD.addNotification(
					'machinegun',
					canvas.canvas.width * .5,
					canvas.canvas.height * .5,
					'SUPER GUN !',
					1250
				);
			}
			// Armageddon
			// ----------
			else if ('armageddon' === bonus.type)
			{
				player.nbArmageddons++;

				// Adding notification
				// -------------------
				if (!HUD.notifiedForArmageddonImg)
				{
					var img = IM.getInstance('img/notif_armageddon');
					HUD.addNotification(
						'armageddon_img',
						canvas.canvas.width * .5 - img.width * .5,
						canvas.canvas.height * .5 - img.height * .5,
						img,
						3000
					);
				}
				else
				{
					HUD.addNotification(
						'armageddon',
						canvas.canvas.width * .5,
						canvas.canvas.height * .5,
						'+1 ARMAGEDDON',
						1250
					);
				}
			}
		};
	}

	return new BonusManager;

});