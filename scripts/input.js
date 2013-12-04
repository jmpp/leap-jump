define(['config', 'canvas', 'utils'], function(config, canvas, utils) {
	
	function Input()
	{
		this.mouse = {
			x : 0,
			y : 0,
			w : 0,
			h : 0,
			down : false
		};

		this.kb = {
			up : 0,
			right : 0,
			down : 0,
			left : 0,
			space : 0
		};

		this.leap = {
			taps : [],
			swipes : [],
			hands : [], // will contain a 'fingers' and 'palm' objects with both x, y, z positions
			circles : []
		};

		this.lastFinger = {};
	}

	Input.prototype.update = function()
	{
		this.updatePositions();
		this.handleGestures();
	}

	/**
	 * Mouse events
	**/

	Input.prototype.getMouseMove = function(event)
	{
		this.mouse.x = event.clientX;
		this.mouse.y = event.clientY;

		event.preventDefault();
		event.stopPropagation();
	};

	Input.prototype.getMouseDown = function(event)
	{
		this.getMouseMove(event); // DRY
		this.mouse.down = true;
	};

	Input.prototype.getMouseUp = function(event)
	{
		this.getMouseMove(event); // DRY
		this.mouse.down = false;
	};

	/**
	 * Keyboard events
	**/

	Input.prototype.getKeyDown = function(event)
	{
		var key = event.which || event.keyCode;

		this.kb.up 		= key == 38 || key == 90 || key == 87 ? 1 : this.kb.up;
		this.kb.right 	= key == 39 || key == 68 ? 1 : this.kb.right;
		this.kb.down 	= key == 40 || key == 83 ? 1 : this.kb.down;
		this.kb.left 	= key == 37 || key == 81 || key == 65 ? 1 : this.kb.left;
		this.kb.space 	= key == 32 ? 1 : this.kb.space;

		// event.preventDefault();
	};

	Input.prototype.getKeyUp = function(event)
	{
		var key = event.which || event.keyCode;

		input.kb.up 	= key == 38 || key == 90 || key == 87 ? 0 : input.kb.up;
		input.kb.right 	= key == 39 || key == 68 ? 0 : input.kb.right;
		input.kb.down 	= key == 40 || key == 83 ? 0 : input.kb.down;
		input.kb.left 	= key == 37 || key == 81 || key == 65  ? 0 : input.kb.left;
		input.kb.space 	= key == 32 ? 0 : input.kb.space;

		// event.preventDefault();
	};

	/**
	 * Leap Motion gestures
	**/

	Input.prototype.updatePositions = function()
	{
		var frame = config.LEAP_FRAME;

		for (var i = 0, c = frame.hands.length; i < c; i++)
		{
			var hand = frame.hands[i];
			var palmPosition = utils.leapToScene( canvas.canvas, frame, hand.stabilizedPalmPosition );

			var handObject = {
				palm : {
					id : hand.id,
					x : palmPosition.x,
					y : palmPosition.y
				},
				fingers : []
			};

			for (var j = 0, d = hand.fingers.length; j < d; j++)
			{
				var finger = hand.fingers[j];
				var fingerPosition = utils.leapToScene( canvas.canvas, frame, finger.stabilizedTipPosition );

				handObject.fingers.push({
					id : finger.id,
					x : fingerPosition.x,
					y : fingerPosition.y
				});
			}

			this.leap.hands.push( handObject );
		}
	};

	Input.prototype.handleGestures = function()
	{
		//console.log(config.LEAP_FRAME.gestures);

		if (config.LEAP_FRAME.gestures.length === 0)
			return false;

		var gestures = config.LEAP_FRAME.gestures;

		for (var i = 0, c = gestures.length; i < c; i++)
		{
			var gesture = gestures[i];
			var type = gesture.type;

			// console.log( gesture );

			switch (type)
			{
				case 'circle' :
					this.onCircle( gesture );
					/*if (gesture.state === 'stop')
						this.leap.circles.push( gesture );*/
					break;

				case 'swipe' :
					this.leap.swipes.push( gesture );
					break;

				case 'screenTap' :
					this.leap.taps.push( gesture );
					break;

				case 'keyTap' :
					this.leap.taps.push( gesture );
					break;
			}
		}
	};

	Input.prototype.onCircle = function( gesture )
	{
		if (!this.leap.circles[ gesture.id ])
			this.leap.circles[ '' + gesture.id ] = [];

		if (gesture.state === 'stop' || gesture.progress > 2.5)
		{
			/*for (var j = 0, d = this.leap.hands.length; j < d; j++)
			{
				var hand = this.leap.hands[j];

				for (var k = 0, e = hand.fingers.length; k < e; k++)
				{
					var finger = hand.fingers[k];

					delete this.lastFinger[ '' + finger.id ];
				}
			}*/

			//delete this.leap.circles[ '' + gesture.id ];
			if (this.leap.circles['' + gesture.id][0])
				this.leap.circles['' + gesture.id][0].reset = true;
		}
		else if (gesture.state === 'update')
		{
			// console.log( gesture );

			for (var j = 0, d = this.leap.hands.length; j < d; j++)
			{
				var hand = this.leap.hands[j];

				for (var k = 0, e = hand.fingers.length; k < e; k++)
				{
					var finger = hand.fingers[k];

					// console.log( finger.id + ' === ' + gesture.pointableIds[0] );
					if (finger.id === gesture.pointableIds[0])
					{
						this.leap.circles[ '' + gesture.id ].push({
							id : finger.id,
							x : finger.x,
							y : finger.y,
							prevX : this.lastFinger[ '' + finger.id ] ? this.lastFinger[ '' + finger.id ].x : finger.x,
							prevY : this.lastFinger[ '' + finger.id ] ? this.lastFinger[ '' + finger.id ].y : finger.y,
							reset : false,
							timestamp : config.CURRENT_TIMING
						});

						this.lastFinger[ '' + finger.id ] = {
							x : finger.x,
							y : finger.y
						};
					}
				}
			}
		}
		
	};

	Input.prototype.reset = function()
	{
		// console.log(this.lastFinger);
		this.leap.taps.splice(0, this.leap.taps.length);
		this.leap.swipes.splice(0, this.leap.swipes.length);
		// this.leap.hands.fingers.splice(0, this.leap.hands.fingers.length);
		this.leap.hands.splice(0, this.leap.hands.length);
		// this.leap.circles.splice(0, this.leap.circles.length);
		this.leap.taps = [];
		this.leap.swipes = [];
		this.leap.hands = [];
		// this.leap.circles = [];

		// Reset circles events which have expired
		
		var nb = 0;
		for (var j in this.leap.circles)
		{
			var circle = this.leap.circles[''+j];

			// if (nb === 0)
			// 	console.log (circle[0]);

			if (circle[0])
			{
				nb++;
				if (circle[0].reset === true || config.CURRENT_TIMING - circle[0].timestamp > 2000)
				{
					delete this.leap.circles[ '' + j ];
					continue;
				}
			}
		}

		// console.log(nb);

		if (nb === 0)
		{
			this.lastFinger = [];
		}
	};

	var input = new Input;

	// window.document.addEventListener('mousemove', input.getMouseMove, false);
	// window.document.addEventListener('mousedown', input.getMouseDown, false);
	// window.document.addEventListener('mouseup', input.getMouseUp, false);

	window.document.addEventListener('keydown', input.getKeyDown.bind(input), false);
	window.document.addEventListener('keyup', input.getKeyUp.bind(input), false);

	return input;
});