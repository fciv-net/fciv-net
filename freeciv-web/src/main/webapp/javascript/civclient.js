/**********************************************************************
    Freeciv-web - the web version of Freeciv. http://www.fciv.net/
    Copyright (C) 2009-2015  The Freeciv-web project

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

***********************************************************************/


var client = {};
client.conn = {};

var client_frozen = false;
var phase_start_time = 0;

var debug_active = false;
var autostart = false;

var username = null;
var userid = null;

var fc_seedrandom = null;

// singleplayer, multiplayer, longturn
var game_type = "";

var music_list = [ ];
var audio = null;
var audio_enabled = false;

var last_turn_change_time = 0;
var turn_change_elapsed = 0;
var seconds_to_phasedone = 0;
var seconds_to_phasedone_sync = 0;
var dialog_close_trigger = "";
var dialog_message_close_task;

/**************************************************************************
 Main starting point for FCIV.NET
**************************************************************************/
$(document).ready(function() {
  civclient_init();
});

/**************************************************************************
 This function is called on page load.
**************************************************************************/
function civclient_init()
{
  if (!Detector.webgl) {
    swal("3D WebGL not supported by your browser or you don't have a 3D graphics card.  ");
    return;
  }

  $("#introtxtja").hide();

  $.blockUI.defaults['css']['backgroundColor'] = "#222";
  $.blockUI.defaults['css']['color'] = "#fff";
  $.blockUI.defaults['theme'] = true;

  var action = $.getUrlVar('action');
  game_type = $.getUrlVar('type');
  if (game_type == null) {
    if (action == null) {
      game_type = 'singleplayer';
    } else if (action == 'pbem') {
      game_type = 'pbem';
    } else {
      game_type = 'singleplayer';
    }
  }

  if (action == "observe") {
    observing = true;
    $("#pregame_buttons").remove();
    $("#civ_dialog").remove();
  }

  //initialize a seeded random number generator
  fc_seedrandom = new Math.seedrandom('freeciv-web');

  init_webgl_renderer();

  game_init();
  $('#tabs').tabs({ heightStyle: "fill" });
  control_init();

  timeoutTimerId = setInterval(update_timeout, 1000);

  update_game_status_panel();
  statusTimerId = setInterval(update_game_status_panel, 6000);

  motd_init();


  $('#tabs').css("height", $(window).height());
  $("#tabs-map").height("auto");
  $("#tabs-civ").height("auto");
  $("#tabs-tec").height("auto");
  $("#tabs-nat").height("auto");
  $("#tabs-cities").height("auto");
  $("#tabs-opt").height("auto");
  $("#tabs-hel").height("auto");
  $("#tabs-mentat").height("auto");

  $(".button").button();

  sounds_enabled = simpleStorage.get('sndFX');

  if (sounds_enabled == null) {
    // Default to true, except when known to be problematic.
    if (platform.name == 'Safari') {
      sounds_enabled = false;
    } else {
      sounds_enabled = true;
    }
  }

  dialogs_minimized_setting = simpleStorage.get('dialogs_minimized_setting');

 init_common_intro_dialog();
 setup_window_size();

 $("#mapcanvas").hide();

  setInterval(updateElementsPosition, 2000);

}

/**************************************************************************
 Shows a intro dialog depending on game type.
**************************************************************************/
function init_common_intro_dialog() {
  if (observing) {
    show_intro_dialog("Welcome to Fciv.net",
      "You have joined the game as an observer. Please enter your name:");
    $("#turn_done_button").button( "option", "disabled", true);

  } else if (is_small_screen()) {
      show_intro_dialog("Welcome to Fciv.net",
        "You are about to join the game. Please enter your name:");
  } else if ($.getUrlVar('action') == "earthload") {
    show_intro_dialog("Welcome to Freeciv-web",
      "You can now play Freeciv-web on the earth map you have chosen. " +
      "Please enter your name: ");

  } else if ($.getUrlVar('action') == "load") {
    show_intro_dialog("Welcome to Fciv.net",
      "You are about to join this game server, where you can " +
      "load a savegame, tutorial, custom map generated from an image or a historical scenario map. " +
      "Please enter your name: ");

  } else if ($.getUrlVar('action') == "multi") {

      var msg = "You are about to join this game server, where you can "  +
                  "participate in a multiplayer game. You can customize the game " +
                  "settings, and wait for the minimum number of players before " +
                  "the game can start. ";
      show_intro_dialog("Welcome to Fciv.net", msg);

  } else {
    show_intro_dialog("Welcome to Fciv.net",
      "You can now play a game of Freeciv, where you can " +
      "play a singleplayer game against the Freeciv AI or multiplayer. You can " +
      "start the game directly by entering any name, or customize the game settings. " +
      "Creating a user account is optional, but savegame support requires that you create a user account.");
      $(".pwd_reset").click(forgot_pbem_password);
  }
}


/**************************************************************************
 Closes a generic message dialog.
**************************************************************************/
function close_dialog_message() {
  $("#generic_dialog").dialog('close');
}

function closing_dialog_message() {
  clearTimeout(dialog_message_close_task);
  $("#game_text_input").blur();
}

/**************************************************************************
 Shows a generic message dialog.
**************************************************************************/
function show_dialog_message(title, message) {

  // reset dialog page.
  $("#generic_dialog").remove();
  $("<div id='generic_dialog'></div>").appendTo("div#game_page");

  speak(title);
  speak(message);

  $("#generic_dialog").html(message);
  $("#generic_dialog").attr("title", title);
  $("#generic_dialog").dialog({
			bgiframe: true,
			modal: false,
			width: is_small_screen() ? "90%" : "50%",
			close: closing_dialog_message,
			buttons: {
				Ok: close_dialog_message
			}
		}).dialogExtend({
                   "minimizable" : true,
                   "closable" : true,
                   "icons" : {
                     "minimize" : "ui-icon-circle-minus",
                     "restore" : "ui-icon-newwin"
                   }});

  $("#generic_dialog").dialog('open');
  $("#game_text_input").blur();

  $('#generic_dialog').css("max-height", "450px");

  if (dialogs_minimized_setting) {
    $("#generic_dialog").dialogExtend("minimize");
  }

}


/**************************************************************************
 ...
**************************************************************************/
function validate_username() {
  username = $("#username_req").val();

  if (!is_username_valid_show(username)) {
    return false;
  }

  simpleStorage.set("username", username);

  return true;
}

/**************************************************************************
 Checks if the username is valid and shows the reason if it is not.
 Returns whether the username is valid.
**************************************************************************/
function is_username_valid_show(username) {
  var reason = get_invalid_username_reason(username);
  if (reason != null) {
    $("#username_validation_result").html("The username '"
                + username.replace(/&/g, "&amp;").replace(/</g, "&lt;")
                + "' is " + reason + ".");
    $("#username_validation_result").show();
    return false;
  }
  return true;
}




/* Webclient is always client. */
function is_server()
{
  return false;
}

/**************************************************************************
 ...
**************************************************************************/
function update_timeout()
{
  var now = new Date().getTime();
  if (game_info != null
      && current_turn_timeout() != null && current_turn_timeout() > 0) {
    var remaining = Math.floor(seconds_to_phasedone - ((now - seconds_to_phasedone_sync) / 1000));

    if (remaining >= 0 && turn_change_elapsed == 0) {
      if (is_small_screen()) {
        $("#turn_done_button").button("option", "label", "Turn " + remaining);
        $("#turn_done_button .ui-button-text").css("padding", "3px");
      } else {
        $("#turn_done_button").button("option", "label", "Turn Done (" + seconds_to_human_time(remaining) + ")");
      }
      if (!is_touch_device()) {
        $("#turn_done_button").tooltip({ disabled: false });
      }
    }
  }
}


/**************************************************************************
 shows the remaining time of the turn change on the turn done button.
**************************************************************************/
function update_turn_change_timer()
{
  turn_change_elapsed += 1;
  if (turn_change_elapsed < last_turn_change_time) {
    setTimeout(update_turn_change_timer, 1000);
    $("#turn_done_button").button("option", "label", "Please wait (" 
        + (last_turn_change_time - turn_change_elapsed) + ")");
  } else {
    turn_change_elapsed = 0;
    $("#turn_done_button").button("option", "label", "Turn Done"); 
  }
}

/**************************************************************************
 ...
**************************************************************************/
function set_phase_start()
{
  phase_start_time = new Date().getTime();
}

/**************************************************************************
...
**************************************************************************/
function request_observe_game()
{
  send_message("/observe ");
}

/**************************************************************************
...
**************************************************************************/
function surrender_game()
{
  send_surrender_game();
  set_default_mapview_active();

}

/**************************************************************************
...
**************************************************************************/
function send_surrender_game()
{
  if (!client_is_observer() && ws != null && ws.readyState === 1) {
    send_message("/surrender ");
  }
}

/**************************************************************************
...
**************************************************************************/
function show_fullscreen_window()
{
  if (BigScreen.enabled) {
    BigScreen.toggle();
  } else {
   show_dialog_message('Fullscreen', 'Press F11 for fullscreen mode.');
  }

}

/**************************************************************************
...
**************************************************************************/
function show_debug_info()
{
  console.log("Freeciv version: " + freeciv_version);
  console.log("Browser useragent: " + navigator.userAgent);
  console.log("jQuery version: " + $().jquery);
  console.log("jQuery UI version: " + $.ui.version);
  console.log("simpleStorage version: " + simpleStorage.version);
  console.log("Touch device: " + is_touch_device());
  console.log("HTTP protocol: " + document.location.protocol);
  if (ws != null && ws.url != null) console.log("WebSocket URL: " + ws.url);

  debug_active = true;
  /* Show average network latency PING (server to client, and back). */
  var sum = 0;
  var max = 0;
  for (var i = 0; i < debug_ping_list.length; i++) {
    sum += debug_ping_list[i];
    if (debug_ping_list[i] > max) max = debug_ping_list[i];
  }
  console.log("Network PING average (server): " + (sum / debug_ping_list.length) + " ms. (Max: " + max +"ms.)");

  /* Show average network latency PING (client to server, and back). */
  sum = 0;
  max = 0;
  for (var j = 0; j < debug_client_speed_list.length; j++) {
    sum += debug_client_speed_list[j];
    if (debug_client_speed_list[j] > max) max = debug_client_speed_list[j];
  }
  console.log("Network PING average (client): " + (sum / debug_client_speed_list.length) + " ms.  (Max: " + max +"ms.)");

  console.log(maprenderer.info);

}

/**************************************************************************
  This function can be used to display a message of the day to users.
  It is run on startup of the game, and every 30 minutes after that.
  The /motd.js Javascript file is fetched using AJAX, and executed
  so it can run any Javascript code. See motd.js also.
**************************************************************************/
function motd_init()
{
  $.getScript("/motd.js");
  setTimeout(motd_init, 1000*60*30);
}

/**************************************************************************
 Shows the authentication and password dialog.
**************************************************************************/
function show_auth_dialog(packet) {

  // reset dialog page.
  $("#dialog").remove();
  $("<div id='dialog'></div>").appendTo("div#game_page");

  var intro_html = packet['message']
      + "<br><br> Password: <input id='password_req' type='text' size='25'>";
  $("#dialog").html(intro_html);
  $("#dialog").attr("title", "Private server needs password to enter");
  $("#dialog").dialog({
			bgiframe: true,
			modal: true,
			width: is_small_screen() ? "80%" : "60%",
			buttons:
			{
				"Ok" : function() {
                                  var pwd_packet = {"pid" : packet_authentication_reply, "password" : $('#password_req').val()};
                                  var myJSONText = JSON.stringify(pwd_packet);
                                  send_request(myJSONText);

                                  $("#dialog").dialog('close');
				}
			}
		});


  $("#dialog").dialog('open');


}

