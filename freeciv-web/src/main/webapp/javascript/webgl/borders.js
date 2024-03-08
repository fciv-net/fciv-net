/**********************************************************************
    Freeciv-web - the web version of Freeciv. http://www.fciv.net/
    Copyright (C) 2009-2017  The Freeciv-web project

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

var borders_palette = [];
var borders_texture;
var borders_hash = -1;
var borders_data;

/****************************************************************************
 Initialize borders image.
****************************************************************************/
function init_borders_image()
{
  borders_data = new Uint8Array( 4 * map.xsize * map.ysize );

  borders_texture = new THREE.DataTexture(borders_data, map.xsize, map.ysize);
  borders_texture.flipY = true;

  for (let x = 0; x < map.xsize; x++) {
    for (let y = 0; y < map.ysize; y++) {
      let index = (y * map.xsize + x) * 4;
      borders_data[index] = 142;
      borders_data[index + 1] = 0;
      borders_data[index + 2] = 0;
      borders_data[index + 3] = 255;
    }
  }
}

/****************************************************************************
 Update one border tile.
****************************************************************************/
function update_borders_tile(ptile)
{
  if (borders_texture == null) return;

  let x = ptile.x;
  let y = ptile.y;
  let index = (y * map.xsize + x) * 4;
  let old_value = borders_data[index] + borders_data[index + 1] + borders_data[index + 2];

  if (ptile != null && ptile['owner'] != null && ptile['owner'] < 255) {
    var pplayer = players[ptile['owner']];

    if (nations[pplayer['nation']].color != null) {
      let nation_colors = nations[pplayer['nation']].color.replace("rgb(", "").replace(")", "").split(",");
      borders_data[index] = parseInt(nation_colors[0]) * 0.65;
      borders_data[index + 1] = parseInt(nation_colors[2]) * 0.65;
      borders_data[index + 2] =  parseInt(nation_colors[1]) * 0.65;
    } else {
      borders_data[index] = 142;
      borders_data[index + 1] = 0;
      borders_data[index + 2] = 0;
    }
  } else {
    borders_data[index] = 142;
    borders_data[index + 1] = 0;
    borders_data[index + 2] = 0;
  }
  if ((borders_data[index] + borders_data[index + 1] + borders_data[index + 2]) != old_value) {
    borders_texture.needsUpdate = true;
  }
}

/****************************************************************************
  Returns the color of the tile at the given map position.
****************************************************************************/
function border_image_color(map_x, map_y)
{
  var ptile = map_pos_to_tile(map_x, map_y);

  if (map_x > map['xsize'] || map_y > map['ysize']) {
    return 0;
  }

  if (ptile != null && ptile['owner'] != null && ptile['owner'] < 255) {
      return 1 + ptile['owner'];
  }

  return 0;
}
