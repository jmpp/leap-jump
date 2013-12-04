define(['config', 'IIG', 'IM', 'sounds', 'utils', 'canvas', 'input'], function(config, IIG, IM, sounds, utils, canvas, input) {

	function Star(params)
	{
		this.x = params.x;
		this.y = params.y;
		this.radius = params.radius;
		this.color = params.color;
		this.speed = params.speed;
		this.shadowBlur = params.shadowBlur;
	}

	function StarsManager()
	{
		this.stars = [];

		this.init = function()
		{
			var nb = config.STARS_NB;

			var radius, speed, color, shadowBlur;
			while (nb--)
			{
				// Computing radius
				radius = utils.rand(1, 4);
				// Computing speed (depends on radius)
				speed = radius;
				// Computing color
				color = '#ccc';
				// Computing shadowBlur (depends on radius)
				shadowBlur = radius*4;

				this.stars.push(new Star({
					x : utils.rand(0, canvas.canvas.width),
					y : utils.rand(0, canvas.canvas.height),
					radius : radius,
					color: color,
					speed : speed,
					shadowBlur : shadowBlur
				}));
			}
		};

		this.update = function()
		{
			for (var i = 0, c = this.stars.length; i < c; i++)
			{
				var s = this.stars[i];

				s.x -= s.speed;

				if (s.x < 0)
				{
					s.x = canvas.canvas.width;
				}
			}
		};

		this.render = function()
		{
			// canvas.ctx.fillStyle = 'rgba(0, 0, 0, .5)';
			// canvas.ctx.fillRect(0, 0, canvas.canvas.width, canvas.canvas.height);

			for (var i = 0, c = this.stars.length; i < c; i++)
			{
				var s = this.stars[i];

				canvas.ctx.shadowColor = s.color;
				canvas.ctx.shadowBlur = s.shadowBlur;
				canvas.ctx.fillStyle = s.color;
				canvas.ctx.beginPath();
				canvas.ctx.arc(s.x, s.y, s.radius, 0, Math.PI*2, true);
				canvas.ctx.closePath();
				canvas.ctx.fill();
			}

			canvas.ctx.shadowBlur = 0;
		};
	}

	var stars = new StarsManager();

	stars.init();

	return stars;

});