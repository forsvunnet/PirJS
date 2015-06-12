var scene = {};

/**
 * Go to a scene
 * This function is quite unstable and should be used with caution.
 * Match a scene by name, id or scene itself.
 * This function will just show the first scene it finds.
 */
scene.goto = function( hook ) {
  var x, _s;
  if ( 'object' === typeof hook ) {
    _s = hook;
    return scene.display_only( _s );
  }

  // Look secondly for the name
  var scene_name = filter( 'scene-goto-name', hook );
  for ( x in game.scenes ) {
    _s = game.scenes[x];
    if ( _s.name === scene_name ) {
      return scene.display_only( _s );
    }
  }

  // Look last for the id
  var scene_id = filter( 'scene-goto-id', hook );
  for ( x in game.scenes ) {
    _s = game.scenes[x];
    if ( _s.id === scene_id ) {
      return scene.display_only( _s );
    }
  }

  return false;
};

/**
 * Display only {scene}
 * Hide every scene except this one
 */
scene.display_only = function( _s ) {
  _s.element.show();

  // Call the display callback after filtering it
  // - Used by transitions
  var callback = filter( 'scene-display-callback', _s.display, _s );
  if ( 'function' === typeof callback )
    callback.call( _s );

  // Hide all other scenes
  for ( var x in game.scenes ) {
    _sx = game.scenes[x];
    if ( _s.id !== _sx.id ) {
      _sx.element.hide();
    }
  }
};

window.scene = scene;
