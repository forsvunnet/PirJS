( function( w ) {
  w.unit = {};

  // Utility function used to genereate unit html in units/*.js
  w.unit.html = function() {
    var html = '';
    html += '<div class=bar-health>';
      html += '<div class=life style=width:100%;>';
      html += '</div>';
    html += '</div>';
    return filter( 'unit-html', html );
  };
} ( window ) );
