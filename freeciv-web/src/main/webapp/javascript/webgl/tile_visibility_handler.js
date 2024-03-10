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

var map_known_dirty = true;
var map_geometry_dirty = true;

/**************************************************************************
 Updates the terrain vertex colors to set tile to known, unknown or fogged.
**************************************************************************/
function webgl_update_tile_known(old_tile, new_tile)
{
  if (new_tile == null || old_tile == null || landGeometry == null) return;

  if (new_tile['height'] != old_tile['height']) {
    map_geometry_dirty = true;
  }

  if (tile_get_known(new_tile) != tile_get_known(old_tile)) {
    map_known_dirty = true;
  }

}


/**************************************************************************
 This will update the fog of war and unknown tiles, and farmland/irrigation
 by storing these as vertex colors in the landscape mesh.
**************************************************************************/
function update_tiles_known_vertex_colors()
{
  const colors = [];

  for ( let iy = 0; iy < gridY1; iy ++ ) {
    for ( let ix = 0; ix < gridX1; ix ++ ) {
        var sx = ix % xquality, sy = iy % yquality;
        var mx = Math.floor((sx / terrain_quality) - 0.040), my = Math.floor((sy / terrain_quality) - 0.040);
        var ptile = map_pos_to_tile(mx, my);
        if (ptile != null) {
          var c = get_vertex_color_from_tile(ptile, ix, iy);
          colors.push(c[0], c[1], c[2]);
        } else {
          colors.push(0,0,0);
        }
    }
  }

  landGeometry.setAttribute( 'vertColor', new THREE.Float32BufferAttribute( colors, 3) );

  landGeometry.colorsNeedUpdate = true;
  //console.log("updated vertex colours (tiles known, irrigation).");

}


/**************************************************************************
 Returns the vertex colors (THREE.Color) of a tile. The color is used to
 set terrain type in the terrain fragment shader.
**************************************************************************/
function get_vertex_color_from_tile(ptile, vertex_x, vertex_y)
{
    var known_status_color = 0;
    if (tile_get_known(ptile) == TILE_KNOWN_SEEN) {
      known_status_color = 1.06;

    } else if (tile_get_known(ptile) == TILE_KNOWN_UNSEEN) {
      known_status_color = 0.54;
    } else if (tile_get_known(ptile) == TILE_UNKNOWN) {
      known_status_color = 0;
    }

    if (active_city != null && ptile != null && (tile_get_known(ptile) == TILE_KNOWN_SEEN || tile_get_known(ptile) == TILE_KNOWN_UNSEEN)) {
      // Hightlight active city
      var ctile = city_tile(active_city);
      if (ptile['index'] == ctile['index']) {
        known_status_color = 1.06;
      } else if (is_city_tile(ptile, active_city)) {
        known_status_color = 1.06;
      } else {
        known_status_color = 0.30;
      }
    }

    return [known_status_color, 0,0];

}
