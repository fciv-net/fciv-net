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

var webgl_textures = {};
var webgl_models = {};
var start_preload = 0;
var total_model_count = 0;
var load_count = 0;
var webgl_materials = {};

var meshes = {};

var model_filenames_initial = ["Settlers",   "Explorer",   "Workers", "city_european_0",  "city_modern_0", "city_roman_0", "Warriors", "citywalls",
                               "Cactus1", "Palm1", "Palm2", "Pine1", "Pine2", "Tree1", "Tree2", "Tree3", "Fish1", "Fish2", "Fish3", "Whales"];
var tiles_of_unloaded_models_map = {};
var models_loading_map = {}; // used to keep track of which models are loading, to prevent loading the same models multiple times.

/****************************************************************************
  Preload textures and models
****************************************************************************/
function webgl_preload()
{
  $.blockUI({ message: "<h2>Downloading 3D models <span id='download_progress'></span></h2>" });
  start_preload = new Date().getTime();

  var loadingManager = new THREE.LoadingManager();
  loadingManager.onLoad = function () {
    webgl_preload_models();
  };

  var textureLoader = new THREE.ImageLoader( loadingManager );

  var disorder_sprite = new THREE.Texture();
  webgl_textures["city_disorder"] = disorder_sprite;
  textureLoader.load( '/textures/city_civil_disorder.png', function ( image ) {
      disorder_sprite.image = image;
      disorder_sprite.needsUpdate = true;
  } );

  for (var i = 0; i < tiletype_terrains.length ; i++) {
    var terrain_name = tiletype_terrains[i];
    textureLoader.load("/textures/large/" + terrain_name + ".png", handle_new_texture("/textures/large/" + terrain_name + ".png", terrain_name));
  }


  /* Preload road textures. */
  var imgurl = "/textures/large/roads.png";
  textureLoader.load(imgurl, (function (url) {
          return function (image) {
                $("#download_progress").html(" road textures 15%");
                webgl_textures["roads"] = new THREE.Texture();
                webgl_textures["roads"].image = image;
                webgl_textures["roads"].wrapS = THREE.RepeatWrapping;
                webgl_textures["roads"].wrapT = THREE.RepeatWrapping;
                webgl_textures["roads"].magFilter = THREE.LinearFilter;
                webgl_textures["roads"].minFilter = THREE.LinearFilter;
                webgl_textures["roads"].needsUpdate = true;
            }
    })(imgurl)
  );

  /* Preload railroads textures. */
  imgurl = "/textures/large/railroads.png";
  textureLoader.load(imgurl, (function (url) {
          return function (image) {
                $("#download_progress").html(" railroad textures 25%");
                webgl_textures["railroads"] = new THREE.Texture();
                webgl_textures["railroads"].image = image;
                webgl_textures["railroads"].wrapS = THREE.RepeatWrapping;
                webgl_textures["railroads"].wrapT = THREE.RepeatWrapping;
                webgl_textures["railroads"].magFilter = THREE.LinearFilter;
                webgl_textures["railroads"].minFilter = THREE.LinearFilter;
                webgl_textures["railroads"].needsUpdate = true;
            }
    })(imgurl)
  );

  var city_light = new THREE.Texture();
  webgl_textures["city_light"] = city_light;
  textureLoader.load( '/textures/city_light.png', function ( image ) {
      city_light.image = image;
      city_light.needsUpdate = true;
  } );

  var nuke_grey_blast_area = new THREE.Texture();
  webgl_textures["nuke_grey_blast_area"] = nuke_grey_blast_area;
  textureLoader.load( '/textures/nuke_grey_blast_area.png', function ( image ) {
      nuke_grey_blast_area.image = image;
      nuke_grey_blast_area.needsUpdate = true;
  } );

  var nuke_inner_mushroom_cloud = new THREE.Texture();
  webgl_textures["nuke_inner_mushroom_cloud"] = nuke_inner_mushroom_cloud;
  textureLoader.load( '/textures/nuke_inner_mushroom_cloud.png', function ( image ) {
      nuke_inner_mushroom_cloud.image = image;
      nuke_inner_mushroom_cloud.needsUpdate = true;
  } );

  var nuke_outer_mushroom_cloud = new THREE.Texture();
  webgl_textures["nuke_outer_mushroom_cloud"] = nuke_outer_mushroom_cloud;
  textureLoader.load( '/textures/nuke_outer_mushroom_cloud.png', function ( image ) {
      nuke_outer_mushroom_cloud.image = image;
      nuke_outer_mushroom_cloud.needsUpdate = true;
  } );

  var nuke_hot_mushroom_cloud = new THREE.Texture();
  webgl_textures["nuke_hot_mushroom_cloud"] = nuke_hot_mushroom_cloud;
  textureLoader.load( '/textures/nuke_hot_mushroom_cloud.png', function ( image ) {
      nuke_hot_mushroom_cloud.image = image;
      nuke_hot_mushroom_cloud.needsUpdate = true;
  } );

  var nuke_rising_column = new THREE.Texture();
  webgl_textures["nuke_rising_column"] = nuke_rising_column;
  textureLoader.load( '/textures/nuke_rising_column.png', function ( image ) {
      nuke_rising_column.image = image;
      nuke_rising_column.needsUpdate = true;
  } );

  var nuke_shock_wave = new THREE.Texture();
  webgl_textures["nuke_shock_wave"] = nuke_shock_wave;
  textureLoader.load( '/textures/nuke_shock_wave.png', function ( image ) {
      nuke_shock_wave.image = image;
      nuke_shock_wave.needsUpdate = true;
  } );

  var nuke_glow = new THREE.Texture();
  webgl_textures["nuke_glow"] = nuke_glow;
  textureLoader.load( '/textures/nuke_glow.png', function ( image ) {
      nuke_glow.image = image;
      nuke_glow.needsUpdate = true;
  } );

  var hours = new Date().getHours();
  var is_day = hours > 6 && hours < 20;

  imgurl = (is_day || is_small_screen()) ? '/textures/sky.jpg' : '/textures/sky_night.png';
  textureLoader.load(imgurl, (function (url) {
          return function (image) {
                webgl_textures["skybox"] = new THREE.Texture();
                webgl_textures["skybox"].image = image;
                webgl_textures["skybox"].wrapS = THREE.RepeatWrapping;
                webgl_textures["skybox"].wrapT = THREE.RepeatWrapping;
                webgl_textures["skybox"].magFilter = THREE.LinearFilter;
                webgl_textures["skybox"].minFilter = THREE.LinearFilter;
                webgl_textures["skybox"].needsUpdate = true;
            }
    })(imgurl)
  );

}

/****************************************************************************
  ...
****************************************************************************/
function handle_new_texture(url, terrain_name)
{
  return function (image) {
                var texture = new THREE.Texture();
                texture.image = image;
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.magFilter = THREE.LinearFilter;
                texture.minFilter = THREE.LinearFilter;
                texture.needsUpdate = true;
                webgl_textures[terrain_name] = texture;
  }
}

/****************************************************************************
  Preload all models.
****************************************************************************/
function webgl_preload_models()
{
  total_model_count = model_filenames_initial.length;
  for (var i = 0; i < model_filenames_initial.length; i++) {
    load_model(model_filenames_initial[i]);
  }
}

/****************************************************************************
 Load glTF (binary .glb) model from the server and import is as a model mesh.
****************************************************************************/
function load_model(filename)
{
  var url = "/gltf/" + filename + ".glb";
  const loader = new GLTFLoader();

  loader.load( url, function(data) {
    var model = data.scene;
    if (C_S_PREPARING == client_state()) {
      $("#download_progress").html(" 3D models " + Math.floor(30 + (0.7 * 100 * load_count / total_model_count)) + "%");
    }

    model.traverse((node) => {
      if (node.isMesh) {
        node.material.flatShading = false;
        node.material.side = THREE.DoubleSide;
        node.material.needsUpdate = true;
        node.geometry.computeVertexNormals();

        if (filename == "Oasis" && node['name'] == "Groundlow") {
          node.material.opacity = 0.45;
          node.material.transparent = true;
        }
        node.castShadow = true;
        if (filename == "Oasis") {
          node.castShadow = false;
        }
      }
    });

  var modelscale = 12;
  if (filename == 'Horsemen' || filename == 'Knights') {
    modelscale = 10;
  }
  if (filename == 'Trireme') {
    modelscale = 4.5;
  }
  if (filename == 'Caravel') {
    modelscale = 7;
  }
  if (filename == 'Chariot') {
    modelscale = 6;
  }
  if (filename == 'Mech. Inf.') {
    modelscale = 9;
  }

  if (filename == "Tree1" || filename == "Tree2" || filename == "Tree3" ) {
    modelscale = 29.5;
  }
  if (filename == "Palm1" || filename == "Palm2") {
    modelscale = 31;
  }
  if (filename == "Cactus1") {
    modelscale = 47;
  }
  if (filename == "Pine1" || filename == "Pine2") {
    modelscale = 40.5;
  }
  if (filename == "Fish1") {
    modelscale = 2.1;
  }
  if (filename == "Fish2") {
    modelscale = 1.9;
  }
  if (filename == "Fish3") {
    modelscale = 2.1;
  }

  if (filename == "Whales") {
    modelscale = 1.65;
  }

  if (filename == "Hut") {
    modelscale = 8;
  }

  if (filename == "Mine") {
    modelscale = 15;
  }
  if (filename == "Oil") {
    modelscale = 18;
  }

  if (filename == "Zeppelin") {
    modelscale = 7;
  }
  if (filename == "Pyramids") {
    modelscale = 5.0;
  }
  if (filename == "StatueOfLiberty") {
    modelscale = 5.4;
  }
  if (filename == "EiffelTower") {
    modelscale = 8;
  }
  if (filename == "Lighthouse") {
    modelscale = 4.8;
  }
  if (filename == 'Iron') {
    modelscale = 9;
  }
  if (filename == 'Furs') {
    modelscale = 4;
  }
  if (filename == 'Gems') {
    modelscale = 3;
  }
  if (filename == 'Coal') {
    modelscale = 9;
  }
  if (filename == 'Fruit') {
    modelscale = 6;
  }
  if (filename == 'Silk') {
    modelscale = 4;
  }
  if (filename == 'Resources') {
    modelscale = 3.5;
  }
  if (filename == 'Fallout') {
    modelscale = 6;
  }
  if (filename == 'Game') {
    modelscale = 3.7;
  }
  if (filename == 'Ivory') {
    modelscale = 6;
  }
  if (filename == 'Buffalo') {
    modelscale = 3.0;
  }
  if (filename == 'Pheasant') {
    modelscale = 1.5;
  }
  if (filename == 'Wheat') {
    modelscale = 3.2;
  }
  if (filename == 'Galleon') {
    modelscale = 4.4;
  }
  if (filename == 'Frigate') {
    modelscale = 5.3;
  }
  if (filename == 'Airbase') {
    modelscale = 8;
  }
  if (filename == 'Fortress') {
    modelscale = 8;
  }
  if (filename == 'Engineers') {
    modelscale = 8.5;
  }
  if (filename == 'Nuclear') {
    modelscale = 9;
  }
  if (filename == 'Settlers') {
    modelscale = 10;
  }
  if (filename == 'Spaceship' || filename == 'Spaceship_launched') {
    modelscale = 3.3;
  }
  if (filename == 'Ironclad') {
    modelscale = 2.9;
  }
  if (filename == 'city_roman_0' || filename == 'city_roman_1' || filename == 'city_roman_2' || filename == 'city_roman_3'
      || filename == 'city_roman_4' || filename == 'city_roman_capital') {
    modelscale = 2.1;
  }
  if (filename == 'Ruins') {
    modelscale = 7;
  }

    model.scale.x = model.scale.y = model.scale.z = modelscale;
    webgl_models[filename] = model;

    load_count++;
    if (load_count == total_model_count) webgl_preload_complete();

    /* Update view of tiles where model now has been downloaded. */
    for (ptile_index in tiles_of_unloaded_models_map) {
      var ptile = tiles[ptile_index];
      if (ptile == null) continue;
      var model_filename = tiles_of_unloaded_models_map[ptile_index];
      if (filename == model_filename) {
        update_unit_position(ptile);
        update_city_position(ptile);
        update_tile_extras(ptile);
        delete tiles_of_unloaded_models_map[ptile_index];
        delete models_loading_map[model_filename];
      }
    }

   });
}

/****************************************************************************
 Returns a single 3D model mesh object.
****************************************************************************/
function webgl_get_model(filename, ptile)
{
  if (webgl_models[filename] != null) {
    return webgl_models[filename].clone();
  } else {
    // Download model and redraw the tile when loaded.
    tiles_of_unloaded_models_map[ptile['index']] = filename;

    if (models_loading_map[filename] == null) {
      models_loading_map[filename] = filename;
      load_model(filename);
    }

    return null;
  }
}

/****************************************************************************
 Returns a extra texture
****************************************************************************/
function get_extra_texture(key)
{
  if (key != null && texture_cache[key] != null) {
      return texture_cache[key];
  }
  if (sprites[key] == null ) {
    console.log("Invalid extra key: " + key);
    return null;
  }

  var ecanvas = document.createElement("canvas");
  ecanvas.width = 42;
  ecanvas.height = 42;
  var econtext = ecanvas.getContext("2d");
  econtext.drawImage(sprites[key], 14, 6,
                sprites[key].width - 33, sprites[key].height,
                0,0,42,42);

  // Create a new texture out of the canvas
  var texture = new THREE.Texture(ecanvas);
  texture.needsUpdate = true;
  texture_cache[key] = texture;

  return texture;
}
