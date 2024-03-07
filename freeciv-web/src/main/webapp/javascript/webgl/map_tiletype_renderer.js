/**********************************************************************
    Freeciv-web - the web version of Freeciv. http://www.fciv.net/
    Copyright (C) 2009-2016  The Freeciv-web project

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

var tiletype_palette = [];
var tiletype_hash = -1;
var maptiletypes;
var maptiles_data;

/****************************************************************************
  Returns a texture containing each map tile, where the color of each pixel
  indicates which Freeciv tile type the pixel is.
****************************************************************************/
function init_map_tiletype_image()
{
  maptiles_data = new Uint8Array( 4 * map.xsize * map.ysize );

  maptiletypes = new THREE.DataTexture(maptiles_data, map.xsize, map.ysize);
  maptiletypes.flipY = true;

  update_tiletypes_image();
  setInterval(update_tiletypes_image, 60000);

  tiletype_hash = generate_tiletype_hash();

 }

/****************************************************************************
  ...
****************************************************************************/
function update_tiletypes_image()
{
   var hash = generate_tiletype_hash();
   if (hash != tiletype_hash) {
     for (let x = 0; x < map.xsize; x++) {
      for (let y = 0; y < map.ysize; y++) {
        let ptile = map_pos_to_tile(x, y);
        let index = (y * map.xsize + x) * 4;
        if (ptile != null && tile_terrain(ptile) != null && !tile_has_extra(ptile, EXTRA_RIVER)) {
          maptiles_data[index] = tile_terrain(ptile)['id'] * 10;
          maptiles_data[index + 1] = 0;
          maptiles_data[index + 2] = 0;
          maptiles_data[index + 3] = 255;
        } else if (ptile != null && tile_terrain(ptile) != null && tile_has_extra(ptile, EXTRA_RIVER)) {
          maptiles_data[index] = tile_terrain(ptile)['id'] * 10;
          maptiles_data[index + 1] = 10;
          maptiles_data[index + 2] = 0;
          maptiles_data[index + 3] = 255;
        } else {
          maptiles_data[index] = 0;
          maptiles_data[index + 1] = 10;
          maptiles_data[index + 2] = 0;
          maptiles_data[index + 3] = 255;
        }
      }
    }
    maptiletypes.needsUpdate = true;
    tiletype_hash = hash;
  }

}

/****************************************************************************
 Creates a hash of the map tiletypes.
****************************************************************************/
function generate_tiletype_hash() {
  var hash = 0;

  for (var x = 0; x < map.xsize ; x++) {
    for (var y = 0; y < map.ysize; y++) {
      var ptile = map_pos_to_tile(x, y);
      hash += tile_terrain(ptile)['id'];
    }
  }
  return hash;
}