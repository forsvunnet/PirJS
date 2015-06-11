var express = require( 'express' );
var app = express();
var server = require( 'http' ).Server( app );
var io = require( 'socket.io' )( server );


server.listen( 8080 );

app.get( '/', function ( req, res ) {
  res.sendFile( __dirname + '/index.html' );
} );

var game = io.of( '/game' ).on( 'connection', function ( client ) {
  client.emit( 'news', { hello: 'world' } );
  client.on( 'my other event', function (data) {
    console.log(data);
  } );
  console.log( 'Someone connected' );
} );
