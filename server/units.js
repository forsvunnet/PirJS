


var definitions = {
  defender: [{
    life: 10,
    attack: 1,
    aggro: 3,
    range: 1,
  }],
  attacker: [{
    life: 10,
    attack: 2,
    aggro: 1,
    range: 1,
  },{
    life: 10,
    attack: 2,
    aggro: 1,
    range: 2,
  },{
    life: 10,
    attack: 2,
    aggro: 1,
    range: 3,
  }],
  healer: [{
    life: 5,
    attack: 0.5,
    aggro: 1.5,
    range: 1,
  }],
};


module.exports = {
  fight: function( ) {
    var unit = this;
    if ( 0 > unit.data.life )
      unit.deactive = true;

    // Return if the unit is dead
    if ( unit.deactive )
      return;

    // Loop through all units to get viable aquisitions
    for ( var pid in unit.room.players ) {
      // Skip self
      if ( pid === unit.pid )
        continue;

      var units = unit.room.players.units;
      for ( var i = 0; i < units.length; i++ ) {
        // Skip deactive units
        if ( units[i].deactive )
          continue;
        units[i].data.life -= unit.data.attack;
      }
    }
  },
  setup: function( unit ) {
    unit.fight = this.fight;
    unit.deactive = false;
    unit.data = definitions[unit.name][unit.type-1];
  }
};

