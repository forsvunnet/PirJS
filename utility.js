( function ( w ) {
  w.sort_object = function (o) {
    var sorted = {},
    key, a = [];

    for (key in o) {
      if (o.hasOwnProperty(key)) {
        a.push(key);
      }
    }

    a.sort();
    a = filter( 'priority-sort', a );

    for (key = 0; key < a.length; key++) {
      sorted[a[key]] = o[a[key]];
    }

    return filter( 'priority-sorted', sorted );
  };

  var id = filter( 'id-start', 1138 );
  w.new_id = function() { return filter( 'id-new', id++ ); };
} ( window ) );
