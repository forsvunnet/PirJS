var spawn = {};

// Define asset storage
spawn.scene = function( scene_name ) {
  // Filter the scene name
  scene_name = filter( 'spawn-scene-name', scene_name );

  // Get and filter the asset
  var asset = game.asset.scene[scene_name];
  asset = filter( 'spawn-scene-asset', asset );

  // Spawn the HTML for the scene
  var html = filter( 'spawn-scene-html', asset.spawn() );

  // Create the scene element
  var element = $( filter( 'spawn-scene-tag', '<div>' ) );
  element.addClass( filter( 'spawn-scene-class', 'scene scene-' + scene_name ) );
  element.html( html );

  // Create a new scene object and stash it
  var scene = {
    id: filter( 'spawn-scene-id', new_id() ),
    name: scene_name,
    element: element,
    callback: asset.display
  };

  game.scenes.push( scene );
};

window.spawn = spawn;