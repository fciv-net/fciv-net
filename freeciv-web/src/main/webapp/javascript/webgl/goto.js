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

var goto_lines = [];

/****************************************************************************
 Renders a goto line by creating many planes along the goto path.
****************************************************************************/
function webgl_render_goto_line(start_tile, goto_packet_dir)
{
  clear_goto_tiles();

  var ptile = start_tile;

  var material = new THREE.MeshBasicMaterial( { color: 0x55c0ff, side:THREE.DoubleSide, transparent: false } );
  var goto_width = 2;

  for (var i = 0; i < goto_packet_dir.length; i++) {
    if (ptile == null) break;
    var dir = goto_packet_dir[i];

    if (dir == -1) {
      /* Assume that this means refuel. */
      continue;
    }

    var nexttile = mapstep(ptile, dir);
    if (nexttile != null) {
      if (tile_get_known(ptile) == TILE_UNKNOWN && tile_get_known(nexttile) == TILE_UNKNOWN) {
        continue; // Don't show goto lines on unknown tiles, as it will reveal water in unknown terrain.
      }

      var currpos = map_to_scene_coords(ptile['x'], ptile['y']);
      var nextpos = map_to_scene_coords(nexttile['x'], nexttile['y']);
      var height = 5 + ptile['height'] * 100;
      if (ptile['x'] == 0 || ptile['x'] >= map['xsize'] - 1 || nexttile['x'] == 0 || nexttile['x'] >= map['xsize'] - 1) continue;

      var current_height = ptile['height'];
      var next_height = nexttile['height'];
      if (tile_terrain(ptile)['name'] == "Hills" || tile_terrain(ptile)['name'] == "Mountains") {
        current_height += 0.1;
      }
      if (tile_terrain(nexttile)['name'] == "Hills" || tile_terrain(nexttile)['name'] == "Mountains") {
        next_height += 0.1;
      }

      var gotoLineGeometry = new THREE.BufferGeometry();
      const vertices = [];
      var delta = 0;
      if (dir == 1 || dir == 6) delta = 2;

      vertices.push(0, 0, 0);
      vertices.push(nextpos['x'] - currpos['x'], (next_height - current_height) * 50 - delta, nextpos['y'] - currpos['y']);
      vertices.push(0, delta, goto_width);
      vertices.push(nextpos['x'] - currpos['x'], (next_height - current_height) * 50 + delta, nextpos['y'] - currpos['y'] + goto_width);
      vertices.push(0, 0, 0);
      vertices.push(nextpos['x'] - currpos['x'], (next_height - current_height) * 50 - delta, nextpos['y'] - currpos['y']);
      gotoLineGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
      var gotoline = new THREE.Mesh(gotoLineGeometry, material);

      gotoline.position.set( currpos['x'] - 10, height + 5,  currpos['y'] - 3);
      scene.add(gotoline);
      goto_lines.push(gotoline);
    }

    ptile = mapstep(ptile, dir);
  }
}
