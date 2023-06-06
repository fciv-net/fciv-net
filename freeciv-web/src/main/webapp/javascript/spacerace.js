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


var spaceship_info = {};

var spaceships = {};
var spaceship_launched = null;

var SSHIP_NONE = 0;
var SSHIP_STARTED = 1;
var SSHIP_LAUNCHED = 2;
var SSHIP_ARRIVED = 3;

var SSHIP_PLACE_STRUCTURAL = 0;
var SSHIP_PLACE_FUEL = 1;
var SSHIP_PLACE_PROPULSION = 2;
var SSHIP_PLACE_HABITATION = 3;
var SSHIP_PLACE_LIFE_SUPPORT = 4;
var SSHIP_PLACE_SOLAR_PANELS = 5;

var spaceship_speed = 1.0;
var spaceship_acc = 1.01;

/**************************************************************************
 ...
**************************************************************************/
function show_spaceship_dialog()
{
  var title = "Spaceship";
  var message = "";

  if (client_is_observer()) return;

  var spaceship = spaceship_info[client.conn.playing['playerno']];

  message += "Spaceship progress: " + get_spaceship_state_text(spaceship['sship_state']) + "<br>";
  message += "Success probability: " + Math.floor(spaceship['success_rate'] * 100) + "%<br>";
  message += "Travel time: " + Math.floor(spaceship['travel_time']) + " years<br>";
  message += "Components: " + spaceship['components'] + "<br>";
  message += "Energy Rate: " + Math.floor(spaceship['energy_rate'] * 100) + "%<br>";
  message += "Support Rate: " + Math.floor(spaceship['support_rate'] * 100) + "%<br>";
  message += "Habitation: " + spaceship['habitation'] + "<br>";
  message += "Life Support: " + spaceship['life_support'] + "<br>";
  message += "Mass: " + spaceship['mass'] + " tons<br>";
  message += "Modules: " + spaceship['modules'] + "<br>";
  message += "Population: " + spaceship['population'] + "<br>";
  message += "Propulsion: " + spaceship['propulsion'] + "<br>";
  message += "Solar Panels: " + spaceship['solar_panels'] + "<br>";
  message += "Structurals: " + spaceship['structurals'] + "<br>";
  if (spaceship['launch_year'] != 9999) message += "Launch year: " + spaceship['launch_year'] + "<br>";

  if (game_info['victory_conditions'] == 0) message = "Spaceship victory disabled.<br>";

  message += "<br>Launch a spaceship to Alpha Centauri! To build a spaceship build the Apollo program wonder, Factory, then lots of Space Components, Space Modules and Space Structurals (10+ each) in a city. "
   + "For help, see the Space Race page in the manual.<br>";

  $("#dialog").remove();
  $("<div id='dialog'></div>").appendTo("div#game_page");

  $("#dialog").html(message);
  $("#dialog").attr("title", title);
  $("#dialog").dialog({
			bgiframe: true,
			modal: true,
			width: is_small_screen() ? "90%" : "40%",
			buttons: {
				Close: function() {
					$("#dialog").dialog('close');
			        },
			         Launch : function() {
					$("#dialog").dialog('close');
					launch_spaceship();
					set_default_mapview_active();
				}
			}
		});

  $("#dialog").dialog('open');

  if (spaceship['sship_state'] != SSHIP_STARTED || spaceship['success_rate'] == 0) $(".ui-dialog-buttonpane button:contains('Launch')").button("disable");

}

/**************************************************************************
 ...
**************************************************************************/
function launch_spaceship()
{
  var test_packet = {"pid" : packet_spaceship_launch};
  var myJSONText = JSON.stringify(test_packet);
  send_request(myJSONText);
  launch_spaceship_anim();

}

/**************************************************************************
 ...
**************************************************************************/
function get_spaceship_state_text(state_id)
{
 if (state_id == SSHIP_NONE) return "Not started";
 if (state_id == SSHIP_STARTED) return "Started";
 if (state_id == SSHIP_LAUNCHED) return "Launched";
 if (state_id == SSHIP_ARRIVED) return "Arrived";
}

/****************************************************************************
  Adds a spaceship 3d model.
****************************************************************************/
function add_spaceship(ptile, pcity, scene) {
  if (observing || ptile == null || ptile['extras_owner'] == null) return;

  var spaceship_plr = spaceship_info[ptile['extras_owner']];
  if (spaceship_plr != null && pcity != null && spaceships[ptile['extras_owner']] == null && is_primary_capital(pcity) && spaceship_plr['sship_state'] == SSHIP_STARTED) {
    var spaceshipmodel = webgl_get_model("Spaceship", ptile);
    if (spaceshipmodel == null) {
      return;
    }
    var nexttile = ptile;
    for (var i = 0; i < 30; i++) {
      var dir = Math.floor(Math.random() * 8);
      var ntile = mapstep(ptile, dir);
      var nexttile = mapstep(ntile, dir);
      if (is_ocean_tile(nexttile)) {
        ptile = mapstep(ptile, Math.floor(Math.random() * 8));
        continue;
      }
      if (nexttile != null) {
        break;
      }
    }
    if (nexttile == null) return;

    var height = 5 + nexttile['height'] * 100;

    pos = map_to_scene_coords(nexttile['x'], nexttile['y']);
    spaceshipmodel.position.set(pos['x'] - 1, height + 3, pos['y'] - 1);
    scene.add(spaceshipmodel);
    spaceships[ptile['extras_owner']] = spaceshipmodel;

    load_model("Spaceship_launched");
  }
}

/****************************************************************************
  Animate spaceship launch
****************************************************************************/
function launch_spaceship_anim() {
  var playerno = client.conn.playing['playerno'];

  var spaceshipmodel = webgl_get_model("Spaceship_launched", null);
  if (spaceshipmodel == null) {
    return;
  }

  if (spaceships[playerno] != null) {
    spaceshipmodel.position.copy(spaceships[playerno].position);
    scene.remove(spaceships[playerno]);
    spaceships[playerno] = null;
  }

  scene.add(spaceshipmodel);
  spaceship_launched = spaceshipmodel;

}

