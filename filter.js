( function ( w ) {
  var _f = {};

  /**
   * Filter
   */
  w.filter = function() {
    var args = arguments;

    // No hook is set
    if ( !args[0] )
      return false;
    var hook = args.shift();
    if ( _f[hook] ) {
      for ( var priority in _f[hook] ) {
        var callbacks = _f[hook][priority];
        for ( var x in callbacks ) {
          args[1] = callbacks[x].apply( args );
        }
      }
    }

    return args[1];
  };

  /**
   * Action
   */
  w.action = function( hook ) {
    w.filter( hook );
  };

  // Add a filter
  w.add_filter = function( hook, callback, priority ) {
    if ( undefined === priority )
      priority = 10;
    _f[hook] = _f[hook] || {};
    _f[hook][priority] = _f[hook][priority] || [];
    _f[hook][priority].push( callback );

    // Sort by priority
    _f[hook] = sort_object( _f[hook] );
  };

  //@todo: Remove a filter
  w.remove_filter = function() { };
} ( window ) );
