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
    console.log( data );
  } );
  socket.on( 'player-action', function( data ) {
    console.log( 'Player action recieved!' );
    console.log( data );
    $( '#bw-'+ data.wid ).trigger( 'player-action' );
    console.log( $( '#bw-'+ data.wid ) );
  } );

  w.network = {
    register: function() {

    },
    quickstart: function( wid ) {
      socket.emit( 'quickstart', wid );
    },
    queue: function( wid, action ) {
      socket.emit( 'queue-action', { wid:wid, action:action } );
    }
  };

} ( window ) );
