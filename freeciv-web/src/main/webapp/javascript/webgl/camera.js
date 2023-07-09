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

var camera;

var camera_dx = 50;
var camera_dy = 410;
var camera_dz = 242;
var camera_current_x = 0;
var camera_current_y = 0;
var camera_current_z = 0;
var slide_init = false;


/****************************************************************************
  Point the camera to look at point x, y, z in Three.js coordinates.
****************************************************************************/
function camera_look_at(x, y, z)
{
  camera_current_x = x;
  camera_current_y = y;
  camera_current_z = z;

  if (camera != null) {
    camera.position.set( x + camera_dx, y + camera_dy, z + camera_dz);
    camera.lookAt( new THREE.Vector3(x, 0, z));

    spotlight.position.set( x + 500, 900, z + 500);
    spotlight.target.position.set(x - 200, 0, z - 200);
    spotlight.shadow.camera.position.copy(spotlight.position);
    spotlight.shadow.camera.lookAt(new THREE.Vector3(x - 200, 0, z + 500));

    if (sun_mesh != null) {
      sun_mesh.position.set( x + 500, 900, z + 500);
    }
  }

  if (controls != null) {
    controls.target = new THREE.Vector3(x + 50, 50, z + 50);
  }

}

/**************************************************************************
  Centers the mapview around the given tile..
**************************************************************************/
function center_tile_mapcanvas_3d(ptile)
{
  if (ptile != null) {
    if (slide_init) {
      enable_mapview_slide_3d(ptile);
    } else {
      var pos = map_to_scene_coords(ptile['x'], ptile['y']);
      camera_look_at(pos['x'] - 50, 0, pos['y'] - 50);       // -50 to get the center tile more in the center of the screen.
      slide_init = true;
    }

  }

}

/**************************************************************************
...
**************************************************************************/
function center_tile_city(city)
{
  var ptile = city_tile(city);
  if (ptile != null) {
    var pos = map_to_scene_coords(ptile['x'], ptile['y']);
    camera_look_at(pos['x'] , 0, pos['y'] );
  }

}

/**************************************************************************
  Enabled silding of the mapview to the given tile.
**************************************************************************/
function enable_mapview_slide_3d(ptile)
{
  var pos_dest = map_to_scene_coords(ptile['x'], ptile['y']);

  camera_dx = camera.position.x - controls.target.x + 50;
  camera_dy = camera.position.y - controls.target.y + 50;
  camera_dz = camera.position.z - controls.target.z + 50;

  mapview_slide['dx'] = camera_current_x - pos_dest['x'] + 50;
  mapview_slide['dy'] = camera_current_z - pos_dest['y'] + 50;
  mapview_slide['i'] = mapview_slide['max'];
  mapview_slide['prev'] = mapview_slide['i'];
  mapview_slide['start'] = new Date().getTime();
  mapview_slide['active'] = true;

}

/**************************************************************************
  Updates mapview slide, called once per frame.
**************************************************************************/
function update_map_slide_3d()
{
  var elapsed = 1 + new Date().getTime() - mapview_slide['start'];
  mapview_slide['i'] = Math.floor(mapview_slide['max']
                        * (mapview_slide['slide_time']
                        - elapsed) / mapview_slide['slide_time']);

  if (mapview_slide['i'] <= 0) {
    mapview_slide['active'] = false;
    return;
  }

  var dx = Math.floor(mapview_slide['dx'] * (mapview_slide['i'] - mapview_slide['prev']) / mapview_slide['max']);
  var dy = Math.floor(mapview_slide['dy'] * (mapview_slide['i'] - mapview_slide['prev']) / mapview_slide['max']);

  camera_look_at(camera_current_x + dx, 0, camera_current_z + dy);
  mapview_slide['prev'] = mapview_slide['i'];

}