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

var borders_palette = [];
var borders_texture;
var borders_hash = -1;

/****************************************************************************
 Initialize borders image.
****************************************************************************/
function init_borders_image()
{
  borders_palette = [];
  borders_palette.push([142, 0, 0]);
  for (var player_id in players) {
    var pplayer = players[player_id];
    var nation_colors;
    if (nations[pplayer['nation']].color != null) {
      nation_colors = nations[pplayer['nation']].color.replace("rgb(", "").replace(")", "").split(",");
      if (nation_colors[0] < nation_colors[1] - 10 && nation_colors[2] < nation_colors[1] - 10) nation_colors = [0, 20, 0]; //darken green
    } else {
      nation_colors = [0, 0, 0];
    }
    borders_palette.push([parseInt(nation_colors[0]) * 0.65, parseInt(nation_colors[2]) * 0.65, parseInt(nation_colors[1]) * 0.65]);
  }

  bmp_lib.render('borders_image',
                    generate_borders_image(),
                    borders_palette);
  borders_texture = new THREE.Texture();
  borders_texture.magFilter = THREE.NearestFilter;
  borders_texture.minFilter = THREE.NearestFilter;
  borders_texture.image = document.getElementById("borders_image");
  borders_texture.image.onload = function () {
    borders_texture.needsUpdate = true;
  };

  setInterval(update_borders_image, 400);
}

/****************************************************************************
  Returns a texture containing one pixel for each map tile, where the color of each pixel
  contains the border color.
****************************************************************************/
function update_borders_image()
{
   var hash = generate_borders_image_hash();

   if (hash != borders_hash) {
     borders_palette = [];
     borders_palette.push([142, 0, 0]);
     for (var player_id in players) {
       var pplayer = players[player_id];
       var nation_colors;
       if (nations[pplayer['nation']].color != null) {
         nation_colors = nations[pplayer['nation']].color.replace("rgb(", "").replace(")", "").split(",");
         if (nation_colors[0] < nation_colors[1] - 10 && nation_colors[2] < nation_colors[1] - 10) nation_colors = [0, 20, 0]; //darken green
       } else {
         nation_colors = [0,0,0];
       }

       borders_palette.push([parseInt(nation_colors[0]) * 0.65, parseInt(nation_colors[2]) * 0.65, parseInt(nation_colors[1]) * 0.65]);
     }

     bmp_lib.render('borders_image',
                       generate_borders_image(),
                       borders_palette);
     borders_texture.image = document.getElementById("borders_image");
     borders_texture.image.onload = function () {
       borders_texture.needsUpdate = true;
     };
     borders_hash = hash;

     return borders_texture;
  }
}

/****************************************************************************

****************************************************************************/
function generate_borders_image() {
  var cols = map['xsize'];
  var rows = map['ysize'];

  var row;
  // The grid of points that make up the image.
  var grid = Array(rows);
  for (row = 0; row < rows ; row++) {
    grid[row] = Array(cols);
  }

  for (var y = 0; y < rows ; y++) {
    for (var x = 0; x < cols; x++) {
      grid[y][x] = border_image_color(x, y);
    }
  }

  return grid;
}

/****************************************************************************
 Creates a hash of the map borders.
****************************************************************************/
function generate_borders_image_hash() {
  var hash = 0;
  var cols = map['xsize'];
  var rows = map['ysize'];

  for (var y = 0; y < rows ; y++) {
    for (var x = 0; x < cols; x++) {
      hash += border_image_color(x, y);
    }
  }

  return hash;
}


/****************************************************************************
  Returns the color of the tile at the given map position.
****************************************************************************/
function border_image_color(map_x, map_y)
{
  var ptile = map_pos_to_tile(map_x, map_y);

  if (map_x > map['xsize'] || map_y > map['ysize']) {
    return 0;
  }

  if (ptile != null && ptile['owner'] != null && ptile['owner'] < 255) {
      return 1 + ptile['owner'];
  }

  return 0;
}
