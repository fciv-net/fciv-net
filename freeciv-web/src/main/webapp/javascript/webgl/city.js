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

/****************************************************************************
Show labels with worked city tiles.
****************************************************************************/
function show_city_worked_tiles()
{
  if (active_city == null) return;

  city_label_positions[city_tile(active_city)['index']].visible = false;

  for (var tile_id in tiles) {
    var ptile = tiles[tile_id];
    if (active_city != null && ptile != null && ptile['worked'] != null
          && active_city['id'] == ptile['worked'] && active_city['output_food'] != null) {
      var ctile = city_tile(active_city);
      var d = map_distance_vector(ctile, ptile);
      var idx = get_city_dxy_to_index(d[0], d[1], active_city);
      var pos = map_to_scene_coords(ptile['x'], ptile['y']);
      var height = 5 + ptile['height'] * 100;
      if (ctile['index'] == ptile['index']) {
        height += 15;
      }

      var food_output = active_city['output_food'][idx];
      var shield_output = active_city['output_shield'][idx];
      var trade_output = active_city['output_trade'][idx];

      /* The ruleset may use large values scaled down to get greater
       * granularity. */
      food_output = Math.floor(food_output / game_info.granularity);
      shield_output = Math.floor(shield_output / game_info.granularity);
      trade_output = Math.floor(trade_output / game_info.granularity);

      if (city_worked_positions[ptile['index']] == null && food_output != null && shield_output != null && trade_output != null) {
        var mesh = create_city_worked_sprite(food_output, shield_output, trade_output);
        city_worked_positions[ptile['index']] = mesh;
        mesh.position.set(pos['x'] + 2, height + 10, pos['y'] - 4);
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
    scene.remove(city_worked_positions[workedid]);
    delete city_worked_positions[workedid];
  }

  if (active_city != null) {
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
  for (var cid in city_label_positions) {
    var city_label = city_label_positions[cid];
    city_label.visible = false;

  }


}