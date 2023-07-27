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
var flag_dy = 0;
var flag_dx = 16;
var flag_dz = 18;

// stores unit positions on the map. tile index is key, unit 3d model is value.
var unit_positions = {};
// stores city positions on the map. tile index is key, unit 3d model is value.
var city_positions = {};
var city_label_positions = {};
var city_walls_positions = {};
var city_disorder_positions = {};
var city_light_positions = {};
var city_building_positions = {};

// stores flag positions on the map. tile index is key, unit 3d model is value.
var unit_flag_positions = {};
var unit_label_positions = {};
var unit_activities_positions = {};

var map_tile_label_positions = {};

var unit_health_positions = {};
var unit_healthpercentage_positions = {};

// stores tile extras (eg specials), key is extra + "." + tile_index.
var tile_extra_positions = {};

// key is tile is, value is list of three.js tree models.
var tile_models_list = {};

var selected_unit_indicator = null;
var selected_unit_material = null;
var selected_unit_material_counter = 0;

var sun_mesh = null;

var special_resources = ["Fish", "Whales", "Oasis", "Wine", "Iron", "Spice", "Ivory" , "Oil", "Coal", "Fruit", "Furs", "Gold", "Gems", "Silk", "Resources", "Fallout", "Game", "Buffalo", "Pheasant", "Wheat"];

/****************************************************************************
  Handles unit positions
****************************************************************************/
function update_unit_position(ptile) {
  var visible_unit = find_visible_unit(ptile);
  var height = 5 + Math.max(ptile['height'], 0.45) * 100 + get_unit_height_offset(visible_unit);

  if (unit_positions[ptile['index']] != null && visible_unit == null) {
    // tile has no visible units, remove it from unit_positions.
    if (scene != null) scene.remove(unit_positions[ptile['index']]);
    delete unit_positions[ptile['index']];

    if (scene != null) scene.remove(unit_flag_positions[ptile['index']]);
    delete unit_flag_positions[ptile['index']];

    if (scene != null) scene.remove(unit_label_positions[ptile['index']]);
    delete unit_label_positions[ptile['index']];
    unit_activities_positions[ptile['index']] = null;

    if (scene != null) scene.remove(unit_health_positions[ptile['index']]);
    delete unit_health_positions[ptile['index']];
    unit_healthpercentage_positions[ptile['index']] = null;
  }

  if (unit_positions[ptile['index']] == null && visible_unit != null) {
    // add new unit to the unit_positions
    var unit_type_name = unit_type(visible_unit)['name'];
    if (unit_type_name == null) {
      return;
    }

    var new_unit = webgl_get_model(unit_type_name, ptile);
    if (new_unit == null) {
      return;
    }
    unit_positions[ptile['index']] = new_unit;
    var pos;
    if (visible_unit['anim_list'].length > 0) {
      var stile = tiles[visible_unit['anim_list'][0]['tile']];
      pos = map_to_scene_coords(stile['x'], stile['y']);
      height = 5 + stile['height'] * 100  + get_unit_height_offset(visible_unit);
    } else {
      pos = map_to_scene_coords(ptile['x'], ptile['y']);
    }
    new_unit.matrixAutoUpdate = false;
    new_unit.position.set(pos['x'] - 11, height -2, pos['y'] - 4);
    var rnd_rotation = Math.floor(Math.random() * 8);
    new_unit.rotateOnAxis(new THREE.Vector3(0,1,0).normalize(), (convert_unit_rotation(rnd_rotation, unit_type(visible_unit)['name'])));
    new_unit.updateMatrix();

    if (scene != null) {
      scene.add(new_unit);
    }
    /* add flag. */
    var pflag = get_unit_nation_flag_sprite(visible_unit);
    var new_flag;
    if (unit_flag_positions[ptile['index']] == null && scene != null) {
      var new_flag = create_flag_sprite(pflag['key']);
      new_flag.position.set(pos['x'] - 10, height + 20, pos['y'] - 20);
      scene.add(new_flag);
      unit_flag_positions[ptile['index']] = new_flag;
    }

    /* indicate focus unit*/
    var funit = get_focus_unit_on_tile(ptile);
    var selected_mesh;
    if (scene != null && funit != null && funit['id'] == visible_unit['id']) {
      if (selected_unit_indicator != null) {
        scene.remove(selected_unit_indicator);
        selected_unit_indicator = null;
      }
      if (visible_unit['anim_list'].length == 0) {
        selected_mesh = new THREE.Mesh( new THREE.RingGeometry( 18, 20, 30), selected_unit_material );
        selected_mesh.castShadow = true;
        selected_mesh.position.set(pos['x'] - 4, height + 2, pos['y'] - 4);
        selected_mesh.rotation.x = -1 * Math.PI / 2;
        scene.add(selected_mesh);
        selected_unit_indicator = selected_mesh;
      }
    }

    anim_objs[visible_unit['id']] = {'unit' : visible_unit['id'], 'mesh' : new_unit, 'flag' : new_flag};


  } else if (unit_positions[ptile['index']] != null && visible_unit != null) {
    // Update of visible unit.
    // TODO: update_unit_position() contains _almost_ the same code twice. this is the duplicate part.
    var unit_type_name = unit_type(visible_unit)['name'];
    var pos;
    if (visible_unit['anim_list'].length > 0) {
      var stile = tiles[visible_unit['anim_list'][0]['tile']];
      pos = map_to_scene_coords(stile['x'], stile['y']);
      height = 5 + stile['height'] * 100  + get_unit_height_offset(visible_unit);
    } else {
      pos = map_to_scene_coords(ptile['x'], ptile['y']);
    }

    if (scene != null) scene.remove(unit_positions[ptile['index']]);
    delete unit_positions[ptile['index']];

    if (scene != null && unit_flag_positions[ptile['index']] != null) scene.remove(unit_flag_positions[ptile['index']]);
    delete unit_flag_positions[ptile['index']];

    var activity;
    if (unit_activities_positions[ptile['index']] != get_unit_activity_text(visible_unit) + tile_units(ptile).length
        && visible_unit['anim_list'].length == 0) {
      // add unit activity label
      if (scene != null && unit_label_positions[ptile['index']] != null) scene.remove(unit_label_positions[ptile['index']]);
      if (scene != null && (get_unit_activity_text(visible_unit) != null || tile_units(ptile).length > 1 || visible_unit['veteran'] > 0)) {
        activity = create_unit_label_sprite(visible_unit, ptile);
        activity.position.set(pos['x'] + 7, height + 20, pos['y'] - 12);
        scene.add(activity);
        unit_label_positions[ptile['index']] = activity;
      }
      unit_activities_positions[ptile['index']] = get_unit_activity_text(visible_unit) + tile_units(ptile).length;
    }

    var new_unit_health_bar;
    if (unit_healthpercentage_positions[ptile['index']] != visible_unit['hp'] && visible_unit['anim_list'].length == 0) {
      if (scene != null && unit_health_positions[ptile['index']] != null) scene.remove(unit_health_positions[ptile['index']]);
      new_unit_health_bar = create_unit_health_sprite(visible_unit);
      new_unit_health_bar.position.set(pos['x'] - flag_dx, height + flag_dz + 6, pos['y'] - flag_dy - 10);
      unit_health_positions[ptile['index']] = new_unit_health_bar;
      if (scene != null) {
        scene.add(new_unit_health_bar);
      }
      unit_healthpercentage_positions[ptile['index']] = visible_unit['hp'];
    }

    /* indicate focus unit*/
    var funit = get_focus_unit_on_tile(ptile);
    var selected_mesh;
    if (scene != null && funit != null && funit['id'] == visible_unit['id']) {
      if (selected_unit_indicator != null) {
        scene.remove(selected_unit_indicator);
        selected_unit_indicator = null;
      }
      if (visible_unit['anim_list'].length == 0) {
        selected_mesh = new THREE.Mesh( new THREE.RingGeometry( 18, 20, 30), selected_unit_material );
        selected_mesh.position.set(pos['x'] - 12, height + 2, pos['y'] - 7);
        selected_mesh.rotation.x = -1 * Math.PI / 2;
        scene.add(selected_mesh);
        selected_unit_indicator = selected_mesh;
      }
    }

    if (unit_type_name == null) {
      console.error(unit_type_name + " model not loaded correcly.");
      return;
    }

    var new_unit = webgl_get_model(unit_type_name, ptile);
    if (new_unit == null) {
      return;
    }
    unit_positions[ptile['index']] = new_unit;
    unit_positions[ptile['index']]['unit_type'] = unit_type_name;

    new_unit.matrixAutoUpdate = false;
    new_unit.position.set(pos['x'] - 11, height -2, pos['y'] - 4);
    new_unit.rotateOnAxis(new THREE.Vector3(0,1,0).normalize(), (convert_unit_rotation(visible_unit['facing'], unit_type(visible_unit)['name']) ));
    new_unit.updateMatrix();

    if (scene != null) {
      scene.add(new_unit);
    }

    /* add flag. */
    var pflag = get_unit_nation_flag_sprite(visible_unit);
    var new_flag;
    if (unit_flag_positions[ptile['index']] == null && scene != null) {
      var new_flag = create_flag_sprite(pflag['key']);
      new_flag.position.set(pos['x'] - flag_dx, height + flag_dz, pos['y'] - flag_dy - 10);
      scene.add(new_flag);
      unit_flag_positions[ptile['index']] = new_flag;
    }

    anim_objs[visible_unit['id']] = {'unit' : visible_unit['id'], 'mesh' : new_unit, 'flag' : new_flag};
  }

}

/****************************************************************************
  Handles city positions
****************************************************************************/
function update_city_position(ptile) {

  var pcity = tile_city(ptile);
  var punits = tile_units(ptile);

  var height = 5 + ptile['height'] * 100 + get_city_height_offset(pcity);

  if (city_positions[ptile['index']] != null && pcity == null) {
    // tile has no city, remove it from unit_positions.
    if (scene != null) scene.remove(city_positions[ptile['index']]);
    delete city_positions[ptile['index']];
    if (scene != null) scene.remove(city_label_positions[ptile['index']]);
    delete city_label_positions[ptile['index']];
    if (scene != null) scene.remove(city_walls_positions[ptile['index']]);
    delete city_walls_positions[ptile['index']];
    if (scene != null && city_disorder_positions[ptile['index']] != null) scene.remove(city_disorder_positions[ptile['index']]);
    delete city_disorder_positions[ptile['index']];
    if (scene != null) {
      scene.remove(city_light_positions[ptile['index']]);
      delete city_light_positions[ptile['index']];
    }
  }

  if (city_positions[ptile['index']] == null && pcity != null) {
    // add new city
    var model_name = city_to_3d_model_name(pcity);
    pcity['webgl_model_name'] = model_name;
    var new_city = webgl_get_model(model_name, ptile);
    if (new_city == null) {
      return;
    }
    city_positions[ptile['index']] = new_city;
    if (pcity['style'] == 1) height -= 0.82;

    var pos = map_to_scene_coords(ptile['x'], ptile['y']);
    new_city.position.set(pos['x'] - 12, height, pos['y'] - 11);
    new_city.rotateOnAxis(new THREE.Vector3(0,1,0).normalize(), (2 * Math.PI * Math.random()));

    if (scene != null) {
      scene.add(new_city);
    }

    if (scene != null && pcity['walls'] && city_walls_positions[ptile['index']] == null) {
      var city_walls = webgl_get_model("citywalls", ptile);
      if (city_walls != null) {
        city_walls.position.set(pos['x'] - 10, height - 7, pos['y'] - 10);
        city_walls.scale.x = city_walls.scale.y = city_walls.scale.z = get_citywalls_scale(pcity);
        scene.add(city_walls);
        city_walls_positions[ptile['index']] = city_walls;
      }
    }

    var city_label = create_city_label_sprite(pcity);
    city_label_positions[ptile['index']] = city_label;
    city_label.position.set(pos['x'] + 10 , height + 27, pos['y'] - 25);

    pcity['webgl_label_hash'] = pcity['name'] + pcity['size'] + pcity['production_value'] + "." + pcity['production_kind'] + punits.length + pcity['nation_id'];
    if (scene != null) scene.add(city_label);

    add_city_buildings(ptile, pcity, scene);

    if (scene != null && city_light_positions[ptile['index']] == null ) {
      var city_light = add_city_lights(pos['x'], pos['y'], height);
      city_light_positions[ptile['index']] = city_light;
    }
    return;
  }

  if (city_positions[ptile['index']] != null && pcity != null) {
    // Update of visible city.
    var model_name = city_to_3d_model_name(pcity);
    if (pcity['webgl_model_name'] != model_name) {
      // update city model to a different size.

      var new_city = webgl_get_model(model_name, ptile);
      if (new_city == null) {
        return;
      }
      if (scene != null) scene.remove(city_positions[ptile['index']]);
      pcity['webgl_model_name'] = model_name;
      city_positions[ptile['index']] = new_city;
      if (pcity['style'] == 1) height -= 0.82;

      var pos = map_to_scene_coords(ptile['x'], ptile['y']);
      new_city.position.set(pos['x'] - 12, height, pos['y'] - 10);
      new_city.rotateOnAxis(new THREE.Vector3(0,1,0).normalize(), (2 * Math.PI * Math.random()));

      if (scene != null) {
        scene.add(new_city);
      }

      if (scene != null && pcity['walls'] && city_walls_positions[ptile['index']] != null) {
        // remove city walls, they need updating.
        scene.remove(city_walls_positions[ptile['index']]);
        delete city_walls_positions[ptile['index']];
      }
    }
    var pos = map_to_scene_coords(ptile['x'], ptile['y']);

    if (scene != null && pcity['walls'] && city_walls_positions[ptile['index']] == null) {
      var city_walls = webgl_get_model("citywalls", ptile);
      if (city_walls != null) {
        city_walls.position.set(pos['x'] - 10, height - 7, pos['y'] - 10);
        city_walls.scale.x = city_walls.scale.y = city_walls.scale.z = get_citywalls_scale(pcity);
        scene.add(city_walls);
        city_walls_positions[ptile['index']] = city_walls;
      }
    }

    add_city_buildings(ptile, pcity, scene);

    if (scene != null && city_light_positions[ptile['index']] == null) {
      var city_light = add_city_lights(pos['x'], pos['y'], height);
      city_light_positions[ptile['index']] = city_light;
    }

    if (pcity['webgl_label_hash'] != pcity['name'] + pcity['size'] + pcity['production_value'] + "." + pcity['production_kind'] + punits.length + pcity['nation_id']) {
      update_city_label(pcity);
      pcity['webgl_label_hash'] = pcity['name'] + pcity['size'] + pcity['production_value'] + "." +  pcity['production_kind'] + punits.length + pcity['nation_id'];
    }
  }

  // City civil disorder label
  if (scene != null && pcity != null) {
    if (city_disorder_positions[ptile['index']] == null && pcity['unhappy']) {
        var city_disorder_sprite = create_city_disorder_sprite();
        city_disorder_sprite.position.set(pos['x'] - 5, height + 25, pos['y'] - 10);
        scene.add(city_disorder_sprite);
        city_disorder_positions[ptile['index']] = city_disorder_sprite;

    } else if (city_disorder_positions[ptile['index']] != null && !pcity['unhappy']) {
      // Remove city civil disorder label
      scene.remove(city_disorder_positions[ptile['index']]);
      delete city_disorder_positions[ptile['index']];
    }
  }

}

/****************************************************************************
  Handles tile extras, such as specials.
****************************************************************************/
function update_tile_extras(ptile) {

  if (ptile == null || tile_get_known(ptile) == TILE_UNKNOWN) return;

  var height = 4 + ptile['height'] * 100;

  webgl_update_farmland_irrigation_vertex_colors(ptile);

  update_tile_extra_update_model(EXTRA_MINE, "Mine", ptile);
  update_tile_extra_update_model(EXTRA_HUT, "Hut", ptile);
  update_tile_extra_update_model(EXTRA_RUINS, "Ruins", ptile);
  update_tile_extra_update_model(EXTRA_AIRBASE, "Airbase", ptile);
  update_tile_extra_update_model(EXTRA_FORTRESS, "Fortress", ptile);
  update_tile_forest(ptile);
  update_tile_jungle(ptile);
  update_tile_cactus(ptile);
  update_tile_wheat(ptile);

  // Render tile specials (extras), as 2D sprites from the 2D version.
  const extra_id = tile_resource(ptile);
  var extra_resource = (extra_id === null) ? null : extras[extra_id];
  if (extra_resource != null && scene != null && tile_extra_positions[extra_resource['id'] + "." + ptile['index']] == null) {
    if (special_resources.includes(extra_resource['rule_name'])) {
      update_tile_extra_update_model(extra_resource['id'], extra_resource['rule_name'], ptile);
    } else {
      var key = extra_resource['graphic_str'];
      var extra_texture = get_extra_texture(key);
      var terrain_name = tile_terrain(ptile).name;

      if (tile_has_extra(ptile, EXTRA_RIVER)) {
        height += 5;
      }
      if (extra_resource['name'] == "Gold" || extra_resource['name'] == "Iron") {
        height -= 5;
        if ((is_ocean_tile_near(ptile) || tile_has_extra(ptile, EXTRA_RIVER)) && tile_terrain(ptile)['name'] == "Mountains") {
          height -= 18;
        }
      }
      if (tile_terrain(ptile) != null && tile_terrain(ptile)['name'].indexOf("Forest") >= 0) {
        height += 1;
      }
      if (terrain_name == "Forest" || terrain_name == "Jungle") {
        height += 4.5;
      }
      var pos = map_to_scene_coords(ptile['x'], ptile['y']);
      const extra_vertices = [];
      extra_vertices.push(pos['x'] - 10, height, pos['y'] - 10);

      var extra_geometry = new THREE.BufferGeometry();
      extra_geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( extra_vertices, 3 ));
      var extra_material = new THREE.PointsMaterial( { size: 42, sizeAttenuation: true, map: extra_texture,  alphaTest: 0.2, transparent: true, opacity: 1.0 } );
      var extra_points = new THREE.Points( extra_geometry, extra_material );
      extra_material.transparent = true;
      scene.add(extra_points);
    }
  }

}

/****************************************************************************
  Adds city buildings
****************************************************************************/
function add_city_buildings(ptile, pcity, scene) {
    add_wonder(ptile, pcity, scene, "Pyramids");
    add_wonder(ptile, pcity, scene, "Lighthouse");
    add_wonder(ptile, pcity, scene, "Statue of Liberty");
    add_wonder(ptile, pcity, scene, "Eiffel Tower");
    add_city_building(ptile, pcity, scene, "Library");
    add_city_building(ptile, pcity, scene, "Temple");
    add_city_building(ptile, pcity, scene, "Barracks");
    add_city_building(ptile, pcity, scene, "Barracks II");
    add_city_building(ptile, pcity, scene, "Barracks III");
    add_city_building(ptile, pcity, scene, "Granary");
    add_city_building(ptile, pcity, scene, "Colosseum");
    add_city_building(ptile, pcity, scene, "Aqueduct");
    add_spaceship(ptile, pcity, scene);

}

/****************************************************************************
  Adds a wonder 3d model.
****************************************************************************/
function add_wonder(ptile, pcity, scene, wonder_name) {
    if (city_has_building(pcity, improvement_id_by_name(wonder_name)) && pcity[wonder_name + '_added'] == null) {
      var wonder = webgl_get_model(wonder_name.replaceAll(" ", ""), ptile);
      if (wonder == null) {
        return;
      }
      var nexttile = ptile;
      for (var i = 0; i < 30; i++) {
        var dir = Math.floor(Math.random() * 8);
        var ntile = mapstep(ptile, dir);
        var nexttile = mapstep(ntile, dir);
        if (is_ocean_tile(nexttile)) {
          ptile = mapstep(ptile, Math.floor(Math.random() * 8));
          continue;
        }
        if (city_positions[nexttile['index']] != null || city_building_positions[nexttile['index']] != null) {
          ptile = mapstep(ptile, Math.floor(Math.random() * 8));
          continue;
        }
        if (wonder_name == 'Lighthouse' && !is_ocean_tile_near(nexttile)) {
          ptile = mapstep(ptile, Math.floor(Math.random() * 8));
          continue;
        }
        if (nexttile != null) {
          break;
        }
      }
      if (nexttile == null) return;

      var height = 5 + nexttile['height'] * 100;
      if (wonder_name == 'Lighthouse') height += 4.2;
      if (wonder_name == 'Statue of Liberty' && is_ocean_tile(nexttile)) height += 20.1;
      if (wonder_name == 'Statue of Liberty' && !is_ocean_tile(nexttile)) height += 21.3;

      if (wonder_name == 'Eiffel Tower') {
        pos = map_to_scene_coords(ntile['x'] - 0.4, ntile['y'] - 0.4);
        height = 22 + ntile['height'] * 100;

      } else {
        pos = map_to_scene_coords(nexttile['x'], nexttile['y']);
      }

      wonder.position.set(pos['x'] - 1, height - 7, pos['y'] - 1);
      pcity[wonder_name + '_added'] = true;
      city_building_positions[nexttile['index']] = true;
      scene.add(wonder);
    }
}

/****************************************************************************
  Adds a city building 3d model.
****************************************************************************/
function add_city_building(ptile, pcity, scene, building_name) {
    if (city_has_building(pcity, improvement_id_by_name(building_name)) && pcity[building_name + '_added'] == null) {
      var building = webgl_get_model(building_name.replaceAll(" ", ""), ptile);
      if (building == null) {
        return;
      }
      var nexttile = ptile;
      for (var i = 0; i < 30; i++) {
        var dir = Math.floor(Math.random() * 8);
        var nexttile = mapstep(ptile, dir);
        if (is_ocean_tile(nexttile) || tile_has_extra(nexttile, EXTRA_RIVER)) {
          ptile = mapstep(ptile, Math.floor(Math.random() * 8));
          continue;
        }
        if (city_positions[nexttile['index']] != null || city_building_positions[nexttile['index']] != null) {
          ptile = mapstep(ptile, Math.floor(Math.random() * 8));
          continue;
        }

        if (nexttile != null) {
          break;
        }
      }
      if (nexttile == null) return;

      var height = 7 + nexttile['height'] * 100;

      if (building_name == "Temple") {
        height -= 0.6;
      }
      if (building_name == "Granary") {
        height += 1.0;
      }
      if (building_name.indexOf("Barracks") >= 0) {
        height -= 0.9;
      }
      pos = map_to_scene_coords(nexttile['x'], nexttile['y']);

      building.position.set(pos['x'] - 14, height - 5, pos['y'] - 14);
      pcity[building_name + '_added'] = true;
      city_building_positions[nexttile['index']] = true;
      scene.add(building);
    }
}

/****************************************************************************
  Adds or removes a extra tile 3d model.
****************************************************************************/
function update_tile_extra_update_model(extra_type, extra_name, ptile)
{
  if (tile_extra_positions[extra_type + "." + ptile['index']] == null && tile_has_extra(ptile, extra_type)) {
    var height = 5 + ptile['height'] * 100;
    if (extra_name == "Hut") {
      height -= 5;
    }
    if (extra_name == "Fish") {
      extra_name = extra_name +  Math.floor(1 + Math.random() * 3);
      height += 0.00;
    }
    if (extra_name == "Whales") {
      height += 0.3;
    }
    if (extra_name == "Mine") {
      height -= 7;
    }
    if (extra_name == "Wine" || extra_name == "Iron" || extra_name == "Spice" || extra_name == "Ivory"  || extra_name == "Coal"  || extra_name == "Gold" ) {
      height -= 7;
    }
    if (extra_name == "Oil") {
      height -= 6;
    }
    if (extra_name == "Ruins") {
      height -= 8;
    }
    if (extra_name == "Oasis") {
      height -= 5.45;
    }
    if (extra_name == "Furs") {
      height -= 2;
    }
    if (extra_name == "Resources") {
      height -= 6;
    }
    if (extra_name == "Game") {
      height += 2.2;
    }
    if (extra_name == "Pheasant") {
      height += 1.5;
    }
    if (extra_name == "Airbase") {
      height -= 4.9;
    }
    if (extra_name == "Fortress") {
      height -= 3.5;
    }

    var model = webgl_get_model(extra_name, ptile);
    if (model == null) {
      return;
    }

    tile_extra_positions[extra_type + "." + ptile['index']] = model;
    var pos = map_to_scene_coords(ptile['x'], ptile['y']);
    model.position.set( pos['x'] - 10, height + 1,  pos['y'] - 10);
    model.rotateOnAxis(new THREE.Vector3(0,1,0).normalize(), (2 * Math.PI * Math.random()));
    if (extra_name == "Furs" || extra_name == "Silk"  || extra_name == "Resources") {
      model.rotateOnAxis(new THREE.Vector3(1,0,0).normalize(), -1 * (Math.PI  / 2));
    }
    if (scene != null) scene.add(model);

  } else if (scene != null && tile_extra_positions[extra_type + "." + ptile['index']] != null && !tile_has_extra(ptile, extra_type)) {
    scene.remove(tile_extra_positions[extra_type + "." + ptile['index']]);
  }
}

/****************************************************************************
  Adds forest
****************************************************************************/
function update_tile_forest(ptile)
{
  var terrain_name = tile_terrain(ptile).name;
  const extra_id = tile_resource(ptile);
  var extra_resource = (extra_id === null) ? null : extras[extra_id];

  if (scene != null && tile_models_list[ptile['index']] == null && terrain_name == "Forest" && tile_get_known(ptile) != TILE_UNKNOWN) {
    var height = 5 + ptile['height'] * 100 + get_forest_offset(ptile);
    tile_models_list[ptile['index']] = [];
    var modelname;
    var rnd = Math.floor(Math.random() * 5);
    if (rnd == 0) {
      modelname = "Tree1";
    } else if (rnd == 1) {
      modelname = "Tree2";
    } else if (rnd == 2) {
      modelname = "Tree3";
    } else if (rnd == 3) {
      modelname = "Pine1";
    } else if (rnd == 4) {
      modelname = "Pine2";
    }
    for (var i = 0; i < 8; i++) {
      var model = webgl_get_model(modelname, ptile);
      var pos = map_to_scene_coords(ptile['x'], ptile['y']);
      model.translateOnAxis(new THREE.Vector3(1,0,0).normalize(), pos['x'] - 10 + (12 - Math.floor(Math.random() * 25)));
      model.translateOnAxis(new THREE.Vector3(0,1,0).normalize(), height);
      model.translateOnAxis(new THREE.Vector3(0,0,1).normalize(), pos['y'] - 10 + (12 - Math.floor(Math.random() * 25)));
      model.rotateOnAxis(new THREE.Vector3(0,1,0).normalize(), (2 * Math.PI * Math.random()));
      tile_models_list[ptile['index']].push(model);
      if (scene != null) scene.add(model);
    }

  } else if (scene != null && tile_models_list[ptile['index']] != null && (extra_resource == null || extra_resource['name'] != "Wheat") && terrain_name != "Forest" && terrain_name != "Jungle" && tile_get_known(ptile) != TILE_UNKNOWN) {
    for (var i = 0; i < tile_models_list[ptile['index']].length; i++) {
      scene.remove(tile_models_list[ptile['index']][i]);
    }
    tile_models_list[ptile['index']] = null;
  }

}

/****************************************************************************
  Adds jungle
****************************************************************************/
function update_tile_jungle(ptile)
{
  var terrain_name = tile_terrain(ptile).name;
  const extra_id = tile_resource(ptile);
  var extra_resource = (extra_id === null) ? null : extras[extra_id];

  if (scene != null && tile_models_list[ptile['index']] == null && terrain_name == "Jungle" && tile_get_known(ptile) != TILE_UNKNOWN) {
    var height = 5 + ptile['height'] * 100 + get_forest_offset(ptile);
    tile_models_list[ptile['index']] = [];
    var modelname;
    var rnd = Math.floor(Math.random() * 2);
    if (rnd == 0) {
      modelname = "Palm1";
    } else if (rnd == 1) {
      modelname = "Palm2";
    }
    for (var i = 0; i < 5; i++) {
      var model = webgl_get_model(modelname, ptile);
      var pos = map_to_scene_coords(ptile['x'], ptile['y']);
      model.translateOnAxis(new THREE.Vector3(1,0,0).normalize(), pos['x'] - 10 + (12 - Math.floor(Math.random() * 25)));
      model.translateOnAxis(new THREE.Vector3(0,1,0).normalize(), height);
      model.translateOnAxis(new THREE.Vector3(0,0,1).normalize(), pos['y'] - 10 + (12 - Math.floor(Math.random() * 25)));
      model.rotateOnAxis(new THREE.Vector3(0,1,0).normalize(), (2 * Math.PI * Math.random()));
      tile_models_list[ptile['index']].push(model);
      if (scene != null) scene.add(model);
    }

  } else if (scene != null && tile_models_list[ptile['index']] != null && terrain_name != "Jungle" && (extra_resource == null || extra_resource['name'] != "Wheat") && terrain_name != "Forest"  && tile_get_known(ptile) != TILE_UNKNOWN) {
    for (var i = 0; i < tile_models_list[ptile['index']].length; i++) {
      scene.remove(tile_models_list[ptile['index']][i]);
    }
    tile_models_list[ptile['index']] = null;
  }
}

/****************************************************************************
  Adds cactus
****************************************************************************/
function update_tile_cactus(ptile)
{
  var terrain_name = tile_terrain(ptile).name;

  var rnd = Math.floor(Math.random() * 12);
  if (rnd != 1) return;

  if (scene != null && tile_models_list[ptile['index']] == null && terrain_name == "Desert" && tile_get_known(ptile) != TILE_UNKNOWN) {
    var height = 5 + ptile['height'] * 100 + get_forest_offset(ptile);
    tile_models_list[ptile['index']] = [];
    var modelname = "Cactus1";
    var model = webgl_get_model(modelname, ptile);
    var pos = map_to_scene_coords(ptile['x'], ptile['y']);
    model.translateOnAxis(new THREE.Vector3(1,0,0).normalize(), pos['x'] - 10 + (15 - Math.floor(Math.random() * 30)));
    model.translateOnAxis(new THREE.Vector3(0,1,0).normalize(), height);
    model.translateOnAxis(new THREE.Vector3(0,0,1).normalize(), pos['y'] - 10 + (15 - Math.floor(Math.random() * 30)));
    model.rotateOnAxis(new THREE.Vector3(0,1,0).normalize(), (2 * Math.PI * Math.random()));
    tile_models_list[ptile['index']].push(model);
    if (scene != null) scene.add(model);

  }
}

/****************************************************************************
  Adds wheat
****************************************************************************/
function update_tile_wheat(ptile)
{
  var terrain_name = tile_terrain(ptile).name;
  const extra_id = tile_resource(ptile);
  var extra_resource = (extra_id === null) ? null : extras[extra_id];

  if (scene != null && extra_resource != null && tile_models_list[ptile['index']] == null && extra_resource['name'] == "Wheat" && tile_get_known(ptile) != TILE_UNKNOWN) {
    var height = 5 + ptile['height'] * 100 + get_forest_offset(ptile);
    tile_models_list[ptile['index']] = [];
    var modelname = "Wheat";
    for (var i = 0; i < 10; i++) {
      var model = webgl_get_model(modelname, ptile);
      var pos = map_to_scene_coords(ptile['x'], ptile['y']);
      if (pos != null && model != null) {
        model.translateOnAxis(new THREE.Vector3(1,0,0).normalize(), pos['x'] - 10 + (15 - Math.floor(Math.random() * 30)));
        model.translateOnAxis(new THREE.Vector3(0,1,0).normalize(), height + 6);
        model.translateOnAxis(new THREE.Vector3(0,0,1).normalize(), pos['y'] - 10 + (15 - Math.floor(Math.random() * 30)));
        model.rotateOnAxis(new THREE.Vector3(0,1,0).normalize(), (2 * Math.PI * Math.random()));
        tile_models_list[ptile['index']].push(model);
        if (scene != null) scene.add(model);
      }
    }

  } else if (scene != null && tile_models_list[ptile['index']] != null && (extra_resource == null || extra_resource['name'] != "Wheat") && terrain_name != "Forest" && terrain_name != "Jungle" && tile_get_known(ptile) != TILE_UNKNOWN) {
    for (var i = 0; i < tile_models_list[ptile['index']].length; i++) {
      scene.remove(tile_models_list[ptile['index']][i]);
    }
    tile_models_list[ptile['index']] = null;
  }

}

/****************************************************************************
  Clears the selected unit indicator.
****************************************************************************/
function webgl_clear_unit_focus()
{
  if (scene != null && selected_unit_indicator != null) {
    scene.remove(selected_unit_indicator);
    selected_unit_indicator = null;
  }
}

/****************************************************************************
  Adds all units and cities to the map.
****************************************************************************/
function add_all_objects_to_scene()
{
  unit_positions = {};
  city_positions = {};
  city_label_positions = {};
  city_walls_positions = {};
  unit_flag_positions = {};
  unit_label_positions = {};
  unit_activities_positions = {};
  unit_health_positions = {};
  unit_healthpercentage_positions = {};
  tile_extra_positions = {};
  road_positions = {};
  rail_positions = {};

  for (var unit_id in units) {
    var punit = units[unit_id];
    var ptile = index_to_tile(punit['tile']);
    update_unit_position(ptile);
  }

  for (var city_id in cities) {
    var pcity = cities[city_id];
    update_city_position(city_tile(pcity));
  }

  for (var tile_id in tiles) {
    update_tile_extras(tiles[tile_id]);
  }


}

/****************************************************************************
 Add city lights
****************************************************************************/
function add_city_lights(x, y, height) {
  var texture = webgl_textures["city_light"];
  var sprite = new THREE.Sprite( new THREE.SpriteMaterial( { map: texture}));
  sprite.scale.set(30, 30, 1);
  sprite.renderOrder = 0.1;
  sprite.position.set(x - 10, height + 3, y - 10);
  scene.add(sprite);
  return sprite;

}