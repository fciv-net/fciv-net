/**********************************************************************
    Fciv.net - the web version of Freeciv. http://www.fciv.net/
    Copyright (C) 2009-2022  The Freeciv-web project

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

var container, stats;
var scene, maprenderer;
var anaglyph_effect;

var mouse, raycaster;
var spotlight;
var clock;

var controls;

var tiletype_terrains = ["coast","ocean","arctic","desert","grassland","hills","mountains","plains","swamp","tundra", "farmland", "irrigation"];

var landGeometry;
var landMesh; // the terrain land geometry
var water;

var lofiGeometry;
var lofiMesh;  // low resolution mesh used for raycasting.
var freeciv_uniforms;
var terrain_material;

var mapview_model_width;
var mapview_model_height;
var xquality;
var yquality;

var width_half;
var height_half;
var gridX;
var gridY;
var gridX1;
var gridY1;
var segment_width;
var segment_height;
var MAPVIEW_ASPECT_FACTOR = 35.71;


/****************************************************************************
  Start the Freeciv-web WebGL renderer
****************************************************************************/
function webgl_start_renderer()
{
  var new_mapview_width = $(window).width() - width_offset;
  var new_mapview_height;
  if (!is_small_screen()) {
    new_mapview_height = $(window).height() - height_offset;
  } else {
    new_mapview_height = $(window).height() - height_offset - 40;
  }

  console.log("Three.js " + THREE.REVISION);
  THREE.ColorManagement.enabled = true;
  if (webgpu) {
    console.log("WebGPU experimental renderer.");
  }

  container = document.getElementById('mapcanvas');
  camera = new THREE.PerspectiveCamera( 45, new_mapview_width / new_mapview_height, 1, 12000 );
  scene = new THREE.Scene();

  raycaster = new THREE.Raycaster();
  raycaster.layers.set(6);

  mouse = new THREE.Vector2();

  clock = new THREE.Clock();

  // Lights
  var ambientLight = new THREE.AmbientLight( 0x606060, 26 * Math.PI );
  scene.add(ambientLight);

  spotlight = new THREE.SpotLight( 0xffffff, 2.9 * Math.PI, 0, Math.PI / 3, 0.001, 0.5);
  scene.add( spotlight );

  spotlight.castShadow = true;
  spotlight.shadow.camera.near = 100;
  spotlight.shadow.camera.far = 3000;
  spotlight.shadow.bias = 0.0001;

  spotlight.shadow.mapSize.x = 4096;
  spotlight.shadow.mapSize.y = 4096;


  var enable_antialiasing = graphics_quality >= QUALITY_MEDIUM;
  var stored_antialiasing_setting = simpleStorage.get("antialiasing_setting", "");
  if (stored_antialiasing_setting != null && stored_antialiasing_setting == "false") {
    enable_antialiasing = false;
  }

  if (!webgpu) {
    maprenderer = new THREE.WebGLRenderer( { antialias: enable_antialiasing, preserveDrawingBuffer: true } );

    maprenderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    if (graphics_quality == QUALITY_HIGH) {
      maprenderer.shadowMap.enabled = true;
      maprenderer.shadowMap.type = THREE.PCFShadowMap;
    }
  } else {
    maprenderer = new THREE.WebGPURenderer( { antialias: enable_antialiasing, preserveDrawingBuffer: true } );
  }

  maprenderer.setPixelRatio(window.devicePixelRatio);
  maprenderer.setSize(new_mapview_width, new_mapview_height);
  container.appendChild(maprenderer.domElement);

  controls = new OrbitControls( camera, maprenderer.domElement );
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = 0.9 * Math.PI / 2;

  if (anaglyph_3d_enabled) {
    anaglyph_effect = new AnaglyphEffect( maprenderer );
    anaglyph_effect.setSize( new_mapview_width, new_mapview_height );
  }

  var hours = new Date().getHours();
  var is_day = hours > 6 && hours < 20;

  if (is_day) {
    const sky = new THREE.WebGLCubeRenderTarget(webgl_textures["skybox"].image.height);
    sky.fromEquirectangularTexture(maprenderer, webgl_textures["skybox"]);
    scene.background = sky.texture;
  } else {
    const sky = new THREE.WebGLCubeRenderTarget(2000);
    sky.fromEquirectangularTexture(maprenderer, create_star_sky_texture(13000, 5500, 2500));
    scene.background = sky.texture;
  }

  animate();

  if (is_small_screen()) {
    camera_dx = 38 * 1.3;
    camera_dy = 410 * 1.3;
    camera_dz = 242 * 1.3;
  }

  $("#pregame_page").hide();
}


/****************************************************************************
 This will render the map terrain mesh.
****************************************************************************/
function init_webgl_mapview() {

  selected_unit_material = new THREE.MeshBasicMaterial( { color: 0xf6f7bf, transparent: true, opacity: 0.5} );

  var textureLoader = new THREE.TextureLoader();
  var waterGeometry = new THREE.PlaneGeometry( mapview_model_width, mapview_model_height);

  if (!webgpu) {
    water = new Water(waterGeometry, {
      color: '#55c0ff',
      scale: 10,
      flowDirection: new THREE.Vector2( 0.1, -0.1),
      textureWidth: 1024,
      textureHeight: 1024,
      reflectivity : 0.7,
      clipBias : 0.05,
      normalMap0 : textureLoader.load( '/textures/Water_1_M_Normal.jpg' ),
      normalMap1 : textureLoader.load( '/textures/Water_2_M_Normal.jpg' )

      });
  } else {
    let water_material = new THREE.MeshBasicMaterial( { color: 0xaaaaff, transparent: true, opacity: 0.5} );
    water = new THREE.Mesh(waterGeometry, water_material);
  }

  water.rotation.x = - Math.PI * 0.5;
  water.translateOnAxis(new THREE.Vector3(0,0,1).normalize(), 50);
  water.translateOnAxis(new THREE.Vector3(1,0,0).normalize(), Math.floor(mapview_model_width / 2) - 500);
  water.translateOnAxis(new THREE.Vector3(0,1,0).normalize(), -mapview_model_height / 2);
  water.renderOrder = -1; // Render water first, this will sove transparency issues in city labels.
  water.castShadow = false;
  scene.add( water );


  sun_material = new THREE.MeshBasicMaterial( { color: 0xffff00, transparent: true, opacity: 0.8} );

  sun_mesh = new THREE.Mesh( new THREE.RingGeometry( 2, 4, 30), sun_material );
  sun_mesh.castShadow = true;
  sun_mesh.rotation.x = -1 * Math.PI / 2;
  sun_mesh.position.set(- 500, 1000, -400);
  scene.add(sun_mesh);

  /* heightmap image */
  init_borders_image();
  init_roads_image();
  init_map_tiletype_image();

  var vertex_shader = $('#terrain_vertex_shh').html();
  var fragment_shader = $('#terrain_fragment_shh').html();

  if (!webgpu && maprenderer.capabilities.maxTextures <= 16) {
    delete tiletype_terrains["irrigation"];
    console.log("max textures: " + maprenderer.capabilities.maxTextures);
    fragment_shader = fragment_shader.replace("uniform sampler2D irrigation;", "")
                                     .replaceAll("irrigation", "farmland");
  }

  /* uniforms are variables which are used in the fragment shader fragment.js */
  freeciv_uniforms = {
    maptiles: { type: "t", value: maptiletypes },
    borders: { type: "t", value: update_borders_image() },
    map_x_size: { type: "f", value: map['xsize'] },
    map_y_size: { type: "f", value: map['ysize'] },
    mouse_x: { type: "i", value: -1 },
    mouse_y: { type: "i", value: -1 },
    selected_x: { type: "i", value: -1 },
    selected_y: { type: "i", value: -1 },
    roadsmap: { type: "t", value: update_roads_image()},
    roadsprites: {type: "t", value: webgl_textures["roads"]},
    railroadsprites: {type: "t", value: webgl_textures["railroads"]},
    borders_visible: {type: "bool", value: server_settings['borders']['is_visible']}
  };

  for (var i = 0; i < tiletype_terrains.length ; i++) {
    var terrain_name = tiletype_terrains[i];
    freeciv_uniforms[terrain_name] = {type: "t", value: webgl_textures[terrain_name]};
  }
  init_heightmap(terrain_quality);
  update_heightmap(terrain_quality);

  // Low-resolution terrain mesh used for raycasting to find mouse postition.
  var lofiMaterial = new THREE.MeshStandardMaterial({"color" : 0x00ff00});
  lofiGeometry = new THREE.BufferGeometry();
  create_land_geometry(lofiGeometry, 2);
  lofiMesh = new THREE.Mesh( lofiGeometry, lofiMaterial );
  lofiMesh.layers.set(6);
  scene.add(lofiMesh);

  if (map.xsize > 200 || map.ysize > 200) {
    terrain_quality = 2;
  }

  // High-resolution terrain-mesh shown in mapview.
  if (!webgpu) {
    terrain_material = new THREE.ShaderMaterial({
      uniforms: freeciv_uniforms,
      vertexShader: vertex_shader,
      fragmentShader: fragment_shader,
      vertexColors: true
    });
  } else {
    terrain_material = new THREE.MeshStandardMaterial({"color" : 0x009900});
  }

  landGeometry = new THREE.BufferGeometry();
  create_land_geometry(landGeometry, terrain_quality);
  landMesh = new THREE.Mesh( landGeometry, terrain_material );
  landMesh.receiveShadow = false;
  landMesh.castShadow = false;
  scene.add(landMesh);

  if (graphics_quality == QUALITY_HIGH) {
    var shadowMaterial = new THREE.ShadowMaterial();
    shadowMaterial.opacity = 0.85;
    shadowmesh = new THREE.Mesh( landGeometry, shadowMaterial);
    shadowmesh.receiveShadow = true;
    shadowmesh.castShadow = false;
    scene.add(shadowmesh);
  }

  update_map_terrain_geometry();
  setInterval(update_map_terrain_geometry, 40);
  setInterval(update_map_known_tiles, 15);
  setInterval(update_map_tiletypes, 20);

  add_all_objects_to_scene();

  benchmark_start = new Date().getTime();


}

/****************************************************************************
  Create the land terrain geometry
  (note that this changes global variables).
****************************************************************************/
function create_land_geometry(geometry, mesh_quality)
{
  xquality = map.xsize * mesh_quality + 1;
  yquality = map.ysize * mesh_quality + 1;

  width_half = mapview_model_width / 2;
  height_half = mapview_model_height / 2;

  gridX = Math.floor(xquality);
  gridY = Math.floor(yquality);

  gridX1 = gridX + 1;
  gridY1 = gridY + 1;

  segment_width = mapview_model_width / gridX;
  segment_height = mapview_model_height / gridY;

  const indices = [];
  const vertices = [];
  const normals = [];
  const uvs = [];
  const colors = [];

  let heightmap_scale = (mesh_quality == 2) ? (mesh_quality * 2) : 1;

  for ( let iy = 0; iy < gridY1; iy ++ ) {
    const y = iy * segment_height - height_half;
    for ( let ix = 0; ix < gridX1; ix ++ ) {
      const x = ix * segment_width - width_half;
      var sx = ix % xquality, sy = iy % yquality;

      vertices.push( x, -y, heightmap[sx * heightmap_scale][sy * heightmap_scale] * 100 );

      uvs.push( ix / gridX );
      uvs.push( 1 - ( iy / gridY ) );
    }
  }

  for ( let iy = 0; iy < gridY; iy ++ ) {
    for ( let ix = 0; ix < gridX; ix ++ ) {
      const a = ix + gridX1 * iy;
      const b = ix + gridX1 * ( iy + 1 );
      const c = ( ix + 1 ) + gridX1 * ( iy + 1 );
      const d = ( ix + 1 ) + gridX1 * iy;

      indices.push( a, b, d );
      indices.push( b, c, d );
    }
  }

  geometry.setIndex( indices );
  geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
  geometry.setAttribute( 'uv', new THREE.Float32BufferAttribute( uvs, 2 ) );

  geometry.computeVertexNormals();

  return geometry;
}

/****************************************************************************
  Update the map terrain geometry!
****************************************************************************/
function update_map_terrain_geometry()
{
  if (map_geometry_dirty) {
    var hash = generate_heightmap_hash();
    if (hash != heightmap_hash) {
      update_heightmap(terrain_quality);
      create_land_geometry(lofiGeometry, 2);
      create_land_geometry(landGeometry, terrain_quality);

      lofiGeometry.rotateX( - Math.PI / 2 );
      lofiGeometry.translate(Math.floor(mapview_model_width / 2) - 500, 0, Math.floor(mapview_model_height / 2));
      landGeometry.rotateX( - Math.PI / 2 );
      landGeometry.translate(Math.floor(mapview_model_width / 2) - 500, 0, Math.floor(mapview_model_height / 2));
      heightmap_hash = hash;
    }
  }

  map_geometry_dirty = false;
}

/****************************************************************************
  Update the map tiletypes!
****************************************************************************/
function update_map_tiletypes()
{
  if (map_terrain_dirty) {
    update_tiletypes_image();
  }
  map_terrain_dirty = false;
}

/****************************************************************************
  Update the map known tiles!
****************************************************************************/
function update_map_known_tiles()
{
  if (map_known_dirty) {
    update_map_tiletypes();
    update_tiles_known_vertex_colors();
    update_map_terrain_geometry();
  }
  map_known_dirty = false;
}

/****************************************************************************
  Main animation method
****************************************************************************/
function animate() {
  if (scene == null) return;
  if (stats != null) stats.begin();
  if (mapview_slide['active']) update_map_slide_3d();

  update_animated_objects();

  if (selected_unit_indicator != null && selected_unit_material != null) {
    selected_unit_material.color.multiplyScalar (0.994);
    if (selected_unit_material_counter > 80) {
      selected_unit_material_counter = 0;
      selected_unit_material.color.setHex(0xf6f7bf);
    }
    selected_unit_material_counter++;
  }

  controls.update();

  if (anaglyph_3d_enabled) {
    anaglyph_effect.render(scene,camera);
  } else {
    maprenderer.render(scene, camera);
  }

  if (goto_active) check_request_goto_path();
  if (stats != null) stats.end();
  if (initial_benchmark_enabled || benchmark_enabled) benchmark_frames_count++;


  requestAnimationFrame(animate);
}