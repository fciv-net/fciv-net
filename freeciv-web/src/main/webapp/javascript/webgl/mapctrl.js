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

var timeOfLastPinchZoom = new Date().getTime();
var map_select_check = false;
var map_select_active = false;

var map_select_check_started = 0;
var map_select_x;
var map_select_y;
var map_select_lines = [];
var map_zoom_button_zoom_out = true;

/****************************************************************************
 Init WebGL mapctrl.
****************************************************************************/
function init_webgl_mapctrl()
{
  $("#mapcanvas").mousedown(webglOnDocumentMouseDown);
  $("#mapcanvas").mouseup(webglOnDocumentMouseUp);
  $(window).mousemove(mouse_moved_cb);

  if (is_touch_device()) {
    $('#mapcanvas').bind('touchstart', webgl_mapview_touch_start);
    $('#mapcanvas').bind('touchend', webgl_mapview_touch_end);
    $('#mapcanvas').bind('touchmove', webgl_mapview_touch_move);
  }

  window.addEventListener('resize', webglOnWindowResize, false );

  controls = new OrbitControls( camera, maprenderer.domElement );
  controls.enableDamping = !is_small_screen();
  controls.enablePan = false;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = 0.9 * Math.PI / 2;

}


/****************************************************************************
...
****************************************************************************/
function webglOnWindowResize() {

  if (camera != null) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }
  if (maprenderer != null) {
    maprenderer.setSize(window.innerWidth, window.innerHeight);
  }
}

/****************************************************************************
Triggered when the mouse button is clicked UP on the mapview canvas.
****************************************************************************/
function webglOnDocumentMouseUp( e ) {

  var rightclick = false;
  var middleclick = false;

  if (!e) var e = window.event;
  if (e.which) {
    rightclick = (e.which == 3);
    middleclick = (e.which == 2);
  } else if (e.button) {
    rightclick = (e.button == 2);
    middleclick = (e.button == 1 || e.button == 4);
  }

  var ptile = webgl_canvas_pos_to_tile(e.clientX, e.clientY - $("#mapcanvas").offset().top);
  if (ptile == null) return;

  if (rightclick) {
    /* right click to recenter. */
    if (!map_select_active) {
      context_menu_active = true;
      webgl_recenter_button_pressed(ptile);
    } else {
      context_menu_active = false;
      map_select_units(mouse_x, mouse_y);
    }
    map_select_active = false;
    map_select_check = false;

  } else if (!middleclick) {
    /* Left mouse button*/
    do_map_click(ptile, SELECT_POPUP, true);
    update_mouse_cursor();
  }
  e.preventDefault();
  keyboard_input = true;
}

/****************************************************************************
  Triggered when the mouse button is clicked DOWN on the mapview canvas.
****************************************************************************/
function webglOnDocumentMouseDown(e) {
  var rightclick = false;
  var middleclick = false;

  if (active_city != null) return;

  if (!e) var e = window.event;
  if (e.which) {
    rightclick = (e.which == 3);
    middleclick = (e.which == 2);
  } else if (e.button) {
    rightclick = (e.button == 2);
    middleclick = (e.button == 1 || e.button == 4);
  }

  if (!rightclick && !middleclick) {
    /* Left mouse button is down */
    if (goto_active) return;

    var ptile = webgl_canvas_pos_to_tile(e.clientX, e.clientY - $("#mapcanvas").offset().top);
    set_mouse_touch_started_on_unit(ptile);
    check_mouse_drag_unit(ptile);
    touch_start_x = mouse_x;
    touch_start_y = mouse_y;

  } else if (middleclick || e['altKey']) {
    popit();
    return false;
  } else if (rightclick && !map_select_active && is_right_mouse_selection_supported()) {

    map_select_check = true;
    map_select_x = mouse_x;
    map_select_y = mouse_y;
    map_select_check_started = new Date().getTime();

    /* The context menu blocks the right click mouse up event on some
     * browsers. */
    context_menu_active = false;
  }
}


/****************************************************************************
  This function is triggered when beginning a touch event on a touch device,
  eg. finger down on screen.
****************************************************************************/
function webgl_mapview_touch_start(e)
{
  e.preventDefault();

  touch_start_x = e.originalEvent.touches[0].pageX - $('#mapcanvas').position().left;
  touch_start_y = e.originalEvent.touches[0].pageY - $('#mapcanvas').position().top;

  var ptile = webgl_canvas_pos_to_tile(touch_start_x, touch_start_y);
  set_mouse_touch_started_on_unit(ptile);
}

/****************************************************************************
  This function is triggered when ending a touch event on a touch device,
  eg finger up from screen.
****************************************************************************/
function webgl_mapview_touch_end(e)
{
  if (new Date().getTime() - timeOfLastPinchZoom < 400) {
    return;
  }
  webgl_action_button_pressed(touch_start_x, touch_start_y, SELECT_POPUP);
}

/****************************************************************************
  This function is triggered on a touch move event on a touch device.
****************************************************************************/
function webgl_mapview_touch_move(e)
{
  mouse_x = e.originalEvent.touches[0].pageX - $('#mapcanvas').position().left;
  mouse_y = e.originalEvent.touches[0].pageY - $('#mapcanvas').position().top;

  var spos = webgl_canvas_pos_to_map_pos(touch_start_x, touch_start_y);
  var epos = webgl_canvas_pos_to_map_pos(mouse_x, mouse_y);

  touch_start_x = mouse_x;
  touch_start_y = mouse_y;
  var ptile = webgl_canvas_pos_to_tile(mouse_x, mouse_y);
  if (!goto_active) {
    check_mouse_drag_unit(ptile);
  }

  if (client.conn.playing == null) return;

  /* Request preview goto path */
  goto_preview_active = true;
  if (goto_active && current_focus.length > 0) {
    if (ptile != null) {
      for (var i = 0; i < current_focus.length; i++) {
        if (i >= 20) return;  // max 20 units goto a time.
        if (goto_request_map[current_focus[i]['id'] + "," + ptile['x'] + "," + ptile['y']] == null) {
          request_goto_path(current_focus[i]['id'], ptile['x'], ptile['y']);
        }
      }
    }
    return;
  }

  if (spos != null && epos != null) {
    camera_look_at(camera_current_x + spos['x'] - epos['x'], camera_current_y, camera_current_z + spos['y'] - epos['y']);
  }
}


/**************************************************************************
  Recenter the map on the canvas location, on user request.  Usually this
  is done with a right-click.
**************************************************************************/
function webgl_recenter_button_pressed(ptile)
{
  if (can_client_change_view() && ptile != null) {
    var sunit = find_visible_unit(ptile);
    let pcity = tile_city(ptile)
    if (!client_is_observer() && (sunit != null && sunit['owner'] == client.conn.playing.playerno) || (pcity != null && pcity['owner'] == client.conn.playing.playerno)) {
      /* the user right-clicked on own unit, show context menu instead of recenter. */
      if (current_focus.length <= 1) set_unit_focus(sunit);
      do_map_click(ptile, SELECT_POPUP, true);
      $("#mapcanvas").contextMenu(true);
      $("#mapcanvas").contextmenu();
    } else if (!client_is_observer() && (sunit != null && sunit['owner'] != client.conn.playing.playerno) || (pcity != null && pcity['owner'] != client.conn.playing.playerno)) {
      $("#mapcanvas").contextMenu(false);
      popit_req(ptile);
    } else {
      $("#mapcanvas").contextMenu(false);
      enable_mapview_slide_3d(ptile);
    }
  }
}

/**************************************************************************
  Do some appropriate action when the "main" mouse button (usually
  left-click) is pressed.  For more sophisticated user control use (or
  write) a different xxx_button_pressed function.
**************************************************************************/
function webgl_action_button_pressed(canvas_x, canvas_y, qtype)
{
  var ptile = webgl_canvas_pos_to_tile(canvas_x, canvas_y);

  if (can_client_change_view() && ptile != null) {
    do_map_click(ptile, qtype, true);
  }
}

/**************************************************************************
...
**************************************************************************/
function highlight_map_tile_mouse(x, y)
{
  if (!webgpu && terrain_material != null && !map_select_active) {
    terrain_material.uniforms.mouse_x.value = x;
    terrain_material.uniforms.mouse_x.needsUpdate = true;
    terrain_material.uniforms.mouse_y.value = y;
    terrain_material.uniforms.mouse_y.needsUpdate = true;
  }
}

/**************************************************************************
...
**************************************************************************/
function highlight_map_tile_selected(x, y)
{
  if (!webgpu && terrain_material != null) {
    terrain_material.uniforms.selected_x.value = x;
    terrain_material.uniforms.selected_x.needsUpdate = true;
    terrain_material.uniforms.selected_y.value = y;
    terrain_material.uniforms.selected_y.needsUpdate = true;
  }
}

/**************************************************************************
Selects units in the map selection rectangle.
**************************************************************************/
function map_select_units(mouse_x, mouse_y)
{
  if (client_is_observer()) return;
  webgl_clear_unit_focus();
  
  var selected_units = [];

  for (let i = 0; i < map_select_lines.length; i++) {
    scene.remove(map_select_lines[i]);
  }
  map_select_lines = [];


  let x1 = map_select_x;
  let y1 = map_select_y;
  let x2 = mouse_x;
  let y2 = mouse_y;

  if (x1 > x2) {
    let tmp = x1;
    x1 = x2;
    x2 = tmp;
  }
  if (y1 > y2) {
    let tmp = y1;
    y1 = y2;
    y2 = tmp;
  }

  let selected_map_tiles = {};
  for (let x = x1; x < x2; x += 15) {
    for (let y = y1; y < y2; y += 15) {
      var ptile = webgl_canvas_pos_to_tile_quick(x, y);
      if (ptile != null) {
        selected_map_tiles[ptile['index']] = ptile;
      }
    }
  }

  for (var tile_id in selected_map_tiles) {
    var ptile = selected_map_tiles[tile_id];
    let cunits = tile_units(ptile);
    if (cunits == null) continue;
    for (var i = 0; i < cunits.length; i++) {
      var aunit = cunits[i];
      if (aunit['owner'] == client.conn.playing.playerno) {
        selected_units.push(aunit);
      }
    }
  }
  current_focus = selected_units;
  action_selection_next_in_focus(IDENTITY_NUMBER_ZERO);
  update_active_units_dialog();

}

/**************************************************************************
Draws a rectangle on the map representing the unit selection.
**************************************************************************/
function map_draw_select_lines() {

  for (let i = 0; i < map_select_lines.length; i++) {
    scene.remove(map_select_lines[i]);
  }
  map_select_lines = [];

  let x1 = map_select_x;
  let y1 = map_select_y;
  let x2 = mouse_x;
  let y2 = mouse_y;

  let pos1 = webgl_canvas_pos_to_map_pos(x1, y1);
  let pos2 = webgl_canvas_pos_to_map_pos(x2, y1);
  let pos3 = webgl_canvas_pos_to_map_pos(x1, y2);
  let pos4 = webgl_canvas_pos_to_map_pos(x2, y2);
  if (pos1 == null || pos2 == null || pos3 == null || pos4 == null) {
    return;
  }

  var height = 5 + 0.75 * 100;

  const material = new THREE.LineDashedMaterial({
  	color: 0xff0000,
  	linewidth: 2,
  });

  const points = [];


  points.push( new THREE.Vector3( pos1['x'], height, pos1['y']));
  points.push( new THREE.Vector3( pos2['x'], height, pos2['y']));
  points.push( new THREE.Vector3( pos4['x'], height, pos4['y']));
  points.push( new THREE.Vector3( pos3['x'], height, pos3['y']));
  points.push( new THREE.Vector3( pos1['x'], height, pos1['y']));

  const geometry = new THREE.BufferGeometry().setFromPoints( points );

  const selectline = new THREE.Line( geometry, material );
  scene.add(selectline);
  map_select_lines.push(selectline);

}

/**************************************************************************
 Zoom the map out / in when a button in clicked in the toolbar.
**************************************************************************/
function zoom_map_in_out() {

  if (map_zoom_button_zoom_out) {
    camera.position.y += 1600;
    camera.position.y = Math.min(camera.position.y, 2000);
  } else {
    camera.position.y -= 1600;
    camera.position.y = Math.max(camera.position.y, 330);
  }
  map_zoom_button_zoom_out = !map_zoom_button_zoom_out;

}