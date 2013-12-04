define(['buzz'], function(buzz) {
	
	var sounds = {
		theme : new buzz.sound("sounds/theme", {
					formats: [ "ogg", "mp3", "wav" ],
					preload: true,
					autoplay: false,
					loop: true
				}),

		shot : new buzz.sound("sounds/shot", {
					formats: [ "ogg", "mp3", "wav" ],
					preload: true,
					autoplay: false,
					loop: false
				}),

		explosion : new buzz.sound("sounds/explosion", {
					formats: [ "ogg", "mp3", "wav" ],
					preload: true,
					autoplay: false,
					loop: false
				}),

		damage : new buzz.sound("sounds/damage", {
					formats: [ "ogg", "mp3", "wav" ],
					preload: true,
					autoplay: false,
					loop: false
				}),

		powerup : new buzz.sound("sounds/powerup", {
					formats: [ "ogg", "mp3", "wav" ],
					preload: true,
					autoplay: false,
					loop: false
				}),

		machinegun : new buzz.sound("sounds/machinegun", {
					formats: [ "ogg", "mp3", "wav" ],
					preload: true,
					autoplay: false,
					loop: false
				}),

		armageddon : new buzz.sound("sounds/armageddon", {
					formats: [ "ogg", "mp3", "wav" ],
					preload: true,
					autoplay: false,
					loop: true
				}),

		explosion_asteroid : new buzz.sound("sounds/explosion_asteroid", {
					formats: [ "ogg", "mp3", "wav" ],
					preload: true,
					autoplay: false,
					loop: false
				}),

		explosion_soldat : new buzz.sound("sounds/explosion_soldat", {
					formats: [ "ogg", "mp3", "wav" ],
					preload: true,
					autoplay: false,
					loop: false
				}),

		explosion_fighter : new buzz.sound("sounds/explosion_fighter", {
					formats: [ "ogg", "mp3", "wav" ],
					preload: true,
					autoplay: false,
					loop: false
				})
	};

	return sounds;

});