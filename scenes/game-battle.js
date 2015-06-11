( function( multiplayer ) {
  multiplayer = {
    spawn : function() {
      html = '';
      html += '<h1>Game battle</h1>';
      html += '<div class=battle-window id=bw-'+ new_id() +'>';
        html += '<div class=bar--top>';
          html += '<div class=bar--exp></div>';
          html += '<div class=info--attack-power></div>';
          html += '<div class=info--squad-count></div>';
          html += '<div class=info--gold></div>';
        html += '</div>';
        html += '<div>battle-screen</div>';
        html += '<div class="bar-vertical bar--life"></div>';
        html += '<div class="bar-vertical bar--mana"></div>';
        html += '<div class=bar--action-queue></div>';
        html += '<div class=bar--actions>';
          html += '<div class="action action--heal">';
          html += '<div class="action action--defend">';
          html += '<div class="action action--attack">';
          html += '<div class="action action--magic">';
        html += '</div>';
        html += '<div class=squad-manager></div>';
        html += '<div class=squad-manager>squad-manager</div>';
        html += '<div class=flee-button></div>';
      html += '</div>';
      return html;
    },
    display: function() {
      // Do some interesting stuffs here
      console.log( 'Start the game' );
    }
  };
} ( game.asset.scene.multiplayer ) );
