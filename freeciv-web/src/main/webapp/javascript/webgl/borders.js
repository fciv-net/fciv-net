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

  update_borders_image();

  setInterval(update_borders_image, 400);
}

/****************************************************************************
  Returns a texture containing one pixel for each map tile, where the color of each pixel
  contains the border color.
****************************************************************************/
function update_borders_image()
{
  var hash = generate_borders_image_hash();

  if (hash != borders_hash) {
    for (let x = 0; x < map.xsize; x++) {
      for (let y = 0; y < map.ysize; y++) {
        let ptile = map_pos_to_tile(x, y);
        let index = (y * map.xsize + x) * 4;
        if (ptile != null && ptile['owner'] != null && ptile['owner'] < 255) {
          var pplayer = players[ptile['owner']];

          if (nations[pplayer['nation']].color != null) {
            nation_colors = nations[pplayer['nation']].color.replace("rgb(", "").replace(")", "").split(",");
            borders_data[index] = parseInt(nation_colors[0]) * 0.65;
            borders_data[index + 1] = parseInt(nation_colors[2]) * 0.65;
            borders_data[index + 2] =  parseInt(nation_colors[1]) * 0.65;
            borders_data[index + 3] = 255;
          } else {
            borders_data[index] = 142;
            borders_data[index + 1] = 0;
            borders_data[index + 2] = 0;
            borders_data[index + 3] = 255;
          }
        } else {
          borders_data[index] = 142;
          borders_data[index + 1] = 0;
          borders_data[index + 2] = 0;
          borders_data[index + 3] = 255;
        }
      }
    }
    borders_hash = hash;
    borders_texture.needsUpdate = true;

    return borders_texture;
  }
}


/****************************************************************************
 Creates a hash of the map borders.
****************************************************************************/
function generate_borders_image_hash() {
  var hash = 0;
  var cols = map['xsize'];
  var rows = map['ysize'];

  for (var y = 0; y < rows ; y++) {
    for (var x = 0; x < cols; x++) {
      hash += border_image_color(x, y);
    }
  }

  return hash;
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
