( function( _s ) {
  _s['game-battle'] = {
    spawn : function() {
      var i, bw_id = new_id();
      html = '';
      html += '<h1>Game battle</h1>';
      html += '<div class="battle-window" id=bw-'+ bw_id +' data-id='+ bw_id +'>';
        html += '<div class=bar--top>';
          html += '<div class=bar--exp title="Experience"></div>';
          html += '<div class=info--attack-power title="Attack Power"></div>';
          html += '<div class=info--squad-count title="Squad Count"></div>';
          html += '<div class=info--gold  title="Gold?"</div>';
        html += '</div>';
        html += '<div class="title">battle-screen</div>';
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
      // Get the window
      var bw = scene.element.find( '.battle-window' );

      // Wait for all players to connect
      var state = 'pending';
      var allow_battle = false;

      // Helper function to set state
      var set_state = function( _s ) {
        state = _s;
        bw.removeClass( function ( index, classes ) {
          return ( classes.match( /(^|\s)state-\S+/g ) || [] ).join(' ');
        } );
        if (0) { }
        else if ( 'pending' == _s ) {
          bw.find( '.title' ).text( 'Waiting for another player..' );
        }
        else if ( 'battle' == _s ) {
          allow_battle = true;
          bw.find( '.title' ).text( 'Commence battle!' );
        }
        else if ( 'done' == _s ) {
          allow_battle = false;
          bw.find( '.title' ).text( 'Awaiting opponents actions..' );
        }
        else if ( 'done-opponent' == _s ) {
          bw.find( '.title' ).text( 'Opponent is wating for you..' );
        }
        else if ( 'fight' == _s ) {
          allow_battle = false;
          bw.find( '.title' ).text( 'Fight!' );
        }
        bw.addClass( 'state-' + _s );
      };
      set_state( state );

      // Let modules hook in on the action
      action( 'battle-window', bw );

      // Don't process twice
      if ( bw.hasClass( 'processed' ) )
        return;
      bw.addClass( 'processed' );

      // Get the id of the window
      var bw_id = bw.data( 'id' );

      // Are we playing another player or an AI?
      var _n = network( bw_id );
      _n.quickstart();

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
        if ( !allow_battle )
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
        _n.queue( _a );

        if ( 0 === available_slots ) {
          if ( 'done-opponent' === state ) {
            set_state( 'fight' );
          }
          else {
            set_state( 'done' );
          }
        }
      };
      // Bind the action buttons
      bw.find( '.action' ).click( take_action );





      // TOTAL DEV FUNCTION - AUTOMATED BATTLING
      setInterval( function() {
        var random = Math.floor(Math.random()*4);
        bw.find( '.action' ).eq( random ).click();
      }, 50 );
      // TOTAL DEV FUNCTION - AUTOMATED BATTLING





      // Handle opponent actions
      var opponent_slots = 8;
      var opponent_action = function( e, data ) {
        console.log( data );
        // Get the slot to fill
        var slot = filter( 'slot', 7 + opponent_slots );
        opponent_slots--;

        // Get the slot item
        var slot_item = bw.find( '.queue-item-' + slot );

        // Colour the slot in
        slot_item.addClass( 'queue-action--hidden' );

        if ( 0 === opponent_slots ) {
          if ( 'done' === state ) {
            set_state( 'fight' );
          }
          else {
            set_state( 'done-opponent' );
          }
        }
      };
      bw.on( 'player-action', opponent_action );

      /**
       * Player joined
       */
      var player_joined = function( e, data ) {
        // Wait for players to join before starting battle
        if ( data.room.full ) {
          console.log( 'Start battle' );
          set_state( 'battle' );
        }
      };
      bw.on( 'player-joined', player_joined );

      /**
       * Units
       */
      // Populate squad manager
      var units = [];

      units.push( spawn.unit( 'defender' ) );
      console.log( units );
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

      drag_handler = function( e ) {
        e.preventDefault();
      };

      for ( var i = 0; i < units.length; i++ ) {
        var unit = units[i];

        unit.element.click( drag_handler );
        // Add the unit to the network
        _n.add_unit( unit, i );
        // Place the unit in the squad manager
        bw.find( '.unit-window-'+ i ).append( unit.element );
      }


      // Remember that units have to be id'ed on both pid and unit.id
      var unit_fight = function( e, data ) {
        var pid = data.pid;

        // We recieve all data for all players
        for ( var _p in data.actions ) {

          // We already know what we (ourself) did
          if ( _p == pid )
            continue;

          // Get the player (opponent) action
          var player_actions = data.actions[_p];

          // Then itterate on those unit actions
          for ( var a = 0; a < player_actions.length; a++ ) {
            // Get the unit action
            var unit_actions = player_actions[a];

            // Itterate the unit actions
            for ( var _a = 0; _a < unit_actions.length; _a++ ) {

              // Take one of the many actions the unit performed (perhaps only one)
              var action = unit_actions[a];

              // Sanity =) make sure the action is viable
              if ( !action )
                continue;

              // Get the target unit and update its life
              for ( var i = 0; i < units.length; i++ ) {
                var unit = units[i];
                if ( unit.id == action[1].target) {
                  unit.element.find('.life').width( 100 * action[1].life_pst +'%' );
                }
              }
            }
          }
        }
      };
      bw.on( 'unit-fight', unit_fight );




    }
  };
} ( game.asset.scene ) );
