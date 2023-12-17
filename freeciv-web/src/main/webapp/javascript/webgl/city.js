/**********************************************************************
    Fciv.net - the web version of Freeciv. http://www.fciv.net/
    Copyright (C) 2009-2022  The Fciv.net project

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


var city_worked_positions = {};
var city_labels_visible = true;

/****************************************************************************
Show labels with worked city tiles.
****************************************************************************/
function show_city_worked_tiles()
{
  if (active_city == null) return;

  if (city_tile(active_city) != null && city_label_positions[city_tile(active_city)['index']] != null) {
    city_label_positions[city_tile(active_city)['index']].visible = false;
  }
  let other_city_material = new THREE.MeshBasicMaterial( { color: 0xc33b3b, transparent: true, opacity: 0.4} );

  for (var tile_id in tiles) {
    var ptile = tiles[tile_id];
    if (active_city != null && ptile != null && ptile['worked'] != null
          && active_city['id'] == ptile['worked'] && active_city['output_food'] != null) {
      let ctile = city_tile(active_city);
      let d = map_distance_vector(ctile, ptile);
      let idx = get_city_dxy_to_index(d[0], d[1], active_city);
      let pos = map_to_scene_coords(ptile['x'], ptile['y']);
      let height = 5 + ptile['height'] * 100;
      if (ctile['index'] == ptile['index']) {
        height += 15;
      }

      let food_output = active_city['output_food'][idx];
      let shield_output = active_city['output_shield'][idx];
      let trade_output = active_city['output_trade'][idx];

      /* The ruleset may use large values scaled down to get greater
       * granularity. */
      food_output = Math.floor(food_output / game_info.granularity);
      shield_output = Math.floor(shield_output / game_info.granularity);
      trade_output = Math.floor(trade_output / game_info.granularity);

      if (city_worked_positions[ptile['index']] == null) {
        var mesh = create_city_worked_sprite(food_output, shield_output, trade_output);
        city_worked_positions[ptile['index']] = mesh;
        mesh.position.set(pos['x'] + 2, height + 10, pos['y'] - 4);
        if (scene != null) {
          scene.add(mesh);
        }
      }
    } else if (active_city != null && ptile != null && ptile['worked'] != null
                && active_city['id'] != ptile['worked'] && ptile['worked'] > 0) {
      // tile worked by other city
      let ctile = city_tile(active_city);
      let d = map_distance_vector(ctile, ptile);
      let idx = get_city_dxy_to_index(d[0], d[1], active_city);
      let pos = map_to_scene_coords(ptile['x'], ptile['y']);
      let height = 5 + ptile['height'] * 100;

      if (city_worked_positions[ptile['index']] == null && Math.abs(d[0]) <= 2 && Math.abs(d[1]) <= 2) {
        let mesh = new THREE.Mesh( new THREE.RingGeometry( 1, 15, 30), other_city_material );
        city_worked_positions[ptile['index']] = mesh;
        mesh.position.set(pos['x'] - 12, height + 3, pos['y'] - 9);
        mesh.rotation.x = -1 * Math.PI / 2;
        if (scene != null) {
          scene.add(mesh);
        }
      }


    }
  }

}


/****************************************************************************
  Remove all city worked labels.
****************************************************************************/
function remove_city_worked_tiles() {
  for (var workedid in city_worked_positions) {
    if (city_worked_positions[workedid] != null) {
      scene.remove(city_worked_positions[workedid]);
    }
    delete city_worked_positions[workedid];
  }

  if (active_city != null && city_tile(active_city) != null && city_label_positions[city_tile(active_city)['index']] != null) {
      city_label_positions[city_tile(active_city)['index']].visible = true;
  }
}

/****************************************************************************
Is the given tile a city tile in the active city?
****************************************************************************/
function is_city_tile(ptile, active_city)
{
  var ctile = city_tile(active_city);
  var d = map_distance_vector(ptile, ctile);

  if ((d[0] == 2 && d[1] == 2) || (d[0] == -2 && d[1] == -2) || (d[0] == -2 && d[1] == 2) || (d[0] == 2 && d[1] == -2) ) {
    return false;
  }

  if (d[0] <= 2 && d[1] <= 2 && d[0] >= -2 && d[1] >= -2) {
    return true;
  }
  return false;

}

/****************************************************************************
...
****************************************************************************/
function hide_city_labels() {
  if (city_labels_visible) {
    for (var cid in city_label_positions) {
      var city_label = city_label_positions[cid];
      city_label.visible = false;
    }
    city_labels_visible = false;
    $("#city_labels_hide_button").text("Show city labels");
  } else {
    for (let cid in city_label_positions) {
      var city_label = city_label_positions[cid];
      city_label.visible = true;
    }
    city_labels_visible = true;
    $("#city_labels_hide_button").text("Hide city labels");
  }


}

/**************************************************************************
 Returns the city walls scale of for the given city.
**************************************************************************/
function get_citywalls_scale(pcity)
{
  var style = get_citywalls_models(pcity);
  var scale = 9;
  if (pcity['size'] >=3 && pcity['size'] <=6) {
    scale = 9.5;
  } else if (pcity['size'] > 6 && pcity['size'] <= 9) {
    scale = 10.5;
  } else if (pcity['size'] > 9 && pcity['size'] <= 11) {
    scale = 11.0;
  } else if (pcity['size'] > 11) {
    scale = 12.5;
  }
  if (style == "citywalls_stone") {
    return scale;
  } else if (style == "citywalls_roman") {
    return scale * 0.19;
  }
}

/****************************************************************************
...
****************************************************************************/
function get_citywalls_models(pcity) {
  if (pcity['style'] == 0 || pcity['style'] == 5) {
    return "citywalls_stone";
  } else {
    return "citywalls_roman";
  }
}

/****************************************************************************
 Show or hide city buildings on the map.
 ****************************************************************************/
function update_show_city_buildings() {

  if (show_buildings) {
    for (let key in city_building_positions) {
      if (city_building_positions[key] != null) {
        let building = city_building_positions[key];
        building.visible = true;
      }
    }
  } else {
    for (let key in city_building_positions) {
      if (city_building_positions[key] != null) {
        let building = city_building_positions[key];
        building.visible = false;
      }
    }
  }
}