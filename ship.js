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
function Ship(hull, shields, hullId, hullMeterId, shieldsId, shieldsMeterId)
{
    this.hull           = hull;
    this.shields        = shields;
    this.maxHull        = hull;
    this.maxShields     = shields;
    this.hullId         = hullId;
    this.hullMeterId    = hullMeterId;
    this.shieldsId      = shieldsId;
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
    this.shields       = Math.max(this.shields   - shieldDamage, 0);
    this.hull          = Math.max(this.hull      - hullDamage,   0);
    var hullPercent    = 100.0 * (this.hull / this.maxHull);
    var shieldsPercent = 100.0 * (this.shields / this.maxShields);
    document.getElementById(this.hullId).style.width = hullPercent + "%";
    document.getElementById(this.shieldsId).style.width = shieldsPercent + "%";
    this.colorMeter(this.hullMeterId,    hullPercent);
    this.colorMeter(this.shieldsMeterId, shieldsPercent);
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
    document.getElementById(this.shieldsId).style.width = shieldsPercent + "%";
    this.colorMeter(this.shieldsMeterId, shieldsPercent);
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
    document.getElementById(this.hullId).style.width = hullPercent + "%";
    this.colorMeter(this.hullMeterId, hullPercent);
}

/**
 * update a ship's status
 *
 * @param which meter to update
 * @param percentage to update to
 **/
Ship.prototype.colorMeter = function(meterId, percentage)
{
    if(percentage > 50.0)
    {
        document.getElementById(meterId).className = "meter";
    }
    else if(percentage <= 50.0 && percentage > 25.0)
    {
        document.getElementById(meterId).className = "meter orange";
    }
    else // if(percentage <= 25.0)
    {
        document.getElementById(meterId).className = "meter red";
    }
}
