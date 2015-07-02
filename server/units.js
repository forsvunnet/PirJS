

/**
 * WARNING! MUST ONLY BE SIMPLE INTEGERS OR STRINGS
 * - OR - You will have to deal with inheritance!
 */
var definitions = {
  defender: [{
    life: 10,
    armor: 2,
    attack: 1,
    aggro: 3,
    range: 1,
  }],
  attacker: [{
    life: 10,
    armor: 0.8,
    attack: 2,
    aggro: 1,
    range: 1,
  },{
    life: 10,
    armor: 1,
    attack: 2,
    aggro: 1,
    range: 2,
  },{
    life: 10,
    armor: 1.1,
    attack: 2,
    aggro: 1,
    range: 3,
  }],
  healer: [{
    life: 5,
    armor: 1,
    attack: 0.5,
    aggro: 1.5,
    range: 1,
  }],
};


module.exports = {
  fight: function( ) {
    var unit = this;
    var actions = [];

    // Return if the unit is dead
    if ( unit.deactive )
      return actions;

    // console.log( unit.uid + ' is preparing to fight!' );

    // Loop through all units to get viable aquisitions
    for ( var pid in unit.room.players ) {
      // Skip self
      if ( pid == unit.pid )
        continue;

      var units = unit.room.players[pid].units;
      for ( var i = 0; i < units.length; i++ ) {
        // Skip deactive units
        if ( units[i].deactive )
          continue;

        // Add a bit of random to our lives
        if ( Math.random() > 0.1 )
          continue; // 10% chance of attack

        var target = units[i];
        var damage = unit.data.attack;

        damage += ( Math.random() * damage ) / 2;
        damage /= 50;
        damage /= target.data.armor;

        // A succesfull attack
        target.data.life -= damage;
        var life_pst = 0;
        if ( target.data.life > 0 )
          life_pst = target.data.life / target.data.max_life;

        // Push the attack (player (self) pid is given in server.js)
        actions.push( ['attack', {
          attacker: unit.id,
          target: target.id,
          target_pid: target.pid,
          damage: damage,
          life_pst: life_pst
        }] );
      }
    }

    // console.log( actions );
    return actions;
  },

  post_fight: function( ) {
    var unit = this;
    var actions = [];

    // actions.push( ['life', {uid:unit.uid,life:unit.data.life}] );
    // Return if the unit is dead
    if ( unit.deactive )
      return actions;

    // Does the unit die?
    if ( 0 > unit.data.life ) {
      actions.push( ['dies', unit.id] );
      console.log( 'Unit '+ unit.uid +' died in battle' );
      unit.deactive = true;
    }

    return actions;
  },
  setup: function( unit ) {
    unit.fight = this.fight;
    unit.post_fight = this.post_fight;
    unit.deactive = false;
    var def = definitions[unit.name][unit.type-1];
    unit.data = {};
    for( var k in def )
      unit.data[k] = def[k];
    unit.data.max_life = unit.data.life;
  }
};

