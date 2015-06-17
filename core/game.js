( function( w ) {
  w.game = {};

  // Define asset storage
  w.game.asset = {
    scene: {},
    unit: {}
  };
  w.game.scenes = [];

  // Filter the game wrapper selector
  var sel = filter( 'selector-game-wrapper', '#game-wrapper' );

  w.game.element = $( sel );

  // Allow plugins to process the game object
  // It's an object so the reference is kept even as an action
  action( 'game-object', w.game );
} ( window ) );
