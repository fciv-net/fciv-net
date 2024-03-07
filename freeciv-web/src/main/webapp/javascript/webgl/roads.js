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

var roads_texture;
var roads_hash = -1;
var roads_data;

/****************************************************************************
 Initialize roads image
****************************************************************************/
function init_roads_image()
{
  roads_data = new Uint8Array( 4 * map.xsize * map.ysize );

  roads_texture = new THREE.DataTexture(roads_data, map.xsize, map.ysize);
  roads_texture.flipY = true;

  update_roads_image();

  if (graphics_quality == QUALITY_MEDIUM) setInterval(update_roads_image, 3000);
  if (graphics_quality == QUALITY_HIGH) setInterval(update_roads_image, 1200);

}


/****************************************************************************
  ...
****************************************************************************/
function update_roads_image()
{
   var hash = generate_roads_hash();

   if (hash != roads_hash) {
    for (let x = 0; x < map.xsize; x++) {
      for (let y = 0; y < map.ysize; y++) {
        let index = (y * map.xsize + x) * 4;
        let color = road_image_color(x, y);
        roads_data[index] = color[0];
        roads_data[index + 1] = color[1];
        roads_data[index + 2] = color[2];
        roads_data[index + 3] = 255;
      }
    }
    roads_texture.needsUpdate = true;
    roads_hash = hash;
  }

  return roads_texture;
}


/****************************************************************************
...
****************************************************************************/
function road_image_color(map_x, map_y)
{
  var ptile = map_pos_to_tile(map_x, map_y);

  // Railroads.
  if (ptile != null && tile_has_extra(ptile, EXTRA_RAIL)) {

    var result = [10, 0, 0]; // single road tile.

    // 1. iterate over adjacent tiles, see if they have railroad.
    var adj_road_count = 0;
    for (let dir = 0; dir < 8; dir++) {
      if (dir != 1 && dir != 3 && dir != 4 && dir != 6) continue;
      let checktile = mapstep(ptile, dir);
      if (checktile != null && tile_has_extra(checktile, EXTRA_RAIL)) {
        if (dir == 1) result[adj_road_count] = 12;
        if (dir == 3) result[adj_road_count] = 18;
        if (dir == 4) result[adj_road_count] = 14;
        if (dir == 6) result[adj_road_count] = 16;
        adj_road_count++;
        if (adj_road_count > 2) {
          let checktile = mapstep(ptile, 6);
          if (checktile != null && tile_has_extra(checktile, EXTRA_RAIL)) return [43,0,0];  //special case, 4 connected rails.
          break;
        }
      }
    }
    for (let dir = 0; dir < 8; dir++) {
      if (dir != 0 && dir != 2 && dir != 5 && dir != 7) continue;
      let checktile = mapstep(ptile, dir);
      if (checktile != null && tile_has_extra(checktile, EXTRA_RAIL)) {
        if (dir == 0) result[adj_road_count] = 19;
        if (dir == 2) result[adj_road_count] = 13;
        if (dir == 5) result[adj_road_count] = 17;
        if (dir == 7) result[adj_road_count] = 15;
        adj_road_count++;
        if (adj_road_count > 2) break;
      }
    }

    return [result[0], result[1], result[2]];
  }

  // Roads
  if (ptile != null && tile_has_extra(ptile, EXTRA_ROAD)) {

    let result = [1, 0, 0]; // single road tile.

    // 1. iterate over adjacent tiles, see if they have road.
    var adj_road_count = 0;
    for (var dir = 0; dir < 8; dir++) {
      if (dir != 1 && dir != 3 && dir != 4 && dir != 6) continue;
      let checktile = mapstep(ptile, dir);
      if (checktile != null && tile_has_extra(checktile, EXTRA_ROAD)) {
        if (dir == 1) result[adj_road_count] = 2;
        if (dir == 3) result[adj_road_count] = 8;
        if (dir == 4) result[adj_road_count] = 4;
        if (dir == 6) result[adj_road_count] = 6;
        adj_road_count++;
        if (adj_road_count > 2) {
          let checktile = mapstep(ptile, 6);
          if (checktile != null && tile_has_extra(checktile, EXTRA_ROAD)) return [42,0,0]; //special case, 4 connected roads.
          break;
        }
      }
    }
    for (var dir = 0; dir < 8; dir++) {
      if (dir != 0 && dir != 2 && dir != 5 && dir != 7) continue;
      let checktile = mapstep(ptile, dir);
      if (checktile != null && tile_has_extra(checktile, EXTRA_ROAD)) {
        if (dir == 0) result[adj_road_count] = 9;
        if (dir == 2) result[adj_road_count] = 3;
        if (dir == 5) result[adj_road_count] = 7;
        if (dir == 7) result[adj_road_count] = 5;
        adj_road_count++;
        if (adj_road_count > 2) break;
      }
    }

    return [result[0], result[1] , result[2]];
  }
  return [0,0,0]; // no road.

}

/****************************************************************************
 Creates a hash of the roads.
****************************************************************************/
function generate_roads_hash() {
  var hash = 0;

  for (var x = 0; x < map.xsize ; x++) {
    for (var y = 0; y < map.ysize; y++) {
      var ptile = map_pos_to_tile(x, y);
      if (ptile != null && tile_has_extra(ptile, EXTRA_ROAD)) {
        hash += ((x * y) + 1);
      }
      if (ptile != null && tile_has_extra(ptile, EXTRA_RAIL)) {
        hash += ((x * y) + 10);
      }
    }
  }
  return hash;
}