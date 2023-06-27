/**********************************************************************
    FCIV.NET - the 3D web version of Freeciv. http://www.fciv.net/
    Copyright (C) 2009-2023  The Freeciv-web project

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

var nuke_unit = null;
var nuke_start_tile = null;
var nuke_objects = [];
var nuke_mushroom_objects = [];
var nuke_other_objects = [];

/****************************************************************************
 Renders a nuclear explosion animation on the given tile.
****************************************************************************/
function render_nuclear_explosion(ptile)
{
  if (ptile == null || nuke_unit == null || nuke_start_tile == null) return;

  center_tile_mapcanvas_3d(ptile);
  setTimeout("create_nuke(" + ptile['index'] + ");", 500);
}

/****************************************************************************
 Render nuclear explosion using particles.
****************************************************************************/
function create_nuke(ptile_id)
{
  play_sound('LrgExpl.ogg');

  var ptile = tiles[ptile_id];
  var pos = map_to_scene_coords(ptile['x'], ptile['y']);
  var height = 5 + ptile['height'] * 100;

  var inner_radius = 110;
  var mushroom_height = 70;

  var sprite = new THREE.Sprite( new THREE.SpriteMaterial( { map: webgl_textures["nuke_glow"]}));
  sprite.scale.set(500, 200, 1);
  sprite.position.set(pos['x'] , height + mushroom_height + 20, pos['y']);
  scene.add(sprite);
  nuke_objects.push(sprite);

  // Render inner mushroom cloud.
  for (var i = 0; i < 25000; i++) {
    var x = pos['x'] + (Math.random() * inner_radius) - (inner_radius / 2);
    var h = height + mushroom_height + (Math.random() * inner_radius) - (inner_radius / 2);
    var y = pos['y']  + (Math.random() * inner_radius) - (inner_radius / 2);
    var dist = Math.sqrt(((pos['x'] - x) ** 2) + (2 * (height + mushroom_height - h) ** 2) + ((pos['y'] - y) ** 2));
    if (dist > (inner_radius / 2) || dist < 45) {
      continue;
    }

    var sprite = new THREE.Sprite( new THREE.SpriteMaterial( { map: webgl_textures["nuke_inner_mushroom_cloud"]}));
    sprite.scale.set(5, 5, 1);
    sprite.position.set(x, h, y);
    scene.add(sprite);
    nuke_objects.push(sprite);
    nuke_mushroom_objects.push(sprite);
  }

  var outer_radius = 118;

  // Render outer mushroom cloud.
  for (var i = 0; i < 12000; i++) {
    var x = pos['x'] + (Math.random() * outer_radius) - (outer_radius / 2);
    var h = height + mushroom_height + (Math.random() * outer_radius) - (outer_radius / 2);
    var y = pos['y']  + (Math.random() * outer_radius) - (outer_radius / 2);
    var dist = Math.sqrt(((pos['x'] - x) ** 2) + (2 * (height + mushroom_height - h) ** 2) + ((pos['y'] - y) ** 2));
    if (dist > (outer_radius / 2) || dist < 35) {
      continue;
    }

    var sprite = new THREE.Sprite( new THREE.SpriteMaterial( { map: webgl_textures["nuke_outer_mushroom_cloud"]}));
    sprite.scale.set(5, 5, 1);
    sprite.position.set(x, h, y);
    scene.add(sprite);
    nuke_objects.push(sprite);
    nuke_mushroom_objects.push(sprite);
  }

  // Render hot mushroom cloud.
  for (var i = 0; i < 8000; i++) {
    var x = pos['x'] + (Math.random() * outer_radius) - (outer_radius / 2);
    var h = height + mushroom_height + (Math.random() * outer_radius) - (outer_radius / 2);
    var y = pos['y']  + (Math.random() * outer_radius) - (outer_radius / 2);
    var dist = Math.sqrt(((pos['x'] - x) ** 2) + (2 * (height + mushroom_height - h) ** 2) + ((pos['y'] - y) ** 2));
    if (dist > (outer_radius / 2) || dist < 35) {
      continue;
    }

    var sprite = new THREE.Sprite( new THREE.SpriteMaterial( { map: webgl_textures["nuke_hot_mushroom_cloud"]}));
    sprite.scale.set(4, 4, 1);
    sprite.position.set(x, h, y);
    scene.add(sprite);
    nuke_objects.push(sprite);
    nuke_mushroom_objects.push(sprite);
  }


  // Render shock wave
  var shock_radius = 240;
  for (var i = 0; i < 250000; i++) {
    var x = pos['x'] + (Math.random() * shock_radius) - (shock_radius / 2);
    var h = height + mushroom_height + (Math.random() * shock_radius) - (shock_radius / 2);
    var y = pos['y']  + (Math.random() * shock_radius) - (shock_radius / 2);
    var dist = Math.sqrt(((pos['x'] - x) ** 2) + (120 * (height + mushroom_height - h) ** 2) + ((pos['y'] - y) ** 2));
    if (dist > (shock_radius / 2) || dist < 115) {
      continue;
    }

    var sprite = new THREE.Sprite( new THREE.SpriteMaterial( { map: webgl_textures["nuke_shock_wave"]}));
    sprite.scale.set(5, 5, 1);
    sprite.position.set(x, h, y);
    scene.add(sprite);
    nuke_objects.push(sprite);
    nuke_mushroom_objects.push(sprite);
  }

  // Render blast area.
  var blast_radius = 200;
  for (var i = 0; i < 25000; i++) {
    var x = pos['x'] + (Math.random() * blast_radius) - (blast_radius / 2);
    var h = height + 0.5 + (Math.random() * blast_radius) - (blast_radius / 2);
    var y = pos['y']  + (Math.random() * blast_radius) - (blast_radius / 2);
    var dist = Math.sqrt(((pos['x'] - x) ** 2) + (70 * (height + 0.5 - h) ** 2) + ((pos['y'] - y) ** 2));
    if (dist > (blast_radius / 2)) {
      continue;
    }

    var sprite = new THREE.Sprite( new THREE.SpriteMaterial( { map: webgl_textures["nuke_grey_blast_area"]}));
    sprite.scale.set(6, 6, 1);
    sprite.position.set(x, h, y);
    scene.add(sprite);
    nuke_objects.push(sprite);
    nuke_other_objects.push(sprite);
  }

  // Render rising column.
  var column_radius = 60;
  for (var i = 0; i < 1000; i++) {
    var x = pos['x'] + (Math.random() * column_radius) - (column_radius / 2);
    var h = height + 30 + (Math.random() * column_radius) - (column_radius / 2);
    var y = pos['y']  + (Math.random() * column_radius) - (column_radius / 2);
    var dist = Math.sqrt(((pos['x'] - x) ** 2) + (0.01 * (height + 30 - h) ** 2) + ((pos['y'] - y) ** 2));
    if (dist > (column_radius / 2)) {
      continue;
    }

    var sprite = new THREE.Sprite( new THREE.SpriteMaterial( { map: webgl_textures["nuke_rising_column"]}));
    sprite.scale.set(6, 6, 1);
    sprite.position.set(x, h, y);
    scene.add(sprite);
    nuke_objects.push(sprite);
    nuke_other_objects.push(sprite);
  }

  setTimeout("clear_nuke();", 10000);
}


/****************************************************************************
 Remove nuke particles
****************************************************************************/
function clear_nuke()
{
  for (var i = 0; i < nuke_objects.length; i++) {
    scene.remove(nuke_objects[i]);
  }
  nuke_objects = [];
  nuke_mushroom_objects = [];
  nuke_other_objects = [];
}

/****************************************************************************
 Animate the nuke particles
****************************************************************************/
function animate_nuke() {
  for (var i = 0; i < nuke_mushroom_objects.length; i++) {
    nuke_mushroom_objects[i].position.set(nuke_mushroom_objects[i].position.x + ( 2 * Math.random()) - 1,
    nuke_mushroom_objects[i].position.y + (2 * Math.random()) - 1 + 0.25,
    nuke_mushroom_objects[i].position.z + (2 * Math.random()) - 1
    );
  }

  for (var i = 0; i < nuke_other_objects.length; i++) {
    nuke_other_objects[i].position.set(nuke_other_objects[i].position.x + ( 1 * Math.random()) - 0.5,
    nuke_other_objects[i].position.y + (1 * Math.random()) - 0.5,
    nuke_other_objects[i].position.z + (1 * Math.random()) - 0.5
    );
  }
}