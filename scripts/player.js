define(['config', 'IIG', 'IM', 'sounds', 'utils', 'canvas', 'input', 'bullets', 'armageddons'], function(config, IIG, IM, sounds, utils, canvas, input, bullets, armageddons) {
	
	function Player()
	{
		this.img = null;
		this.x = 0;
		this.y = 0;
		this.width = 77;
		this.height = 100;
		this.speedX = config.PLAYER_SPEED_X;
		this.speedY = config.PLAYER_SPEED_Y;
		this.life = 100;
		this.score = 0;
		this.level = 1;

		// Weapons config
		this.weapon = 'shot'; // Can be 'shot', 'machinegun' or 'armageddon'
		this.weaponTiming = 'infinite'; // By default
		this.bulletInterval = config.SHOTS_INTERVAL;
		this.nbArmageddons = 1;

		// Jumping
		this.isJumping = false;
		this.jumpSpeedSet = false;

		// Shooting
		this.lastShotTime = 0;

		// Storing Leap Movement
		this.leapMovement = {
			left : false,
			right : false,
			top : false
		};
 
		this.init = function()
		{
			this.img = IM.getInstance('img/player');

			this.x = 10;
			this.y = canvas.canvas.height - this.height;
		};

		this.update = function()
		{
			this.movePlayer();
			this.fire();
			this.fireArmageddon();
		};

		this.render = function()
		{
			IM.drawImage(canvas.ctx, this.img, this.x, this.y);
		};

		this.movePlayer = function()
		{
			/*if (input.leap.swipes.length > 0)
			{
				if (input.leap.swipes[0].direction[1] > .7) // direction[1] is the Leap direction in y (between -1 and 1)
					this.leapMovement.up = true;

				if (input.leap.swipes[0].direction[0] > .7) // direction[0] is the Leap direction in x (between -1 and 1
					this.leapMovement.right = true;
				else if (input.leap.swipes[0].direction[0] < -.7)
					this.leapMovement.left = true;

				// Modifying speedX
				if (input.leap.swipes[0].state === 'stop')
				{
					if (this.speedX === - config.PLAYER_SPEED_X)
					{
						if (this.leapMovement.right)
							{ this.speedX = 0; console.log('right 0'); }
					}
					else if (this.speedX === 0)
					{
						if (this.leapMovement.right)
							{ this.speedX = config.PLAYER_SPEED_X; console.log('++'); }
						else if (this.leapMovement.left)
							{ this.speedX = - config.PLAYER_SPEED_X; console.log('--'); }
					}
					else if (this.speedX === config.PLAYER_SPEED_X)
					{
						if (this.leapMovement.left)
							{ this.speedX = 0; console.log('left 0'); }
					}
				}

				console.log(input.leap.swipes[0]);
			}
			else
			{
				this.leapMovement.left = false;
				this.leapMovement.right = false;
				this.leapMovement.top = false;
			}

			this.x += this.speedX;*/
			//console.log( config.LEAP_FRAME );
			if (input.leap.hands[0])
			{
				if (utils.getDistance( input.leap.hands[0].palm , {x : this.x + this.width * .5, y : this.y + this.height * .5} ) > 40)
				{
					var angle = Math.atan2( input.leap.hands[0].palm.y - this.y, input.leap.hands[0].palm.x - this.x );
					this.x += Math.cos( angle ) * this.speedX;
					this.y += Math.sin( angle ) * this.speedY;
				}
			}

			/**
			 * Handling jump
			**/

			/*this.isJumping = (!this.isJumping && (input.leap.swipes.length > 0 && input.leap.swipes[0].direction[1] > .7)) || this.isJumping;
			// this.isJumping = (!this.isJumping && input.kb.space) || this.isJumping; // Space

			if (this.isJumping)
			{
				if (!this.jumpSpeedSet) {
					this.speedY = config.JUMP_MAX_HEIGHT;
					this.jumpSpeedSet = true;
				}

				//this.isJumping = false;
				this.speedY -= config.GRAVITY;

				if (this.speedY < - config.JUMP_MAX_HEIGHT) {
					this.speedY = 0;
					this.isJumping = false;
					this.jumpSpeedSet = false;
					
					this.y = canvas.canvas.height - this.height;
				}
			}

			this.y -= this.speedY;*/


			// Correcting x and y position to fit in canvas
			if (this.x < 0)
				this.x = 0;
			else if (this.x + this.width > canvas.canvas.width)
				this.x = canvas.canvas.width - this.width;

			if (this.y < 0)
				this.y = 0;
			else if (this.y + this.height > canvas.canvas.height)
				this.y = canvas.canvas.height - this.height;

		};

		this.fire = function()
		{
			//console.log(config.LEAP_FRAME);
			if (input.leap.taps.length > 0 && config.CURRENT_TIMING - this.lastShotTime > this.bulletInterval) {
				
				if (this.weapon === 'shot')
				{
					bullets.add(
						'img/shot',
						this.x + this.width * .5,
						this.y + this.height * .5,
						0
					);
					// Sound
					sounds.shot.play();
				}
				else if (this.weapon === 'machinegun')
				{
					for (var i = Math.PI*.5, c = Math.PI / 20; i >= - Math.PI * .5; i -= c)
					{
						bullets.add(
							'img/machinegun',
							this.x + this.width * .5,
							this.y + this.height * .5,
							i
						);
					}
					// Sound
					sounds.machinegun.play();

					// Updating weaponTiming
					if (config.CURRENT_TIMING - this.weaponTiming > config.BONUS_MISSILE_DELAY)
					{
						this.weaponTiming = 'infinite';
						this.weapon = 'shot';
						this.bulletInterval = config.SHOTS_INTERVAL;
					}
				}

				this.lastShotTime = config.CURRENT_TIMING;
			}
		};

		this.fireArmageddon = function()
		{
			if (this.nbArmageddons > 0)
			{
				if (input.leap.swipes.length > 0 && input.leap.swipes[0].state === 'stop') // direction[0] is the Leap direction in x (between -1 and 1)
				{
					if (armageddons.add())
						this.nbArmageddons--;
				}
			}
		}
	}

	var player = new Player();
	player.init();

	return player;
});
