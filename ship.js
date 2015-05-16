/**
 * constructor for a ship
 *
 * @param maximum hull
 * @param maximum shields
 * @param hull meter ID
 * @param hull percentage ID
 * @param shields meter ID
 * @param sheilds percentage ID
 **/
function Ship(hull, shields, hullMeterId, shieldsMeterId)
{
	this.hull           = hull;
	this.shields        = shields;
	this.maxHull        = hull;
	this.maxShields     = shields;
	this.hullMeterId    = hullMeterId;
	this.shieldsMeterId = shieldsMeterId;
}

/**
 * damage a ship
 *
 * @param amount of damage to the hull
 * @param amount of damage to the shields
 **/
Ship.prototype.damage = function(hullDamage, shieldDamage)
{
	this.shields       = Math.max(this.shields - shieldDamage, 0);
	this.hull          = Math.max(this.hull    - hullDamage,   0);
	var hullPercent    = 100.0 * (this.hull / this.maxHull);
	var shieldsPercent = 100.0 * (this.shields / this.maxShields);
	this.setMeter(this.hullMeterId,    hullPercent);
	this.setMeter(this.shieldsMeterId, shieldsPercent);
}

/**
 * heal a ship's shields
 **/
Ship.prototype.emergencyToShields = function()
{
	var heal           = 1000.0 * (Math.random() / 2.0 + 0.5);
	var newShields     = Math.min(this.shields + heal, this.maxShields);
	var shieldsPercent = 100.0 * (newShields / this.maxShields);
	this.shields       = newShields;
	this.setMeter(this.shieldsMeterId, shieldsPercent);
}

/**
 * heal a ship's hull
 **/
Ship.prototype.engineeringTeam = function()
{
	var heal       = 10249.0 * (Math.random() / 2.0 + 0.5);
	var newHull     = Math.min(this.hull + heal, this.maxHull);
	var hullPercent = 100.0 * (newHull / this.maxHull);
	this.hull       = newHull;
	this.setMeter(this.hullMeterId, hullPercent);
}

/**
 * update a ship's status
 *
 * @param which meter to update
 * @param percentage to update to
 **/
Ship.prototype.setMeter = function(meterId, percentage)
{
	var meter = $("#" + meterId);
	meter.html(percentage.toFixed(2) + "%").attr("aria-valuenow", percentage).css("width", percentage + "%");
	if(percentage > 50.0)
	{
		meter.addClass("progress-bar-success");
		meter.removeClass("progress-bar-danger progress-bar-warning");
	}
	else if(percentage <= 50.0 && percentage > 25.0)
	{
		meter.addClass("progress-bar-warning");
		meter.removeClass("progress-bar-danger progress-bar-success");
	}
	else // if(percentage <= 25.0)
	{
		meter.addClass("progress-bar-danger");
		meter.removeClass("progress-bar-success progress-bar-warning");
	}
}
