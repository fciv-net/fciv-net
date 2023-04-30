<div id="fciv-intro">
  <div id="fciv-intro-txt" style="position: relative; left: -50%; ">
    Fciv.net is a Free and Open Source empire-building strategy game inspired by the history of human civilization.
    The game begins in prehistory and your mission is to lead your tribe peacefully from the Stone Age to the Space Age.
    Freeciv can be played online in your web-browser for free. Press F11 for fullscreen. Fciv.net is open source with a AGPL license.
  </div>
</div>


<div id="pregame_page">
  <div id="pregame_options">
	<div id="pregame_buttons">
		<div id="freeciv_logo" style="cursor:pointer;cursor:hand" onclick="window.open('/', '_new');">
		</div>
		<button id="start_game_button" type="button" class="button"><i class="fa fa-check-circle-o" aria-hidden="true"></i> <b>Start Game</b></button>
		<button id="load_game_button" type="button" class="button"><i class="fa fa-file-o" aria-hidden="true"></i> Load Game</button>
		<button id="pick_nation_button" type="button" class="button"><i class="fa fa-flag" aria-hidden="true"></i> Pick Nation</button>
		<button id="pregame_settings_button" type="button" class="button"><i class="fa fa-cogs" aria-hidden="true"></i> Game Settings</button>
	</div>

  </div>

  <div id="pregame_player_list"></div> 
  <div id="pregame_game_info"></div>
  <ol id="pregame_message_area"></ol>
  <div id="pregame_chat_box">
    <input id="pregame_text_input" type="text" name="text_input" value=">" />
  </div>
</div>

<div id="pick_nation_dialog" ></div>
