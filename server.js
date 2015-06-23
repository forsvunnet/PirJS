
// Constants / configuration:
var production = false;


// Load and set up modules
var fs = require( 'fs' );
var express = require( 'express' );
var app = express();
var server = require( 'http' ).Server( app );
var io = require( 'socket.io' )( server );

var utility = {
  units: require( './server/units.js' )
};


server.listen( 8080 );

app.get( '/', function ( req, res ) {
  res.sendFile( __dirname + '/index.html' );
} );

// Concat files in client-files.json
app.get( '/client.js', function ( req, res ) {
  var content = fs.readFileSync( 'client-files.json' );
  var js = '';
    var files = JSON.parse( content );
    for ( var f in files ) {
    if ( production ) {
      js += fs.readFileSync( files[f] ) + "\n";
    }
    else {
      js += 'jQuery.getScript("'+ files[f] +'");' + "\n";
    }
  }
  res.send( js );
} );
// Static core files
app.use( "/core", express.static( __dirname + '/core' ) );


var battle_rooms = {};
var _id_base = 1138;
var create_new_room = function() {
  var room = {
    title: 'Battle room',
    id: _id_base++,
    slots: [0, 2],
    players: {},
  };
  room.attach = function( pid, client, wid ) {
    // Add the client to the room and fill a slot
    var slot_no = room.slots[0]++;
    room.players[pid] = {
      client: client,
      wid: wid,
      actions: [],
      units: [],
    };
    for ( var _pid in room.players ) {
      var player = room.players[_pid];
      player.client.emit( 'joined', {
        pid: pid,
        self: _pid == pid,
        title: room.title,
        wid: wid,
        room:{
          full: room.slots[0] == room.slots[1],
          title:room.title,
          slots:room.slots,
        }
      } );
    }

    return slot_no;
  };
  room.queue_action = function( pid, action ) {
    console.log ( 'Player ['+ pid +'] prepares to '+ action.replace('magic', 'do magic') );
    room.players[pid].actions.push( action );

    var total_actions = 0;
    // Loop through players
    for ( var x in room.players ) {
      var player = room.players[x];
      if ( pid != x ) {
        var wid = player.wid;
        // Let other players know
        player.client.emit( 'player-action', { pid: pid, wid: wid } );
      }
      // Count actions total
      total_actions += player.actions.length;
    }

    // Ready to fight?
    if ( 16 == total_actions ) {
      // Fight!
      room.start_fight();
    }

  };

  room.add_unit = function( pid, unit ) {
    room.players[pid].units.push( unit );
  };

  var fight_frequency, current_action, previous_action;
  var fight_duration, fight_time = 1000;
  room.reset_vars = function() {
    fight_frequency = 100;
    current_action = 0;
    previous_action = -1;
    fight_duration = fight_time;
  };
  room.reset_vars();

  room.fight = function() {
    var pid, player, actions = [];
    // Build an array of actions
    for ( pid in room.players ) {
      player = room.players[pid];
      if ( current_action != previous_action ) {
        var action = player.actions[current_action];
        actions.push( { pid: pid, action: action } );
        console.log( 'Player ['+ pid +'] is '+ action +'ing' );
      }
    }
    // Loop through units
    for ( pid in room.players ) {
      player = room.players[pid];
      // Activate actions
      if ( actions.length ) {
        // Send action instructions for all players to all players
        player.client.emit( 'do-actions', { wid: player.wid, actions: actions, pid: pid } );
      }
      // Let units have at it
      for ( var y in player.units ) {
        var _u = player.units[y];
        _u.fight();
      }
    }

    previous_action = current_action;

    fight_duration -= fight_frequency;
    if ( 0 >= fight_duration ) {
      current_action++;
      if ( 8 <= current_action ) {
        room.stop_fight();
      }
      fight_duration = fight_time;
    }
  };
  var fight_interval;
  room.start_fight = function() {
    // Start an interval function that triggers unit actions
    fight_interval = setInterval( room.fight, fight_frequency );
  };
  room.stop_fight = function() {
    fight_interval = clearInterval( fight_interval );
    for ( var pid in room.players ) {
      var player = room.players[pid];
      player.client.emit( 'stop-fight' );
    }
  };


  battle_rooms[room.id] = room;
  return room;
};
var _pid = 0;
var game = io.of( '/game' ).on( 'connection', function ( client ) {
  var pid = _pid++;
  // Keep track of the clients rooms
  var active_rooms = {};

  /**
   * Quickstart a game
   */
  client.on( 'quickstart', function ( wid ) {
    console.log( 'A client requested a quickstart' );
    console.log( 'Looking for available rooms to join' );
    var room_to_join = false;
    for ( var x in battle_rooms ) {
      // Look at the room
      var room = battle_rooms[x];
      if ( room.slots[0] < room.slots[1] ) {
        // The room has at least one available slot to join
        console.log( 'Room, '+ room.id +', has '+ ( room.slots[1] - room.slots[0] ) +' available slot(s)!' );
        room_to_join = room;
        break;
      }
      else {
        console.log( 'Room, '+ room.id +', has no available slots!' );
      }
    }

    if ( false === room_to_join ) {
      console.log( 'No available rooms. Creating a new one.' );
      room_to_join = create_new_room();
    }

    console.log( 'Joining the room '+ room_to_join.id );
    room_to_join.attach( pid, client, wid );

    active_rooms[wid] = room_to_join;
  } );

  /**
   * Player action
   */
  client.on( 'queue-action', function ( data ) {
    var action = data.action;
    var room = active_rooms[data.wid];

    if ( !room ) {
      console.log( 'Client tried to use a room that doesn\'t exist!' );
      return;
    }

    room.queue_action( pid, action );
  } );

  /**
   * Add unit
   */
  client.on( 'add-unit', function ( data ) {
    var unit = data.unit;
    var position = data.position;
    var room = active_rooms[data.wid];
    var pos = pos2xy( position );

    unit.x = pos.x;
    unit.y = pos.y;
    unit.pid = pid;
    unit.uid = _id_base++;
    unit.room = room;
    utility.units.setup( unit );

    if ( !room ) {
      console.log( 'Client tried to use a room that doesn\'t exist!' );
      return;
    }

    room.add_unit( pid, unit );
  } );
  console.log( 'Someone connected' );
} );

var pos2xy = function( position, column_length ) {
  if ( !column_length )
    column_length = 4;
  return {
    x: position % column_length,
    y: Math.floor( position / column_length )
  };
};
