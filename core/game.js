var game = {};

// Define asset storage
game.asset = {
  scene: {}
};
game.scenes = [];
game.element = $( filter( 'selector-game-wrapper', '#game-wrapper' ) );
window.game = game;
