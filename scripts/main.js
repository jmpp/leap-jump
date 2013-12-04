
require.config({
	paths: {
		IIG : '../lib/IIG',
		buzz : '../lib/buzz'
	},
	shim: {
		IIG: {
			"exports": "IIG",
			"deps": []
		},
		buzz: {
			"exports": "buzz",
			"deps": []
		}
	}
});

var LeapController = new Leap.Controller({
	frameEventName : 'animationFrame',
	enableGestures : true
});

// Eurk ! It suxx, but it's 2:00am and I wanna go to bed
window.gameOver = false;
window.finalScore = 0;
window.GameObject = null;

require(['IM', 'sounds'], function(IM, sounds) {
	
	// Fonction d'initialisation (lorsque les assets sont chargés)
	function init()
	{
		require(['game', 'menu', 'gameover', 'config', 'input'], function(game, menu, gameover, config, input) {
			window.GameObject = menu;
			var frameId;
			var leapFrame;

			LeapController.connect();
			
			// function run(t)
			LeapController.on('animationFrame', function(frame)
			{
				//if (frameId < 20)
					//console.log( frame.timestamp );
				//frameId++;

				config.LEAP_FRAME = frame;

				config.CURRENT_TIMING = frame.timestamp * .001; // not really reliable, but enough for demo, lol !

				// Did I write that ?! ... oh my god !
				if (window.gameOver)
				{
					GameObject = gameover;
				}

				GameObject.update();
				GameObject.render();

				input.reset();

				// Sprites instances monitoring
				//console.log(IM._spritesInstances.length);

				// frameId = requestAnimationFrame(run);

			});

			GameObject.init();
			//run();
		});
	}

	// Ajout des images...
	IM.add('img/player.png');
	IM.add('img/fireball.png');
	IM.add('img/asteroid_1.png');
	IM.add('img/asteroid_2.png');
	IM.add('img/asteroid_3.png');
	IM.add('img/asteroid_4.png');
	IM.add('img/soldat.png');
	IM.add('img/fighter.png');
	IM.add('img/shot.png');
	IM.add('img/machinegun.png');
	IM.add('img/explosion_asteroid.png');
	IM.add('img/explosion_soldat.png');
	IM.add('img/explosion_fighter.png');
	IM.add('img/notif_tapToShot.png');
	IM.add('img/notif_encircleBonus.png');
	IM.add('img/notif_armageddon.png');
	IM.add('img/bonus_life.png');
	IM.add('img/bonus_machinegun.png');
	IM.add('img/bonus_armageddon.png');

	// Lancement du chargement des images...
	IM.loadAll(init);

});
