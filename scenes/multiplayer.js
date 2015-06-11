( function( menu ) {
  menu = {
    spawn : function() {
      return '<h1>Menu</h1>';
    },
    display: function() {
      // The menu should only be visible a short time and transition on
      // to the game menu

      // Connect to the server

      // Go straight to the battle screen
      setTimeout( function() {
        scene.goto( 'game-battle' );
      }, 250 );
    }
  };
} ( game.asset.scene.menu ) );
