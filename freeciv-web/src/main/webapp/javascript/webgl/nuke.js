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
var nuke_active = false;

/****************************************************************************
 Renders a nuclear explosion animation on the given tile.
****************************************************************************/
function render_nuclear_explosion(ptile)
{
  if (ptile == null || nuke_unit == null || nuke_start_tile == null) return;

  center_tile_mapcanvas_3d(ptile);
  setTimeout("create_nuke(" + ptile['index'] + ")", 500);
  nuke_active = true;
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
  var innerMaterial = new THREE.SpriteMaterial( { map: webgl_textures["nuke_inner_mushroom_cloud"]});
  for (var i = 0; i < 45000; i++) {
    var x = pos['x'] + (Math.random() * inner_radius) - (inner_radius / 2);
    var h = height + mushroom_height + (Math.random() * inner_radius) - (inner_radius / 2);
    var y = pos['y']  + (Math.random() * inner_radius) - (inner_radius / 2);
    var dist = Math.sqrt(((pos['x'] - x) ** 2) + (2 * (height + mushroom_height - h) ** 2) + ((pos['y'] - y) ** 2));
    if (dist > (inner_radius / 2) || dist < 45) {
      continue;
    }

    var sprite = new THREE.Sprite(innerMaterial);
    sprite.scale.set(2.5 + Math.random(), 2.5 + Math.random(), 1);
    sprite.position.set(x, h, y);
    scene.add(sprite);
    nuke_objects.push(sprite);
    nuke_mushroom_objects.push(sprite);
  }

  var outer_radius = 118;

  // Render outer mushroom cloud.
  var outerMaterial = new THREE.SpriteMaterial( { map: webgl_textures["nuke_outer_mushroom_cloud"]});
  for (var i = 0; i < 25000; i++) {
    var x = pos['x'] + (Math.random() * outer_radius) - (outer_radius / 2);
    var h = height + mushroom_height + (Math.random() * outer_radius) - (outer_radius / 2);
    var y = pos['y']  + (Math.random() * outer_radius) - (outer_radius / 2);
    var dist = Math.sqrt(((pos['x'] - x) ** 2) + (2 * (height + mushroom_height - h) ** 2) + ((pos['y'] - y) ** 2));
    if (dist > (outer_radius / 2) || dist < 35) {
      continue;
    }

    var sprite = new THREE.Sprite(outerMaterial);
    sprite.scale.set(0.8 + Math.random(), 0.5 + Math.random(), 1);
    sprite.position.set(x, h, y);
    scene.add(sprite);
    nuke_objects.push(sprite);
    nuke_mushroom_objects.push(sprite);
  }

  // Render hot mushroom cloud.
  var hotMaterial = new THREE.SpriteMaterial( { map: webgl_textures["nuke_hot_mushroom_cloud"]});
  for (var i = 0; i < 15000; i++) {
    var x = pos['x'] + (Math.random() * outer_radius) - (outer_radius / 2);
    var h = height + mushroom_height + (Math.random() * outer_radius) - (outer_radius / 2);
    var y = pos['y']  + (Math.random() * outer_radius) - (outer_radius / 2);
    var dist = Math.sqrt(((pos['x'] - x) ** 2) + (2 * (height + mushroom_height - h) ** 2) + ((pos['y'] - y) ** 2));
    if (dist > (outer_radius / 2) || dist < 35) {
      continue;
    }

    var sprite = new THREE.Sprite(hotMaterial);
    sprite.scale.set(0.5 + Math.random(), 0.4 + Math.random(), 1);
    sprite.position.set(x, h, y);
    scene.add(sprite);
    nuke_objects.push(sprite);
    nuke_mushroom_objects.push(sprite);
  }


  // Render shock wave
  var shock_radius = 240;
  var shockMaterial = new THREE.SpriteMaterial( { map: webgl_textures["nuke_shock_wave"]});
  for (var i = 0; i < 100000; i++) {
    var x = pos['x'] + (Math.random() * shock_radius) - (shock_radius / 2);
    var h = height + mushroom_height + (Math.random() * shock_radius) - (shock_radius / 2);
    var y = pos['y']  + (Math.random() * shock_radius) - (shock_radius / 2);
    let dist = Math.sqrt(((pos['x'] - x) ** 2) + (120 * (height + mushroom_height - h) ** 2) + ((pos['y'] - y) ** 2));
    if (dist > (shock_radius / 2) || dist < 115) {
      continue;
    }

    let sprite = new THREE.Sprite(shockMaterial);
    sprite.scale.set(0.5 + Math.random(), 0.5 + Math.random(), 1);
    sprite.position.set(x, h, y);
    scene.add(sprite);
    nuke_objects.push(sprite);
    nuke_mushroom_objects.push(sprite);
  }

  // Render blast area.
  var blast_radius = 200;
  var blastMaterial = new THREE.SpriteMaterial( { map: webgl_textures["nuke_grey_blast_area"]});
  for (var i = 0; i < 90000; i++) {
    var x = pos['x'] + (Math.random() * blast_radius) - (blast_radius / 2);
    var h = height + 0.5 + (Math.random() * blast_radius) - (blast_radius / 2);
    var y = pos['y']  + (Math.random() * blast_radius) - (blast_radius / 2);
    var dist = Math.sqrt(((pos['x'] - x) ** 2) + (70 * (height + 0.5 - h) ** 2) + ((pos['y'] - y) ** 2));
    if (dist > (blast_radius / 2)) {
      continue;
    }

    var sprite = new THREE.Sprite(blastMaterial);
    sprite.scale.set(1 + Math.random(), 0.5 + Math.random(), 1);
    sprite.position.set(x, h, y);
    scene.add(sprite);
    nuke_objects.push(sprite);
    nuke_other_objects.push(sprite);
  }

  // Render rising column.
  var column_radius = 60;
  var risingMaterial = new THREE.SpriteMaterial( { map: webgl_textures["nuke_rising_column"]});
  for (var i = 0; i < 4000; i++) {
    var x = pos['x'] + (Math.random() * column_radius) - (column_radius / 2);
    var h = height + 30 + (Math.random() * column_radius) - (column_radius / 2);
    var y = pos['y']  + (Math.random() * column_radius) - (column_radius / 2);
    var dist = Math.sqrt(((pos['x'] - x) ** 2) + (0.01 * (height + 30 - h) ** 2) + ((pos['y'] - y) ** 2));
    if (dist > (column_radius / 2)) {
      continue;
    }

    var sprite = new THREE.Sprite(risingMaterial);
    sprite.scale.set(1 + Math.random(), 1 + Math.random(), 1);
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
  nuke_active = false;
}

/****************************************************************************
 Animate the nuke particles
****************************************************************************/
function animate_nuke() {
  for (var i = 0; i < nuke_mushroom_objects.length; i++) {
    nuke_mushroom_objects[i].position.set(nuke_mushroom_objects[i].position.x + ( 2 * Math.random()) - 1,
    nuke_mushroom_objects[i].position.y + (2 * Math.random()) - 1 + 0.5,
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