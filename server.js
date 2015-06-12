
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

var game = io.of( '/game' ).on( 'connection', function ( client ) {
  client.emit( 'news', { hello: 'world' } );
  client.on( 'my other event', function (data) {
    console.log(data);
  } );
  console.log( 'Someone connected' );
} );
