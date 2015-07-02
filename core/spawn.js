( function( w ) {
  w.spawn = {};

  var get_asset = function( asset_type, asset_name ) {
    // Filter the scene name
    asset_name = filter( 'spawn-asset-name', asset_name, asset_type );

    // Get and filter the asset
    var asset = game.asset[asset_type][asset_name];
    if ( undefined === asset ) {
      console.log( 'Asset, '+ asset_name +', does not exist' );
      return false;
    }
    asset = filter( 'spawn-asset-asset', asset, asset_type );

    var id = filter( 'spawn-asset-id', new_id() );

    // Spawn the HTML for the asset
    var html = filter( 'spawn-asset-html', asset.spawn(), asset_type );

    // Create the asset element
    var element = $( filter( 'spawn-asset-tag', '<div>' ) );
    var html_classes = asset_type +' '+ asset_type +'-'+ asset_name;
    html_classes += ' '+ asset_type +'-id-'+ id;
    element.addClass( filter( 'spawn-asset-class', html_classes, asset_type ) );
    element.html( html );

    // Return an asset object
    return {
      id: id,
      name: asset_name,
      element: element,
      display: asset.display
    };
  };

  // Spawn a scene
  w.spawn.scene = function( scene_name ) {
    // Get the scene asset
    var _s = get_asset( 'scene', scene_name );

    if ( !_s )
      return;

    // Push the element directly into the game wrapper
    filter( 'scene-container', game.element ).append( _s.element );

    // Add the scene to the scenes storage
    game.scenes.push( _s );
  };

  // Spawn a unit
  w.spawn.unit = function( unit_name, type ) {
    // Get the unit asset
    var _ua = get_asset( 'unit', unit_name );
    _ua.type = type;

    return _ua;
  };
} ( window ) );
