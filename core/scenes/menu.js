( function( _s ) {
  _s.menu = {
    spawn : function() {
      return '<h1>Menu</h1>';
    },
    display: function() {
      // We're temporarily skipping all the menus while developing
      setTimeout( function() {
        scene.goto( 'multiplayer' );
      }, 10 );
    }
  };
} ( game.asset.scene ) );
