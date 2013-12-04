define(['config', 'IIG', 'IM', 'sounds', 'utils', 'canvas', 'input'], function(config, IIG, IM, sounds, utils, canvas, input) {

	function Bullet(params)
	{
		this.img = params.img;
		this.x = params.x;
		this.y = params.y;
		this.width = params.width;
		this.height = params.height;
		this.speed = config.BULLET_SPEED;
		this.direction = params.direction;
	}

	function BulletsManager()
	{
		this.bullets = [];

		this.add = function(spriteSheet, posX, posY, direction)
		{
			spriteSheet = spriteSheet || 'img/shot';
			// spriteSheet = 'img/shot';

			var sWidth, sHeight;
			if ('img/shot' === spriteSheet) {
				sWidth = 28;
				sHeight = 6;
			}
			else if ('img/machinegun' === spriteSheet) {
				sWidth = 32;
				sHeight = 14;
			}

			var img = IM.getInstance(spriteSheet);
			img.animation = new IIG.Animation({
				sWidth : sWidth,
				sHeight : sHeight,
				animByFrame : 15
			});

			this.bullets.push(new Bullet({
				img : img,
				x : posX,
				y : posY,
				width : img.animation.sWidth,
				height : img.animation.sHeight,
				direction : direction
			}));
		};

		this.update = function()
		{
			for (var i = 0, c = this.bullets.length; i < c; i++)
			{
				var b = this.bullets[i];

				b.x += Math.cos(b.direction) * b.speed;
				b.y += Math.sin(b.direction) * b.speed;

				if (b.x + b.width > canvas.canvas.width)
				{
					this.remove(i);
					c--;
				}
			}
		};

		this.render = function()
		{
			for (var i = 0, c = this.bullets.length; i < c; i++)
			{
				var b = this.bullets[i];

				// canvas.ctx.fillRect(b.x, b.y, b.width, b.height); // Core
				canvas.ctx.save();
				canvas.ctx.translate(b.x + b.width * .5, b.y + b.height * .5);
				canvas.ctx.rotate(b.direction);
				IM.drawImage(canvas.ctx, b.img, -b.width * .5, -b.height * .5, b.width, b.height);
				canvas.ctx.restore();
			}
		};

		this.remove = function( i )
		{
			if (this.bullets[i] && this.bullets[i].img && this.bullets[i].img instanceof IIG.Image)
				this.bullets[i].img = IM.killInstance(this.bullets[i].img);

			this.bullets.splice(i, 1);
		};
	}

	return new BulletsManager;

});