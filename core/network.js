( function( w ) {
  //This is all that needs
  var socket = io.connect(':8080/game');
    //Now we can listen for that event
  socket.on( 'connect', function( ) {
    console.log( 'Connected successfully to the socket.io server.' );
  } );

  socket.on( 'reconnect', function() {
    console.log( 'reloading' );
    window.location = '/';
  } );
  socket.on( 'joined', function( data ) {
    console.log( 'Joined!' );
    $( '#bw-'+ data.wid ).trigger( 'player-joined', data );
  } );
  socket.on( 'player-action', function( data ) {
    console.log( 'Player action recieved!' );
    $( '#bw-'+ data.wid ).trigger( 'player-action', data );
  } );

  w.network = function( wid ) {
    var obj = {
      register: function() {

        return obj;
      },
      quickstart: function( ) {
        socket.emit( 'quickstart', wid );
        return obj;
      },
      queue: function( action ) {
        socket.emit( 'queue-action', { wid:wid, action:action } );
        return obj;
      },
      add_unit: function( unit, position ) {
        return obj;
      }
    };

    return obj;
  };

} ( window ) );
