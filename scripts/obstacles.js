define(['config', 'IIG', 'IM', 'sounds', 'utils', 'canvas', 'input', 'HUD', 'player', 'bullets', 'armageddons'], function(config, IIG, IM, sounds, utils, canvas, input, HUD, player, bullets, armageddons) {

	function Obstacle(params)
	{
		this.img = params.img;
		this.x = params.x;
		this.y = params.y;
		this.width = params.width;
		this.height = params.height;
		this.rotation = params.rotation;
		this.speed = params.speed;
		this.rotationSpeed = params.rotationSpeed;
		this.type = params.type; // Can be 'asteroid', 'soldat', 'fighter'
	}

	function ObstaclesManager()
	{
		this.obstacles = [];
		this.interval = {
			asteroid : config.OBSTACLE_INTERVAL_ASTEROID,
			soldat : config.OBSTACLE_INTERVAL_SOLDAT,
			fighter : config.OBSTACLE_INTERVAL_FIGHTER,
			boss : config.OBSTACLE_INTERVAL_BOSS
		};
		this.lastTime = {
			asteroid : 0,
			soldat : 0,
			fighter : 0,
			boss : 0
		};

		this.explosions = [];

		this.add = function(type)
		{
			if (config.CURRENT_TIMING - this.lastTime[ type ] > this.interval[ type ])
			{
				var img;

				if ('asteroid' === type)
					img = IM.getInstance('img/asteroid_' + Math.ceil(Math.random() * 4));
				else if ('soldat' === type)
					img = IM.getInstance('img/soldat');
				else if ('fighter' === type)
					img = IM.getInstance('img/fighter');

				this.obstacles.push(new Obstacle({
					img : img,
					x : canvas.canvas.width,
					y : utils.rand(100, canvas.canvas.height - img.width - 200),
					width : img.width,
					height : img.height,
					rotation : 0,
					speed : utils.rand(config['OBSTACLE_SPEED_MIN_' + type.toUpperCase()], config['OBSTACLE_SPEED_MAX_' + type.toUpperCase()]),
					rotationSpeed : utils.rand(config['OBSTACLE_SPEED_ROTATION_MIN_' + type.toUpperCase()], config['OBSTACLE_SPEED_ROTATION_MAX_' + type.toUpperCase()]),
					type : type
				}));

				this.interval[ type ] = utils.rand(
					config['OBSTACLE_INTERVAL_'+ type.toUpperCase()] - 300,
					config['OBSTACLE_INTERVAL_'+ type.toUpperCase()] + 300
				);
				this.lastTime[ type ] = config.CURRENT_TIMING;
			}
		};

		this.update = function()
		{
			this.add( 'asteroid' );
			this.add( 'soldat' );
			this.add( 'fighter' );
			// this.add( 'boss' );

			this.moveObstacles();
			// this.updateExplosions();
		};

		this.render = function()
		{
			for (var i = 0, c = this.obstacles.length; i < c; i++)
			{
				var o = this.obstacles[i];

				// Rendering asteroids
				// -------------------
				if ('asteroid' === o.type)
				{
					canvas.ctx.save();
					canvas.ctx.translate(o.x + o.width * .5, o.y + o.height * .5);
					canvas.ctx.rotate(o.rotation);
					canvas.ctx.drawImage(o.img.data, -o.width * .5, -o.height * .5, o.width, o.height);
					canvas.ctx.restore();
				}
				// Rendering soldats
				// -------------------
				else if ('soldat' === o.type)
				{
					canvas.ctx.drawImage(o.img.data, o.x, o.y, o.width, o.height);
				}
				// Rendering fighters
				// -------------------
				else if ('fighter' === o.type)
				{
					canvas.ctx.save();
					canvas.ctx.translate(o.x + o.width * .5, o.y + o.height * .5);
					canvas.ctx.rotate(o.rotation);
					canvas.ctx.drawImage(o.img.data, -o.width * .5, -o.height * .5, o.width, o.height);
					canvas.ctx.restore();
				}
			}

			this.renderExplosions();
		};

		this.moveObstacles = function()
		{
			for (var i = 0, c = this.obstacles.length; i < c; i++)
			{
				var o = this.obstacles[i];

				// Asteroids's behavior
				// -------------------
				if ('asteroid' === o.type)
				{
					o.rotation -= o.rotationSpeed;
					o.x -= o.speed;
				}
				// Soldats's behavior
				// -------------------
				else if ('soldat' === o.type)
				{
					o.rotation -= o.rotationSpeed;
					o.x -= o.speed;
					o.y += Math.sin(o.rotation) * o.speed;

					if (o.y < 0)
						o.y = 0;
					else if (o.y + o.height > canvas.canvas.height)
						o.y = canvas.canvas.height - o.height;
				}
				// Fighters's behavior
				// -------------------
				else if ('fighter' === o.type)
				{
					o.rotation = Math.atan2( player.y - o.y, player.x - o.x );
					// o.x += Math.cos(o.rotation) * o.speed;
					o.x -= o.speed;
					o.y += Math.sin(o.rotation) * (o.speed);

					if (o.y < 0)
						o.y = 0;
					else if (o.y + o.height > canvas.canvas.height)
						o.y = canvas.canvas.height - o.height;
				}

				if (o.x < 0)
				{
					this.remove(i);
					c--;
					continue;
				}

				// Checking obstacle collision with bullets
				// ----------------------------------------
				for (var j = 0, d = bullets.bullets.length; j < d; j++)
				{
					var b = bullets.bullets[j];
					
					if (utils.collide(o, b))
					{
						// Explosion
						this.addExplosion(o);

						// Collision trouvée
						bullets.remove(j);
						d--;
						this.remove(i);
						c--;

						// Son
						this.playSoundExplosion(o);
					}
				}

				// Checking obstacle collision with player
				// ---------------------------------------
				if (utils.collide(o, player))
				{
					// Explosion
					this.addExplosion(o);

					this.remove(i);
					c--;

					player.life -= config.OBSTACLE_DAMAGE;
					HUD.initiateFlashScreen('red');

					if (player.life <= 0)
					{
						window.gameOver = true;
						window.finalScore = player.score;
						sounds.theme.stop();
					}

					// Son
					this.playSoundExplosion(o);
				}

				// Checking obstacle collision with armageddon
				// -------------------------------------------
				for (var k = 0, e = armageddons.armageddons.length; k < e; k++)
				{
					var a = armageddons.armageddons[k];

					if (utils.collide(o, a))
					{
						// Explosion
						this.addExplosion(o);

						// Collision trouvée
						this.remove(i);
						c--;

						// Son
						this.playSoundExplosion(o);
					}
				}
			}
		};

		this.remove = function( i )
		{
			if (this.obstacles[i] && this.obstacles[i].img && this.obstacles[i].img instanceof IIG.Image)
				this.obstacles[i].img = IM.killInstance(this.obstacles[i].img);

			this.obstacles.splice(i, 1);
		};

		this.playSoundExplosion = function( elExploded )
		{
			if ('asteroid' === elExploded.type)
			{
				sounds.explosion_asteroid.play();
			}
			else if ('soldat' === elExploded.type)
			{
				sounds.explosion_soldat.play();
			}
			else if ('fighter' === elExploded.type)
			{
				sounds.explosion_fighter.play();
			}
		};

		this.addExplosion = function( elExploded )
		{
			if ('asteroid' === elExploded.type)
			{
				var img = IM.getInstance('img/explosion_asteroid');
				img.animation = new IIG.Animation({
					sWidth : 128,
					sHeight : 128,
					animByFrame : 2,
					iterations : 1
				});

				player.score += config.SCORE_GAIN_ASTEROID;
			}
			else if ('soldat' === elExploded.type)
			{
				var img = IM.getInstance('img/explosion_soldat');
				img.animation = new IIG.Animation({
					sWidth : 192,
					sHeight : 192,
					animByFrame : 2,
					iterations : 1
				});

				player.score += config.SCORE_GAIN_SOLDAT;
			}
			else if ('fighter' === elExploded.type)
			{
				var img = IM.getInstance('img/explosion_fighter');
				img.animation = new IIG.Animation({
					sWidth : 256,
					sHeight : 256,
					animByFrame : 2,
					iterations : 1
				});

				player.score += config.SCORE_GAIN_FIGHTER;
			}

			this.explosions.push({
				img : img,
				x : elExploded.x + elExploded.width*.5 - img.animation.sWidth*.5,
				y : elExploded.y + elExploded.height*.5 - img.animation.sHeight*.5,
				width : img.animation.sWidth,
				height : img.animation.sHeight
			});
		};

		this.renderExplosions = function()
		{
			for (var i = 0, c = this.explosions.length; i < c; i++)
			{
				var exp = this.explosions[i];

				if (exp.img.animationDestroyed)
				{
					exp.img = IM.killInstance(exp.img);
					this.explosions.splice(i, 1);
					c--;
					continue;
				}

				IM.drawImage(canvas.ctx, exp.img, exp.x, exp.y);
			}
		};
	}

	return new ObstaclesManager;

});