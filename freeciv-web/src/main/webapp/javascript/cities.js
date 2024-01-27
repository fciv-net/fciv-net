/**********************************************************************
 Freeciv 3D - the web version of Freeciv. http://www.fciv.net/
 Copyright (C) 2009-2024  The Freeciv-web project

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


/**************************************************************************
 Updates the Cities tab when clicked, populating the table.
 **************************************************************************/
function update_city_screen()
{
    if (observing) return;

    var sortList = [];
    var headers = $('#city_table thead th');
    headers.filter('.tablesorter-headerAsc').each(function (i, cell) {
        sortList.push([cell.cellIndex, 0]);
    });
    headers.filter('.tablesorter-headerDesc').each(function (i, cell) {
        sortList.push([cell.cellIndex, 1]);
    });

    var city_list_html = "<table class='tablesorter' id='city_table' border=0 cellspacing=0>"
        + "<thead><tr><th>Name</th><th>Population</th><th>Size</th><th>State</th>"
        + "<th>Granary</th><th>Grows In</th><th>Producing</th>"
        + "<th>Surplus<br>Food/Prod/Trade</th><th>Economy<br>Gold/Luxury/Science</th></tr></thead><tbody>";
    var count = 0;
    for (var city_id in cities) {
        var pcity = cities[city_id];
        if (client.conn.playing != null && city_owner(pcity) != null && city_owner(pcity).playerno == client.conn.playing.playerno) {
            count++;
            var prod_type = get_city_production_type(pcity);
            var turns_to_complete_str;
            if (get_city_production_time(pcity) == FC_INFINITY) {
                turns_to_complete_str = "-"; //client does not know how long production will take yet.
            } else {
                turns_to_complete_str = get_city_production_time(pcity) + " turns";
            }

            city_list_html += "<tr class='cities_row' id='cities_list_" + pcity['id'] + "' data-city-id='" + pcity['id'] + "'><td>"
                + pcity['name'] + "</td><td>" + numberWithCommas(city_population(pcity)*1000) +
                "</td><td>" + pcity['size'] + "</td><td>" + get_city_state(pcity) + "</td><td>" + pcity['food_stock'] + "/" + pcity['granary_size'] +
                "</td><td>" + city_turns_to_growth_text(pcity) + "</td>" +
                "<td>" + prod_type['name'] + " (" + turns_to_complete_str + ")" +
                "</td><td>" + pcity['surplus'][O_FOOD] + "/" + pcity['surplus'][O_SHIELD] + "/" + pcity['surplus'][O_TRADE] + "</td>" +
                "<td>" + pcity['prod'][O_GOLD] + "/" + pcity['prod'][O_LUXURY] + "/" + pcity['prod'][O_SCIENCE] + "<td>";

            city_list_html += "</tr>";
        }
    }

    city_list_html += "</tbody></table>";
    $("#cities_list").html(city_list_html);

    $('.cities_row').mousedown(function(event){
        if(event.which == 1) {
            var cityId = $(this).data('city-id');
            show_city_dialog_by_id(cityId);
        }
    });


    if (count != 0) {
      $("#city_table").contextMenu({
        selector: '.cities_row',
        callback: function(key, options) {
          cities_choose_production(key, options, $(this).data('city-id'));
        },
        items: generate_cities_production_list()
      });
    }

    if (count == 0) {
      $("#city_table").html("0 cities. Build new cities with Settlers.");
    }

    $('#cities_scroll').css("height", $(window).height() - 200);

    $("#city_table").tablesorter({theme:"dark", sortList: sortList});

    $("#cities_heading").text(count + " Cities");
}

/**************************************************************************
...
**************************************************************************/
function generate_cities_production_list()
{
  var pcity = null;
  for (var city_id in cities) {
    var ncity = cities[city_id];
    if (client.conn.playing != null && city_owner(ncity) != null && city_owner(ncity).playerno == client.conn.playing.playerno) {
       pcity = ncity;
       break;
    }
  }

  var production_list = {};
  for (var unit_type_id in unit_types) {
    var punit_type = unit_types[unit_type_id];
        // TODO: should have unique check if each city can build the thing, not just check if the first city can build it.
    if (!can_city_build_now(pcity, VUT_UTYPE, punit_type['id'])) continue;

    if (punit_type['name'] == "Barbarian Leader" || punit_type['name'] == "Leader") continue;
      production_list[punit_type['name']] = {name: punit_type['name']}
  }

  for (var improvement_id in improvements) {
    var pimprovement = improvements[improvement_id];
    if (!can_city_build_now(pcity, VUT_IMPROVEMENT, pimprovement['id'])) continue;
    production_list[pimprovement['name']] = {name: pimprovement['name']}
  }
  return production_list;
}

/**************************************************************************
...
**************************************************************************/
function cities_choose_production(key, options, city_id) {
  var production_list = {};
  for (var unit_type_id in unit_types) {
    var punit_type = unit_types[unit_type_id];
    if (punit_type['name'] == key) {
        send_city_change(city_id, VUT_UTYPE, punit_type['id']);
    }
  }

  for (var improvement_id in improvements) {
    var pimprovement = improvements[improvement_id];
    if (pimprovement['name'] == key) {
        send_city_change(city_id, VUT_IMPROVEMENT, pimprovement['id']);
    }
  }
  setTimeout(250, update_city_screen);
}