  
<div>

<div style="text-align: center;">
<center>

<h2>Game Options</h2>

<div class="main_menu_buttons">

<table>


<tr>
<td>
<div class="main_menu_buttons">
  <button id="save_button" type="button" class="button setting_button" onClick="save_game();" title="Saves your current game so you can continue later. Press Ctrl+S to quick save the game."></button>
</div>
</td>
<td>
<div class="main_menu_buttons">
  <button id="fullscreen_button" type="button" class="button setting_button" onClick="show_fullscreen_window();" title="Enables fullscreen window mode" ></button>
</div>
</td>
</tr>


<tr>
<td>
  <div class="main_menu_buttons">
    <input type='checkbox' name='play_sounds_setting' id='play_sounds_setting' checked>
    <b>Play sounds</b>
  </div>
</td>
<td>
  <div class="main_menu_buttons">
    <input type='checkbox' name='speech_enabled_setting' id='speech_enabled_setting'>
    <b>Speech messages</b>
  </div>
</td>
</tr>

<tr>
<td>
  <div class="main_menu_buttons">
    <input type='checkbox' name='show_buildings_setting' id='show_buildings_setting'>
    <b>Show city buildings</b>
  </div>
</td>
<td>
    <div class="main_menu_buttons">
      <input type='checkbox' name='borders_setting' id='borders_setting'>
      <b>Show borders</b>
    </div>
</td>
</tr>
    <tr>
        <td>
            <div class="main_menu_buttons">
                <input type='checkbox' name='dialogs_minimized_setting' id='dialogs_minimized_setting'>
                <b>Dialogs open minimized</b>
            </div>
        </td>
        <td>
        </td>
    </tr>
</table>

<div class="main_menu_buttons" id="quality_div">
 <table style="width: 400px;">
  <tr title='Graphics quality level'>
      <td><b>Graphics quality:</b>
          &nbsp; &nbsp;
      <select name='graphics_quality_options' id='graphics_quality_options'>
    <option value='2'>Medium</option>
    <option value='3'>High</option>
    </select></td>
  </tr>
 </table>
</div>


<div class="main_menu_buttons" id="timeout_setting_div">
  <input type='number' name='timeout_setting' id='timeout_setting' size='6' length='3' max='3600' step='1' style='width: 40px;'>
  <b>Timeout (seconds per turn)</b>

  <span id="timeout_info"></span>
</div>

<div class="main_menu_buttons">
<table>
<tr>
  <td>
    <div class="main_menu_buttons">
       <button id="fps_button" type="button" class="button setting_button" onClick="show_fps();">Show fps</button>
    </div>
  </td>
</tr>
<tr>
    <td>
      <div class="main_menu_buttons">
        <button id="surrender_button" type="button" class="button setting_button" onClick="surrender_game();" title="Surrenders in multiplayer games and thus ends the game for you."></button>
      </div>
    </td>
    <td>
      <div class="main_menu_buttons">
        <button id="end_button" type="button" class="button setting_button" onClick="window.location='/';" title="Ends the game, and returns to the main page of Freeciv-web." ></button>
      </div>
    </td>
</tr>
</table>

</div>


</center>
</div>

</div>

