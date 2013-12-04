define(['config', 'IIG', 'IM', 'utils', 'canvas', 'player'], function(config, IIG, IM, utils, canvas, player) {
	
	function HUD()
	{
		// Player's lifebar
		this.playerLifebar = {
			x : 0,
			y : 0,
			width : canvas.canvas.width,
			height : 5,
			hue : 120 // green
		};

		// Flash screen
		this.flashScreen = false;
		this.flashScreenAlpha = 1;
		this.red = 255;
		this.green = 0;
		this.blue = 0;

		// Notifications
		this.notifications = [];
		this.notifiedForTap = false;
		this.notifiedForBonus = false;
		this.notifiedForArmageddonImg = false;


		this.addNotification = function(type, posX, posY, notification, maxTime)
		{
			if (type === 'tapShot')
			{
				if (this.notifiedForTap)
					return false;
				else
					this.notifiedForTap = true;
			}
			else if (type === 'bonus')
			{
				if (this.notifiedForBonus)
					return false;
				else
					this.notifiedForBonus = true;
			}
			else if (type === 'armageddon_img')
			{
				if (this.notifiedForArmageddonImg)
					return false;
				else
					this.notifiedForArmageddonImg = true;
			}

			// Delete all notifs
			// =================
			for (var i = 0, c = this.notifications.length; i < c; i++)
			{
				var n = this.notifications[i];

				if (n.notification instanceof IIG.Image)
					n.notification = IM.killInstance(n.notification);
				this.notifications.splice(i, 1);
				c--;
			}

			// Adding new one
			// ==============

			var width = 0, height = 0;
			if (notification instanceof IIG.Image)
			{
				width = notification.width;
				height = notification.height;
			}

			this.notifications.push({
				notification : notification,
				x : posX,
				y : posY,
				width : width,
				height : height,
				maxTime : maxTime,
				timeAdded : config.CURRENT_TIMING,
				alpha : .7
			});
		};

		this.update = function()
		{
			/**
			 * Player's lifebar
			**/

			var playerLifebarWidth = ( (player.life * canvas.canvas.width) / 100);
			// this.playerLifebar.width = playerLifebarWidth;

			if (this.playerLifebar.width < playerLifebarWidth)
			{
				this.playerLifebar.width += 5;
				if (this.playerLifebar.width > playerLifebarWidth)
					this.playerLifebar.width = playerLifebarWidth;
			}
			else if (this.playerLifebar.width > playerLifebarWidth)
			{
				this.playerLifebar.width -= 5;
				if (this.playerLifebar.width < playerLifebarWidth)
					this.playerLifebar.width = playerLifebarWidth;
			}
				
			
			// Computing player's lifebar hue..
			this.playerLifebar.hue = Math.round(( (player.life * 120) / 100));

			/**
			 * Flash screen
			**/

			if (this.flashScreen)
			{
				this.flashScreenAlpha -= .15;

				if (this.flashScreenAlpha <= 0)
				{
					this.flashScreenAlpha = 1;
					this.flashScreen = false;
				}
			}

			/**
			 * Notifications
			**/

			for (var i = 0, c = this.notifications.length; i < c; i++)
			{
				var n = this.notifications[i];

				// console.log (config.CURRENT_TIMING+' - '+n.timeAdded+' > '+n.maxTime);
				if (config.CURRENT_TIMING - n.timeAdded > n.maxTime)
				{
					n.alpha -= .02;

					if (n.alpha <= 0)
					{
						if (n.notification instanceof IIG.Image)
							n.notification = IM.killInstance(n.notification);
						this.notifications.splice(i, 1);
						c--;
					}
				}
			}
		};

		this.render = function()
		{
			/**
			 * Player's lifebar
			**/
			canvas.ctx.fillStyle = 'hsla('+ this.playerLifebar.hue +', 100%, 50%, .75)';
			canvas.ctx.strokeStyle = 'hsla('+ this.playerLifebar.hue +', 100%, 30%, 1)';
			canvas.ctx.fillRect(this.playerLifebar.x, this.playerLifebar.y, this.playerLifebar.width, this.playerLifebar.height);
			canvas.ctx.strokeRect(this.playerLifebar.x, this.playerLifebar.y, this.playerLifebar.width, this.playerLifebar.height);

			/**
			 * Nb of armageddons
			**/

			canvas.ctx.textAlign = 'left';
			canvas.ctx.textBaseline = 'top';
			canvas.ctx.font = '32pt silkscreennormal';
			canvas.ctx.fillText('Nb. Armageddons : ' + player.nbArmageddons, 10, 10);

			/**
			 * Player's score
			**/

			canvas.ctx.textAlign = 'right';
			canvas.ctx.textBaseline = 'top';
			canvas.ctx.font = '32pt silkscreennormal';
			canvas.ctx.fillText('Score : ' + player.score, canvas.canvas.width - 10, 10);

			/**
			 * Flash screen
			**/
			if (this.flashScreen)
			{
				canvas.ctx.fillStyle = 'rgba('+this.red+', '+this.green+', '+this.blue+', '+ this.flashScreenAlpha +')';
				canvas.ctx.fillRect(0, 0, canvas.canvas.width, canvas.canvas.height);
			}

			/**
			 * Notifications
			**/
			for (var i = 0, c = this.notifications.length; i < c; i++)
			{
				var n = this.notifications[i];

				canvas.ctx.globalAlpha = n.alpha;
				if (n.notification instanceof IIG.Image)
					IM.drawImage(canvas.ctx, n.notification, n.x, n.y);
				else
				{
					canvas.ctx.textAlign = 'center';
					canvas.ctx.textBaseline = 'middle';
					canvas.ctx.font = '48pt silkscreennormal';
					canvas.ctx.fillStyle = '#f80';
					canvas.ctx.fillText(n.notification, n.x, n.y);
				}
				canvas.ctx.globalAlpha = 1;
			}
		};

		this.initiateFlashScreen = function(color)
		{
			switch (color)
			{
				case 'red':
					this.red = 255;
					this.green = 0;
					this.blue = 0;
					break;
				case 'green':
					this.red = 0;
					this.green = 255;
					this.blue = 0;
					break;
			}
			this.flashScreen = true;
			this.flashScreenAlpha = 1;
		}
	}

	var hud = new HUD();

	return hud;
});