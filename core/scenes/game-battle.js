( function( _s ) {
  _s['game-battle'] = {
    spawn : function() {
      var i, bw_id = new_id();
      html = '';
      html += '<h1>Game battle</h1>';
      html += '<div class=battle-window id=bw-'+ bw_id +' data-id='+ bw_id +'>';
        html += '<div class=bar--top>';
          html += '<div class=bar--exp title="Experience"></div>';
          html += '<div class=info--attack-power title="Attack Power"></div>';
          html += '<div class=info--squad-count title="Squad Count"></div>';
          html += '<div class=info--gold  title="Gold?"</div>';
        html += '</div>';
        html += '<div>battle-screen</div>';
        html += '<div class="bar-vertical bar--life" title="Life"><div class=filler></div></div>';
        html += '<div class="bar-vertical bar--mana" title="Mana"><div class=filler></div></div>';
        html += '<div class=bar--action-queue>';
        for ( i = 0; i < 16; i++ ) {
          html += '<div class="queue-item queue-item-'+ i +'"></div>';
        }
        html += '</div>';
        html += '<div class=bar--actions>';
          html += '<div data-action=heal class="action action--heal" title="Heal"></div>';
          html += '<div data-action=defend class="action action--defend" title="Defend"></div>';
          html += '<div data-action=attack class="action action--attack" title="Attack"></div>';
          html += '<div data-action=magic class="action action--magic" title="Magic"></div>';
        html += '</div>';
        html += '<div class=squad-manager>';
        for ( i = 0; i < 16; i++ ) {
          html += '<div class="unit-window unit-window-'+ i +'">';

          html += '</div>';
        }
        html += '</div>';
        html += '<div class=flee-button title="Flee Battle"></div>';
      html += '</div>';
      return html;
    },
    display: function( scene ) {

      var state = 'pending';

      // Go directly to battle for now
      state = 'battle';

      // Get the window
      var bw = scene.element.find( '.battle-window' );

      // Let modules hook in on the action
      action( 'battle-window', bw );

      // Don't process twice
      if ( bw.hasClass( 'processed' ) )
        return;
      bw.addClass( 'processed' );

      // Get the id of the window
      var bw_id = bw.data( 'id' );

      // Are we playing another player or an AI?
      network.quickstart( bw_id );

      // Do some interesting stuffs here
      console.log( 'Start the game' );

      /**
       * Slots and actions
       */
      var available_slots = 8;

      //
      var take_action = function( e ) {
        if ( 0 >= available_slots )
          return;

        // Only battle when battle is available
        if ( 'battle' != state )
          return;

        // Get the slot to fill
        var slot = filter( 'slot', 8 - available_slots );
        available_slots--;

        // Get the slot item
        var slot_item = bw.find( '.queue-item-' + slot );

        // Get the action to do
        var _a = $( this ).data( 'action' );

        // Colour the slot in
        slot_item.addClass( 'queue-action--'+ _a );

        // Send the action to server
        network.queue( bw_id, _a );

      };
      // Bind the action buttons
      bw.find( '.action' ).click( take_action );

      // Handle oponent actions
      var oponent_slots = 8;
      var oponent_action = function() {
        // Get the slot to fill
        var slot = filter( 'slot', 7 + oponent_slots );
        oponent_slots--;

        // Get the slot item
        var slot_item = bw.find( '.queue-item-' + slot );

        // Colour the slot in
        slot_item.addClass( 'queue-action--hidden' );
      };
      bw.on( 'player-action', oponent_action );

      /**
       * Units
       */
      // Populate squad manager
      var units = [];

      units.push( spawn.unit( 'defender' ) );
      units.push( spawn.unit( 'attacker' ) );
      units.push( spawn.unit( 'attacker' ) );
      units.push( spawn.unit( 'defender' ) );

      units.push( spawn.unit( 'defender' ) );
      units.push( spawn.unit( 'attacker', 2 ) );
      units.push( spawn.unit( 'attacker', 2 ) );
      units.push( spawn.unit( 'defender' ) );

      units.push( spawn.unit( 'attacker', 3 ) );
      units.push( spawn.unit( 'attacker', 2 ) );
      units.push( spawn.unit( 'attacker', 2 ) );
      units.push( spawn.unit( 'attacker', 3 ) );

      units.push( spawn.unit( 'attacker', 3 ) );
      units.push( spawn.unit( 'healer' ) );
      units.push( spawn.unit( 'healer' ) );
      units.push( spawn.unit( 'attacker', 3 ) );

      for ( var i = 0; i < units.length; i++ ) {
        var unit = units[i];
        bw.find( '.unit-window-'+ i ).append( unit.element );
      }
    }
  };
} ( game.asset.scene ) );
