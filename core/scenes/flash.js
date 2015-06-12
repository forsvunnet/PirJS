( function( _s ) {
  _s.flash = {
    spawn : function() {
      return '<h1>Pir</h1>';
    },
    display: function() {
      // The flash should only be visible a short time and transition on
      // to the game menu
      setTimeout( function() {
        scene.goto( 'menu' );
      }, 1000 );
    }
  };

} ( game.asset.scene ) );
