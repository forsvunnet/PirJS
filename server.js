
// Constants / configuration:
var production = false;


// Load and set up modules
var fs = require( 'fs' );
var express = require( 'express' );
var app = express();
var server = require( 'http' ).Server( app );
var io = require( 'socket.io' )( server );



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
var _rid_base = 1138;
var create_new_room = function() {
  var room = {
    title: 'Battle room',
    id: _rid_base++,
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
    };

    client.emit( 'joined', {
      title: room.title
    } );

    return slot_no;
  };
  room.queue_action = function( pid, action ) {
    console.log ( 'Player ['+ pid +'] prepares to '+ action.replace('magic', 'do magic') );
    room.players[pid].actions.push( action );

    // Let other players know
    for ( var x in room.players ) { if ( pid != x ) {
      var wid = room.players[x].wid;
      room.players[x].client.emit( 'player-action', {pid: pid, wid: wid} );
    } }
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
  client.on( 'queue-action', function ( data ) {
    var action = data.action;
    var wid = data.wid;

    var room = active_rooms[wid];
    if ( !room ) {
      console.log( 'Client tried to use a room that doesn\'t exist!' );
      return;
    }

    room.queue_action( pid, action );
  } );
  console.log( 'Someone connected' );
} );
