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

  for (let x = 0; x < map.xsize; x++) {
    for (let y = 0; y < map.ysize; y++) {
      let index = (y * map.xsize + x) * 4;
      maptiles_data[index] = 0;
      maptiles_data[index + 1] = 0;
      maptiles_data[index + 2] = 0;
      maptiles_data[index + 3] = 0;
    }
  }

 }

/****************************************************************************
  ...
****************************************************************************/
function update_tiletypes_tile(ptile)
{
  let x = ptile.x;
  let y = ptile.y;
  let index = (y * map.xsize + x) * 4;
  let old_value = maptiles_data[index] + maptiles_data[index + 1] + maptiles_data[index + 2];
  if (ptile != null && tile_terrain(ptile) != null && !tile_has_extra(ptile, EXTRA_RIVER)) {
    maptiles_data[index] = tile_terrain(ptile)['id'] * 10;
    maptiles_data[index + 1] = 0;
  } else if (ptile != null && tile_terrain(ptile) != null && tile_has_extra(ptile, EXTRA_RIVER)) {
    maptiles_data[index] = tile_terrain(ptile)['id'] * 10;
    maptiles_data[index + 1] = 10;
  } else {
    maptiles_data[index] = 0;
    maptiles_data[index + 1] = 10;
  }
    if (tile_has_extra(ptile, EXTRA_FARMLAND)) {
      maptiles_data[index + 2] = 2;
    } else if (tile_has_extra(ptile, EXTRA_IRRIGATION)) {
      maptiles_data[index + 2] = 1;
    } else {
      maptiles_data[index + 2] = 0;
    }

  if (old_value != (maptiles_data[index] + maptiles_data[index + 1] + maptiles_data[index + 2])) {
    maptiletypes.needsUpdate = true;
    //console.log("updated map tiles.");
  }

}
