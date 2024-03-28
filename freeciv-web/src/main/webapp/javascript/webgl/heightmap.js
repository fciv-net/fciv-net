/**********************************************************************
    Freeciv-web - the web version of Freeciv. http://www.fciv.net/
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


var heightmap = null;
var heightmap_hash = -1;

/****************************************************************************
  Returns height offset for units. This will make units higher above cities.
****************************************************************************/
function get_unit_height_offset(punit)
{
  if (punit == null) return 0;
  let ptile = index_to_tile(punit['tile']);
  if (ptile == null) return 0;
  let ptype = unit_type(punit);

  if (ptype['name'] == "Caravel") {
    return 7;
  }

  if (ptype['name'] == "Galleon") {
    return 5.4;
  }

  if (ptype['name'] == "Frigate") {
    return 7.2;
  }

  if (ptype['name'] == "Destroyer") {
    return 4.0;
  }
  if (ptype['name'] == "Battleship") {
    return 4.0;
  }
  if (ptype['name'] == "Transport") {
    return 4.0;
  }
  if (ptype['name'] == "Fighter") {
    return 18.0;
  }
  if (ptype['name'] == "Bomber") {
    return 18.0;
  }
  if (ptype['name'] == "Cruiser") {
    return 4.0;
  }
  if (ptype['name'] == "Ironclad") {
    return 4.2;
  }

  if (ptype['name'] == "Zeppelin") {
    return 28;
  }

  if (tile_has_extra(ptile, EXTRA_RIVER)) {
    return 1;
  }

  if (!is_ocean_tile(ptile) && is_ocean_tile_near(ptile)) {
    return -4;
  }

  if (tile_terrain(ptile)['name'] == "Hills" || tile_terrain(ptile)['name'] == "Mountains") {
    return -5;
  }


  let pcity = tile_city(ptile);
  if (pcity != null) return 4;

  return -2;

}

/****************************************************************************
...
****************************************************************************/
function get_forest_offset(ptile)
{
    if (!is_ocean_tile(ptile) && is_ocean_tile_near(ptile)) {
      if (tile_terrain(ptile)['name'] == "Hills") {
        return  -8;
      } else if (tile_terrain(ptile)['name'] == "Mountains") {
        return -12;
      } else {
        return  -7;
      }
    }

    return -6;

}

/****************************************************************************
  Returns height offset for cities.
****************************************************************************/
function get_city_height_offset(pcity)
{
  if (pcity == null) return 0;
  let ptile = index_to_tile(pcity['tile']);
  if (ptile == null) return 0;

  if (!is_ocean_tile(ptile) && is_ocean_tile_near(ptile)) {
    if (tile_terrain(ptile)['name'] == "Hills") return -6;
    if (tile_terrain(ptile)['name'] == "Mountains") return -10;
    return -2.2;
  }

  if (tile_terrain(ptile) != null) {
    if (tile_terrain(ptile)['name'] == "Hills") return -6;
    if (tile_terrain(ptile)['name'] == "Mountains") return -10;
  }

  return 1.8;

}

/****************************************************************************
  Create heightmap based on tile.height.
****************************************************************************/
function init_heightmap(heightmap_quality)
{
  let heightmap_resolution_x = map.xsize * heightmap_quality + 1;
  let heightmap_resolution_y = map.ysize * heightmap_quality + 1;

  heightmap = new Float32Array(heightmap_resolution_x * heightmap_resolution_y);

}

/****************************************************************************
  Create heightmap based on tile.height.
****************************************************************************/
function update_heightmap(heightmap_quality)
{
  let heightmap_resolution_x = map.xsize * heightmap_quality + 1;
  let heightmap_resolution_y = map.ysize * heightmap_quality + 1;

  for (let x = 0; x < map.xsize ; x++) {
    for (let y = 0; y < map.ysize; y++) {
      let ptile = map_pos_to_tile(x, y);

      // Make coastline more distinct, to make it easier to distinguish ocean from land.
      if (is_ocean_tile(ptile) && is_land_tile_near(ptile)) {
        ptile['height'] = 0.45;
      }
      if (!is_ocean_tile(ptile) && is_ocean_tile_near(ptile) && !tile_has_extra(ptile, EXTRA_RIVER)) {
        ptile['height'] = 0.55;
      }

      if (tile_get_known(ptile) == TILE_UNKNOWN) {
        ptile['height'] = 0.51;
        let neighbours = [
          { "x": x - 1 , "y": y - 1},
          { "x": x - 1, "y": y },
          { "x": x - 1,  "y": y + 1 },
          { "x": x,  "y": y - 1},
          { "x": x , "y": y + 1},
          { "x": x + 1, "y": y - 1 },
          { "x": x + 1,  "y": y },
          { "x": x + 1,  "y": y + 1},
          ];

        for (let i = 0; i < 8; i++) {
          let coords = neighbours[i];
          if (coords.x < 0 || coords.x >= map.xsize || coords.y < 0 || coords.y >= map.ysize || ptile['height'] > 0.51) {
            continue;
          }
          let ntile = map_pos_to_tile(coords.x, coords.y);
          if (tile_get_known(ntile) != TILE_UNKNOWN) {
            ptile['height'] = ntile['height'];
          }
        }

      }
    }
  }

  for (let x = 0; x < heightmap_resolution_x; x++) {
    for (let y = 0; y < heightmap_resolution_y; y++) {
      let index = y * heightmap_resolution_x + x;
      let gx = x / heightmap_quality - 0.5;
      let gy = y / heightmap_quality - 0.5;
       if (Math.round(gx) == gx && Math.round(gy) == gy) {
        let ptile = map_pos_to_tile(gx, gy);
        heightmap[index] = ptile['height'];
        if (tile_has_extra(ptile, EXTRA_RIVER)) {
          heightmap[index] = ptile['height'] * 0.98;
        }
        if (tile_terrain(ptile)['name'] == "Mountains") {
          heightmap[index] = ptile['height'] * 1.02;
        }
      } else {
        let neighbours = [
          { "x": Math.floor(gx), "y": Math.floor(gy) },
          { "x": Math.floor(gx), "y": Math.ceil(gy) },
          { "x": Math.ceil(gx),  "y": Math.floor(gy) },
          { "x": Math.ceil(gx),  "y": Math.ceil(gy) }];

        let num_river_neighbours = 0;
        for (let i = 0; i < 4; i++) {
          let coords = neighbours[i];
          if (coords.x < 0 || coords.x >= map.xsize || coords.y < 0 || coords.y >= map.ysize) {
            continue;
          }
          let ptile = map_pos_to_tile(coords.x, coords.y);
          if (tile_has_extra(ptile, EXTRA_RIVER)) {
            num_river_neighbours++;
          }
        }

        let norm = 0;
        let sum = 0;
        for (let i = 0; i < 4; i++) {
          let coords = neighbours[i];
          if (coords.x < 0 || coords.x >= map.xsize || coords.y < 0 || coords.y >= map.ysize) {
            continue;
          }
          let dx = gx - coords.x;
          let dy = gy - coords.y;
          let distance = Math.sqrt(dx*dx + dy*dy);
          let ptile = map_pos_to_tile(coords.x, coords.y);
          let height = 0;
          if (tile_terrain(ptile)['name'] == "Hills" || tile_terrain(ptile)['name'] == "Mountains") {
            let rnd = ((x * y) % 10) / 10;
            height = ptile['height'] + ((rnd - 0.5) / 50) - 0.01;
          } else {
            height = ptile['height'];
          }
          if (tile_has_extra(ptile, EXTRA_RIVER)) {
            height = ptile['height'] * 1.045  - ((num_river_neighbours / 4) * 0.02);
          }

          sum += height / distance / distance;
          norm += 1 / distance / distance;
        }

        heightmap[index] = (sum / norm);
      }
    }
  }
}


/****************************************************************************
 Creates a hash of the map heightmap.
****************************************************************************/
function generate_heightmap_hash() {
  let hash = 0;

  for (let x = 0; x < map.xsize ; x++) {
    for (let y = 0; y < map.ysize; y++) {
      let ptile = map_pos_to_tile(x, y);
      hash += ptile['height']
    }
  }
  return hash;
}

