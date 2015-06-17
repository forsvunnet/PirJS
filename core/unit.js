( function( w ) {
  w.unit = {};

  w.unit.data = function() {
    var _parameters = {
      health: 10,
      damage: 2,
      speed: 1,
      range: 1,
    };

    return _parameters;
  };
  w.unit.html = function() {
    var html = '';
    html += '<div class=bar-health>';
      html += '<div class=life style=width:100%;>';
      html += '</div>';
    html += '</div>';
    return html;
  };
} ( window ) );
