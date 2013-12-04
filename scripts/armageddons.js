define(['config', 'IIG', 'IM', 'sounds', 'utils', 'canvas', 'input'], function(config, IIG, IM, sounds, utils, canvas, input) {

	function Armageddon(params)
	{
		this.x = params.x;
		this.y = params.y;
		this.width = params.width;
		this.height = params.height;
		this.speed = params.speed;
		this.fireballs = [];
	}

	function FireBall(params)
	{
		this.img = params.img;
		this.x = params.x;
		this.y = params.y;
		this.width = params.width;
		this.height = params.height;
	}


	function ArmageddonsManager()
	{
		this.armageddons = [];
		this.lastFireTime = 0;

		this.add = function()
		{
			if (config.CURRENT_TIMING - this.lastFireTime > config.ARMAGEDDON_FIRE_DELAY)
			{
				var armageddon = new Armageddon({
					x : - config.ARMAGEDDON_FIREBALL_WIDTH,
					y : 0,
					width : config.ARMAGEDDON_FIREBALL_WIDTH,
					height : canvas.canvas.height,
					speed : config.ARMAGEDDON_SPEED
				});

				for (var i = -1, c = 2*(Math.ceil(canvas.canvas.height / config.ARMAGEDDON_FIREBALL_HEIGHT)); i <= c; i++)
				{
					var img = IM.getInstance('img/fireball');
					img.animation = new IIG.Animation({
						sWidth : config.ARMAGEDDON_FIREBALL_WIDTH,
						sHeight : config.ARMAGEDDON_FIREBALL_HEIGHT,
						sx : Math.round(utils.rand(0, 18)) * 128,
						animByFrame : 3
					});
					armageddon.fireballs.push(new FireBall({
						img : img,
						x : - config.ARMAGEDDON_FIREBALL_WIDTH,
						y : i * (config.ARMAGEDDON_FIREBALL_HEIGHT*.5),
						width : config.ARMAGEDDON_FIREBALL_WIDTH,
						height : config.ARMAGEDDON_FIREBALL_HEIGHT
					}));
				}

				this.armageddons.push( armageddon );

				this.lastFireTime = config.CURRENT_TIMING;

				if (sounds.armageddon.isPaused())
					sounds.armageddon.play();

				return true;
			}

			return false;
		};

		this.update = function()
		{
			for (var i = 0, c = this.armageddons.length; i < c; i++)
			{
				var a = this.armageddons[i];

				a.x += a.speed;

				if (a.x > canvas.canvas.width)
				{
					this.remove(i);
					c--;
				}

			}

			if (this.armageddons.length === 0 && !sounds.armageddon.isPaused())
				sounds.armageddon.pause();
		};

		this.render = function()
		{
			canvas.ctx.strokeStyle = '#000';
			for (var i = 0, c = this.armageddons.length; i < c; i++)
			{
				var a = this.armageddons[i];

				for (var j = 0, d = a.fireballs.length; j < d; j++)
				{
					var f = a.fireballs[j];

					IM.drawImage(canvas.ctx, f.img, a.x, f.y);
				}
			}
		};

		this.remove = function( i )
		{

			for (var j = 0, d = this.armageddons[i].fireballs.length; j < d; j++)
			{
				var f = this.armageddons[i].fireballs[j];

				f.img = IM.killInstance(f.img);
			}

			this.armageddons[i].fireballs.splice(0, this.armageddons[i].fireballs.length);
			this.armageddons.splice(i, 1);
		};
	}

	return new ArmageddonsManager;

});