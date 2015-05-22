/* global constants */
var ENTERPRISE_MAX_HULL    = 42900;
var ENTERPRISE_MAX_SHIELDS = 8432;
var ENTERPRISE_BASE_X      = 1157;
var ENTERPRISE_BASE_Y      = 278;
var WARBIRD_MAX_HULL       = 44550;
var WARBIRD_MAX_SHIELDS    = 9684;
var WARBIRD_BASE_X         = 50;
var WARBIRD_BASE_Y         = 187;

/* global variables */
var CANVAS     = null;
var ENTERPRISE = new Ship(ENTERPRISE_MAX_HULL, ENTERPRISE_MAX_SHIELDS, "hull", "shields");
var WARBIRD    = new Ship(WARBIRD_MAX_HULL, WARBIRD_MAX_SHIELDS, "romulanHull", "romulanShields");
var TURN       = true; // true = Federation, false = Romulan

var Canvas = function(canvasId) {
	this.canvasId = canvasId;
	this.stage = new createjs.Stage(this.canvasId);
	this.turn = true;
	this.preload = new createjs.LoadQueue(true);
	this.enterpriseImage = null;
	this.warbirdImage = null;

	this.preload.loadFile({id: "enterprise", src: "images/enterprise.png"});
	this.preload.loadFile({id: "warbird", src: "images/warbird.png"});
	this.preload.on("complete", this.loaded, this, true);
}

Canvas.prototype.loaded = function() {
	this.enterpriseImage = new createjs.Bitmap("images/enterprise.png");
	this.warbirdImage = new createjs.Bitmap("images/warbird.png");

	this.enterpriseImage.x = ENTERPRISE_BASE_X;
	this.enterpriseImage.y = ENTERPRISE_BASE_Y;

	this.warbirdImage.x = WARBIRD_BASE_X;
	this.warbirdImage.y = WARBIRD_BASE_Y;

	createjs.Ticker.on("tick", this.reset, this, true);
}

Canvas.prototype.reset = function() {
	this.stage.clear();
	this.stage.addChild(this.enterpriseImage);
	this.stage.addChild(this.warbirdImage);
	this.stage.update();

	//if(event !== undefined && event.type === "tick") {
	//	createjs.Ticker.removeAllEventListeners();
	//}
}

Canvas.prototype.update = function() {
	this.stage.update();
}

Canvas.prototype.drawPhaser = function(color, thickness, x1, y1, x2, y2) {
	//context.save();
	//context.beginPath();
	//context.moveTo(x1, y1);
	//context.lineWidth = width;
	//context.strokeStyle = style;
	//context.lineTo(x2, y2);
	//context.stroke();
	//context.closePath();
	//context.restore();
	//return(line);
	var line = new createjs.Shape();
	line.graphics.moveTo(x1, y1);
	line.graphics.setStrokeStyle(thickness);
	line.graphics.beginStroke(color);
	line.graphics.lineTo(x2, y2);
	line.graphics.endStroke();
	this.stage.addChild(line);
	console.log(this.stage);
	console.log(this.stage.numChildren + " === " + this.stage.children.length);
}

Canvas.prototype.phasers = function() {
	playAudio("phaser");

	//var context = getContext();
	//drawPhaser(context, "red", 5, 1640, 322, 500, 250);
	//drawPhaser(context, "red", 5, 1645, 325, 700, 350);
	//drawPhaser(context, "red", 5, 1650, 327, 750, 490);
	var color = "red";
	var thickness = 5;
	this.drawPhaser(color, thickness, 1640, 322, 500, 250);
	this.drawPhaser(color, thickness, 1645, 325, 700, 350);
	this.drawPhaser(color, thickness, 1650, 327, 750, 490);


	//var line = new createjs.Shape();
	//line.graphics.moveTo(1640, 322);
	//line.graphics.setStrokeStyle(thickness);
	//line.graphics.beginStroke(color);
	//line.graphics.lineTo(500, 250);
	//line.graphics.endStroke();
	//this.stage.addChild(line);

	//this.stage.removeAllChildren();
	//for(var i = 0; i < phasers.length; i++) {
	//	this.stage.addChild(phasers[i]);
	//}
	//this.stage.addChild(phasers[0]);
	// clear canvas
	//window.setTimeout(function()
	//{
	//	var canvas = document.getElementById("trekCanvas");
	//	context.clearRect(0, 0, canvas.width, canvas.height);
	//}, 1600);
	console.log(this);
	createjs.Ticker.on("tick", this.update, this, true);

	//createjs.Ticker.timingMode = createjs.Ticker.TIMEOUT;
	//createjs.Ticker.interval = 1600;
	//createjs.Ticker.on("tick", this.reset, this, true);

	// calculate base damage & roll for critical hit
	var baseDamage = 463.0 * (Math.random() / 2.0 + 0.5);
	if(Math.random() < 0.1)
	{
		baseDamage = baseDamage * 1.5;
	}

	// calculate actual damage values
	var hullDamage     = (1.0 - (WARBIRD.shields / WARBIRD.maxShields)) * baseDamage;
	var shieldDamage   = baseDamage * 1.3;

	// damage the Romulan Wardbird
	WARBIRD.damage(hullDamage, shieldDamage);
	//switchTurn();
}

/* set requesting of the animation frame; this lets browsers optimize the animation of the object in motion
 * source: http://www.html5canvastutorials.com/advanced/html5-canvas-animation-stage/ */
window.requestAnimFrame = (function(callback)
{
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(callback)
	{
		window.setTimeout(callback, 1000 / 60);
	};
})();

/* draws a torpedo centered at (x, y)
 * input: (pointer) pointer to canvas context
 * input: (string) color of the torpedo
 * input: (integer) length of the major axis
 * input: (integer) length of the minor axis
 * input: (integer) x coordinate of the center
 * input: (integer) y coordinate of the center
 * output: N/A */
function drawTorpedo(context, color, majorAxis, minorAxis, x, y)
{
	// define gradient to shade the torpedo
	var gradient = context.createRadialGradient(x + majorAxis, y, 0.7 * minorAxis, x + majorAxis, y, majorAxis);
	gradient.addColorStop(0.0, color);
	gradient.addColorStop(1.0, "black");

	// create two half bezier curves along the axes to fill the full torpedo
	context.save();
	context.beginPath();
	context.moveTo(x, y);
	context.fillStyle = gradient;
	context.bezierCurveTo(
				x,                   y + minorAxis,
				x + (2 * majorAxis), y + minorAxis,
				x + (2 * majaorAxis), y
						);
	context.moveTo(x, y);
	context.bezierCurveTo(
				x,                   y - minorAxis,
				x + (2 * majorAxis), y - minorAxis,
				x + (2 * majorAxis), y
						);
	context.fill();
	context.restore();
}

/* draws a beam from (x1, y1) to (x2, y2)
 * input: (pointer) pointer to canvas context
 * input: (string) style to draw the beam in
 * input: (integer) width of the beam
 * input: (integer) starting x coordinate
 * input: (integer) starting y coordinate
 * input: (integer) ending x coordinate
 * input: (integer) ending y coordinate
 * output: N/A */
function drawPhaser(context, style, width, x1, y1, x2, y2)
{
	context.save();
	context.beginPath();
	context.moveTo(x1, y1);
	context.lineWidth = width;
	context.strokeStyle = style;
	context.lineTo(x2, y2);
	context.stroke();
	context.closePath();
	context.restore();
}

/* animates one frame of plasma torpedoes: from (750, 490) to (1725, 275)
 * input: (pointer) pointer to canvas context
 * input: (double) x component of the unit vector
 * input: (double) y component of the unit vector
 * input: (integer) start time of the firing sequence
 * output: N/A */
function firePlasmas(context, x0, y0, startTime)
{
	var time = (new Date()).getTime() - startTime;

	// calculate the new position
	var newX = Math.floor(750 + (time * x0));
	var newY = Math.floor(490 + (time * y0));

	// clear canvas
	canvas = document.getElementById("trekCanvas");
	context.clearRect(0, 0, canvas.width, canvas.height);
	drawTorpedo(context, "lime", 28, 24, newX, newY);

	// request a new frame if we haven't hit yet
	if(newX < 1725)
	{
		// request new frame
		requestAnimFrame(function()
		{
			firePlasmas(context, x0, y0, startTime);
		});
	}
}

/* animates one frame of quantum torpedoes: from (1460, 415) to (725, 400)
 * input: (pointer) pointer to canvas context
 * input: (double) x component of the unit vector
 * input: (double) y component of the unit vector
 * input: (integer) start time of the firing sequence
 * output: N/A */
function fireQuantums(context, x0, y0, startTime)
{
	var time = (new Date()).getTime() - startTime;

	// calculate the new position
	var newX = Math.floor(1460 - (time * x0));
	var newY = Math.floor(415  - (time * y0));

	// clear canvas
	canvas = document.getElementById("trekCanvas");
	context.clearRect(0, 0, canvas.width, canvas.height);
	drawTorpedo(context, "cyan", 23, 15, newX, newY);

	// request a new frame if we haven't hit yet
	if(newX > 725)
	{
		// request new frame
		requestAnimFrame(function()
		{
			fireQuantums(context, x0, y0, startTime);
		});
	}
}

/* worker function to retrieve the canvas context
 * input: N/A
 * output: (pointer) pointer to canvas context */
function getContext()
{
	var canvas  = document.getElementById("trekCanvas");
	var context = canvas.getContext("2d");
	return(context);
}

/* worker function to play an audio tag
 * input: (string) audio tag to play
 * output: N/A */
function playAudio(audioId)
{
	document.getElementById(audioId).play();
}

/* callback function to raise a red alert
 * input: N/A
 * output: N/A */
function redAlert()
{
	playAudio("red_alert");

	// flash the background of the canvas to be red
	var canvas = document.getElementById("trekCanvas");
	canvas.style.webkitAnimationName = "redAlert";
	canvas.style.webkitAnimationDuration = "2.5s";
	canvas.style.webkitAnimationIterationCount = 3;

	// reset the animation of the canvas
	window.setTimeout(function()
	{
		canvas.style.webkitAnimationName = null;
	}, 7500);
}

/* callback function to fire phasers
 * input: N/A
 * output: N/A */
function phasers()
{
	playAudio("phaser");

	var context = getContext();
	drawPhaser(context, "red", 5, 1640, 322, 500, 250);
	drawPhaser(context, "red", 5, 1645, 325, 700, 350);
	drawPhaser(context, "red", 5, 1650, 327, 750, 490);

	// clear canvas
	window.setTimeout(function()
	{
		var canvas = document.getElementById("trekCanvas");
		context.clearRect(0, 0, canvas.width, canvas.height);
	}, 1600);

	// calculate base damage & roll for critical hit
	var baseDamage = 463.0 * (Math.random() / 2.0 + 0.5);
	if(Math.random() < 0.1)
	{
		baseDamage = baseDamage * 1.5;
	}

	// calculate actual damage values
	var hullDamage     = (1.0 - (WARBIRD.shields / WARBIRD.maxShields)) * baseDamage;
	var shieldDamage   = baseDamage * 1.3;

	// damage the Romulan Wardbird
	WARBIRD.damage(hullDamage, shieldDamage);
	switchTurn();
}

/* callback function to fire quantum torpedoes
 * input: N/A
 * output: N/A */
function quantums()
{
	var context = getContext();
	playAudio("quantum");

	// unit vector of <735, 15>
	var x0 = 49.0 / Math.sqrt(2402.0);
	var y0 = 1 / Math.sqrt(2402.0);

	// fire first quantum
	window.setTimeout(function()
	{
		var startTime = (new Date()).getTime();
		fireQuantums(context, x0, y0, startTime);
	}, 50);

	// fire second quantum
	window.setTimeout(function()
	{
		var startTime = (new Date()).getTime();
		fireQuantums(context, x0, y0, startTime);
	}, 800);

	// fire third quantum
	window.setTimeout(function()
	{
		var startTime = (new Date()).getTime();
		fireQuantums(context, x0, y0, startTime);
	}, 1600);

	// clear canvas
	window.setTimeout(function()
	{
		var canvas = document.getElementById("trekCanvas");
		context.clearRect(0, 0, canvas.width, canvas.height);
	}, 2400);

	// calculate base damage & roll for critical hit
	var baseDamage = 3975.0 * (Math.random() / 2.0 + 0.5);
	if(Math.random() < 0.1)
	{
		baseDamage = baseDamage * 1.5;
	}

	// calculate actual damage values
	var hullDamage     = (1.0 - (WARBIRD.shields / WARBIRD.maxShields)) * baseDamage;
	var shieldDamage   = baseDamage / 12.0;

	// damage the Romulan Wardbird
	WARBIRD.damage(hullDamage, shieldDamage);
	switchTurn();
}

/* callback function to raise a Romulan red alert
 * input: N/A
 * output: N/A */
function romulanRedAlert()
{
	playAudio("romulan_red_alert");

	// flash the background of the canvas to be red
	var canvas = document.getElementById("trekCanvas");
	canvas.style.webkitAnimationName = "romulanRedAlert";
	canvas.style.webkitAnimationDuration = "1.4s";
	canvas.style.webkitAnimationIterationCount = 3;

	// reset the animation of the canvas
	window.setTimeout(function()
	{
		canvas.style.webkitAnimationName = null;
	}, 4200);
}

/* callback function to fire disruptors
 * input: N/A
 * output: N/A */
function disruptors()
{
	playAudio("romulan_disruptor");

	var context = getContext();
	drawPhaser(context, "lime", 10, 750, 490, 1725, 275);
	drawPhaser(context, "lime", 5,  650, 275, 1725, 275);
	drawPhaser(context, "lime", 5,  200, 450, 1725, 275);

	// clear canvas
	window.setTimeout(function()
	{
		var canvas = document.getElementById("trekCanvas");
		context.clearRect(0, 0, canvas.width, canvas.height);
	}, 4600);

		// calculate base damage & roll for critical hit
	var baseDamage = 349.0 * (Math.random() / 2.0 + 0.5);
	if(Math.random() < 0.1)
	{
		baseDamage = baseDamage * 1.5;
	}

	// calculate actual damage values
	var hullDamage     = (1.0 - (ENTERPRISE.shields / ENTERPRISE.maxShields)) * baseDamage;
	var shieldDamage   = baseDamage * 1.5;

	// damage the Enterprise
	ENTERPRISE.damage(hullDamage, shieldDamage);
	switchTurn();
}

/* callback function to fire plasma torpedoes
 * input: N/A
 * output: N/A */
function plasmas()
{
	var context = getContext();
	playAudio("romulan_torpedo");

	// unit vector of <975, 215>
	var x0 = 195.0 / Math.sqrt(39874.0);
	var y0 = -43.0 / Math.sqrt(39874.0);

	// fire first plasma
	window.setTimeout(function()
	{
		var startTime = (new Date()).getTime();
		firePlasmas(context, x0, y0, startTime);
	}, 50);

	// fire second plasma
	window.setTimeout(function()
	{
		var startTime = (new Date()).getTime();
		firePlasmas(context, x0, y0, startTime);
	}, 715);

	// fire third plasma
	window.setTimeout(function()
	{
		var startTime = (new Date()).getTime();
		firePlasmas(context, x0, y0, startTime);
	}, 1430);

	// clear canvas
	window.setTimeout(function()
	{
		var canvas = document.getElementById("trekCanvas");
		context.clearRect(0, 0, canvas.width, canvas.height);
	}, 2500);

	// calculate base damage & roll for critical hit
	var baseDamage = 2805.0 * (Math.random() / 2.0 + 0.5);
	if(Math.random() < 0.15)
	{
		baseDamage = baseDamage * 1.5;
	}

	// calculate actual damage values
	var hullDamage   = (1.0 - (ENTERPRISE.shields / ENTERPRISE.maxShields)) * baseDamage;
	var shieldDamage = baseDamage / 8.0;

	// damage the Enterprise
	ENTERPRISE.damage(hullDamage, shieldDamage);
	switchTurn();
}

function switchTurn()
{
	TURN = !TURN;

	var federationButtons = document.getElementsByClassName("lcars");
	var romulanButtons    = document.getElementsByClassName("romulan");

	for(var i = 0; i < federationButtons.length; i++)
	{
		federationButtons[i].disabled = TURN;
	}
	for(var i = 0; i < romulanButtons.length; i++)
	{
		romulanButtons[i].disabled = !TURN;
	}
}
