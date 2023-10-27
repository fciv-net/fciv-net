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


var anim_objs = {};

/****************************************************************************
 Updates unit movement animation.
****************************************************************************/
function update_animated_objects()
{
  for (var unit_id in anim_objs) {

    var punit = units[anim_objs[unit_id]['unit']];
    var mesh = anim_objs[unit_id]['mesh'];
    var flag = anim_objs[unit_id]['flag'];

    if (punit == null || mesh == null) {
      delete anim_objs[unit_id];
      continue;
    }
    var anim_list = punit['anim_list'];
    if (anim_list[0] == null || anim_list[1] == null) {
      delete anim_objs[unit_id];
      continue;
    }

    var tile_start = tiles[anim_list[0]['tile']];
    var tile_end = tiles[anim_list[1]['tile']];
    var pos_start = map_to_scene_coords(tile_start['x'], tile_start['y']);
    var pos_end = map_to_scene_coords(tile_end['x'], tile_end['y']);
    var delta_x = (pos_end['x'] - pos_start['x'])  / ANIM_STEPS;
    var delta_y = (pos_end['y'] - pos_start['y'])  / ANIM_STEPS;
    var delta_z = ((tile_end['height'] - tile_start['height']) * 100) / ANIM_STEPS;

    mesh.rotateOnAxis(new THREE.Vector3(0,1,0).normalize(), -1 * (convert_unit_rotation(punit['facing'], unit_type(punit)['name'])));
    mesh.translateOnAxis(new THREE.Vector3(1,0,0).normalize(), delta_x);
    mesh.translateOnAxis(new THREE.Vector3(0,1,0).normalize(), delta_z);
    mesh.translateOnAxis(new THREE.Vector3(0,0,1).normalize(), delta_y);
    mesh.rotateOnAxis(new THREE.Vector3(0,1,0).normalize(), (convert_unit_rotation(punit['facing'], unit_type(punit)['name'])));
    mesh.updateMatrix();

    if (flag != null) {
      flag.translateOnAxis(new THREE.Vector3(1,0,0).normalize(), delta_x);
      flag.translateOnAxis(new THREE.Vector3(0,1,0).normalize(), delta_z);
      flag.translateOnAxis(new THREE.Vector3(0,0,1).normalize(), delta_y);
      flag.updateMatrix();
    }

    anim_list[0]['i'] = anim_list[0]['i'] - 1;
    if (anim_list[0]['i'] == 0) {
      punit['anim_list'].splice(0, 1);
      if (punit['anim_list'].length == 1) {
        punit['anim_list'].splice(0, 1);
      }
    }
    if (anim_list.length <= 1) {
      punit['anim_list'] = [];
      delete anim_objs[unit_id];
      update_unit_position(tile_end);
    }

  }

  if (spaceship_launched != null) {
    spaceship_launched.translateOnAxis(new THREE.Vector3(0,1,0).normalize(), spaceship_speed);
    spaceship_speed = spaceship_speed * spaceship_acc;
    if (spaceship_launched.position.y > 10000) {
      scene.remove(spaceship_launched);
      spaceship_launched = null;
      spaceship_speed = 1;
    }

  }

  if (nuke_objects.length > 0) {
    animate_nuke();
  }

}


/****************************************************************************
 Renders an explosion animation on the given tile.
****************************************************************************/
function animate_explosion_on_tile(tile_id, animation_frame)
{
  if (scene == null) return;
  
  var ptile = tiles[tile_id];
  if (ptile == null) return;

  var height = 5 + ptile['height'] * 100;

  if (ptile['explosion_mesh'] != null) {
    scene.remove(ptile['explosion_mesh']);
    ptile['explosion_mesh'] = null;
  }
  if (animation_frame == 5) {
    scene.remove(ptile['explosion_mesh']);
    ptile['explosion_mesh'] = null;
    return;
  }

  var explosion_mesh = create_unit_explosion_sprite(animation_frame);
  var pos = map_to_scene_coords(ptile['x'], ptile['y']);
  explosion_mesh.position.set(pos['x'] - 6, height + 8, pos['y'] - 6);
  ptile['explosion_mesh'] = explosion_mesh;
  scene.add(explosion_mesh);

  if (animation_frame <= 4) setTimeout("animate_explosion_on_tile(" + tile_id + "," + (animation_frame + 1) + ")", 350);

}