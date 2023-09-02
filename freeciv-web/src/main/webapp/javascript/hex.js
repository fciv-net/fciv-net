/**********************************************************************
    FCIV.NET - the web version of Freeciv. https://www.fciv.net/
    Copyright (C) 2009-2023  FCIV.NET project

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


/****************************************************************************
  Hexagonal map topology?
****************************************************************************/
function is_hex()
{
  return server_settings['topology']['val'] == 2;
}


/****************************************************************************
  uv is THREE.Vector2
****************************************************************************/
function map_hex_coords(uv) {
  var r = new THREE.Vector2(1, 1.73 );
  var h = new THREE.Vector2(0.5, 1.73 * 0.5);

  var a = new THREE.Vector2(math.mod(uv.x, r.x) - h.x, math.mod(uv.y, r.y) - h.y);
  var b = new THREE.Vector2(math.mod(uv.x - h.x, r.x) - h.x, math.mod(uv.y - h.y, r.y) - h.y);

  var gv;
  if (a.length() < b.length()) {
    gv = a;
  } else {
    gv = b;
  }

  return new THREE.Vector2(uv.x - gv.x, uv.y - gv.y);

}

