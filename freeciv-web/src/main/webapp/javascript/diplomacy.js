/**********************************************************************
    Freeciv-web - the web version of Freeciv. http://www.fciv.net/
    Copyright (C) 2009-2015  The Freeciv-web project

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

var CLAUSE_ADVANCE = 0;
var CLAUSE_GOLD = 1;
var CLAUSE_MAP = 2;
var CLAUSE_SEAMAP = 3;
var CLAUSE_CITY = 4;
var CLAUSE_CEASEFIRE = 5;
var CLAUSE_PEACE = 6;
var CLAUSE_ALLIANCE = 7;
var CLAUSE_VISION = 8;
var CLAUSE_EMBASSY = 9;
var CLAUSE_SHARED_TILES = 10;
var SPECENUM_COUNT = 11;

var clause_infos = {};
var diplomacy_clause_map = {};

/**************************************************************************
 ...
**************************************************************************/
function diplomacy_init_meeting_req(counterpart)
{
  var packet = {"pid" : packet_diplomacy_init_meeting_req,
	        "counterpart" : counterpart};
  send_request(JSON.stringify(packet));
}


/**************************************************************************
 ...
**************************************************************************/
function show_diplomacy_dialog(counterpart)
{
  createDiplomacyDialog(players[counterpart]);
}

/**************************************************************************
 ...
**************************************************************************/
function accept_treaty_req(counterpart_id)
{
  var packet = {"pid" : packet_diplomacy_accept_treaty_req,
                "counterpart" : counterpart_id};
  send_request(JSON.stringify(packet));
}

/**************************************************************************
 ...
**************************************************************************/
function accept_treaty(counterpart, I_accepted, other_accepted)
{
  if (I_accepted == true && other_accepted == true) {
    diplomacy_clause_map[counterpart] = [];
    cleanup_diplomacy_dialog(counterpart);

  } else {

  var agree_sprite = get_treaty_agree_thumb_up();
  var disagree_sprite = get_treaty_disagree_thumb_down();


  var agree_html = "<div style='float:left; background: transparent url("
           + agree_sprite['image-src']
           + "); background-position:-" + agree_sprite['tileset-x'] + "px -"
	   + agree_sprite['tileset-y']
           + "px;  width: " + agree_sprite['width'] + "px;height: "
	   + agree_sprite['height'] + "px; margin: 5px; '>"
           + "</div>";

  var disagree_html = "<div style='float:left; background: transparent url("
           + disagree_sprite['image-src']
           + "); background-position:-" + disagree_sprite['tileset-x'] + "px -"
	   + disagree_sprite['tileset-y']
           + "px;  width: " + disagree_sprite['width'] + "px;height: "
	   + disagree_sprite['height'] + "px; margin: 5px; '>"
           + "</div>";
    if (I_accepted == true) {
      $("#agree_self_" + counterpart).html(agree_html);
    } else {
      $("#agree_self_" + counterpart).html(disagree_html);
    }

    if (other_accepted) {
      $("#agree_counterpart_" + counterpart).html(agree_html);
    } else {
      $("#agree_counterpart_" + counterpart).html(disagree_html);
    }
  }
}

/**************************************************************************
 ...
**************************************************************************/
function cancel_meeting_req(counterpart_id)
{
  var packet = {"pid" : packet_diplomacy_cancel_meeting_req,
	        "counterpart" : counterpart_id};
  send_request(JSON.stringify(packet));
}

/**************************************************************************
 ...
**************************************************************************/
function create_clause_req(counterpart_id, giver, type, value)
{
  if (type == CLAUSE_CEASEFIRE || type == CLAUSE_PEACE || type == CLAUSE_ALLIANCE) {
    // eg. creating peace treaty requires removing ceasefire first.
    var clauses = diplomacy_clause_map[counterpart_id];
    for (var i = 0; i < clauses.length; i++) {
      var clause = clauses[i];
      if (clause['type'] == CLAUSE_CEASEFIRE || clause['type'] == CLAUSE_PEACE|| clause['type'] == CLAUSE_ALLIANCE) {
        remove_clause_req(counterpart_id, i);
      }
    }
  }

  var packet = {"pid" : packet_diplomacy_create_clause_req,
                "counterpart" : counterpart_id,
                "giver" : giver,
                "type" : type,
                "value" : value};
  send_request(JSON.stringify(packet));
}


/**************************************************************************
 ...
**************************************************************************/
function cancel_meeting(counterpart)
{
  diplomacy_clause_map[counterpart] = [];
  cleanup_diplomacy_dialog(counterpart);
}

/**************************************************************************
 Remove diplomacy dialog.
**************************************************************************/
function cleanup_diplomacy_dialog(counterpart_id)
{
  $("#diplomacy_dialog_" + counterpart_id).remove();
}

/**************************************************************************
 Remove all diplomacy dialogs and empty clauses map.
**************************************************************************/
function discard_diplomacy_dialogs()
{
  for (var counterpart in diplomacy_clause_map) {
    cleanup_diplomacy_dialog(counterpart);
  }
  diplomacy_clause_map = {};
}

/**************************************************************************
 ...
**************************************************************************/
function show_diplomacy_clauses(counterpart_id)
{
    var clauses = diplomacy_clause_map[counterpart_id];
    var diplo_html = "";
    for (var i = 0; i < clauses.length; i++) {
      var clause = clauses[i];
      var diplo_str = client_diplomacy_clause_string(clause['counterpart'],
 		          clause['giver'],
                  clause['type'],
                  clause['value']);
      diplo_html += "<a href='#' onclick='remove_clause_req("
                  + counterpart_id + ", " + i + ");'>" + diplo_str + "</a><br>";

    }

    $("#diplomacy_messages_" + counterpart_id).html(diplo_html);
}

/**************************************************************************
 ...
**************************************************************************/
function remove_clause_req(counterpart_id, clause_no)
{
  var clauses = diplomacy_clause_map[counterpart_id];
  var clause = clauses[clause_no];

  var packet = {"pid" : packet_diplomacy_remove_clause_req,
	            "counterpart" : clause['counterpart'],
                "giver": clause['giver'],
                "type" : clause['type'],
                "value": clause['value'] };
  send_request(JSON.stringify(packet));
}

/**************************************************************************
 ...
**************************************************************************/
function remove_clause(remove_clause_obj)
{
  var counterpart_id = remove_clause_obj['counterpart'];
  var clause_list = diplomacy_clause_map[counterpart_id];
  for (var i = 0; i < clause_list.length; i++) {
    var check_clause = clause_list[i];
    if (counterpart_id == check_clause['counterpart']
	&& remove_clause_obj['giver'] == check_clause['giver']
        && remove_clause_obj['type'] == check_clause['type']) {

      clause_list.splice(i, 1);
      break;
    }
  }

  show_diplomacy_clauses(counterpart_id);
}

/**************************************************************************
 ...
**************************************************************************/
function client_diplomacy_clause_string(counterpart, giver, type, value)
{
  var pplayer = players[giver];
  var nation = nations[pplayer['nation']]['adjective'];

  switch (type) {
  case CLAUSE_ADVANCE:
    var ptech = techs[value];
    return "The " + nation + " give " + ptech['name'];
  case CLAUSE_CITY:
    var pcity = cities[value];

    if (pcity != null) {
      return "The " + nation + " give " + decodeURIComponent(pcity['name']);
    } else {
      return "The " + nation + " give unknown city.";
    }
    break;

  case CLAUSE_GOLD:
    if (giver == client.conn.playing['playerno']) {
      $("#self_gold_" + counterpart).val(value);
    } else {
      $("#counterpart_gold_" + counterpart).val(value);
    }
    return "The " + nation + " give " + value + " gold";
  case CLAUSE_MAP:
    return "The " + nation + " give their worldmap";
  case CLAUSE_SEAMAP:
    return "The " + nation + " give their seamap";
  case CLAUSE_CEASEFIRE:
    return "The parties agree on a cease-fire";
  case CLAUSE_PEACE:
    return "The parties agree on a peace";
  case CLAUSE_ALLIANCE:
    return "The parties create an alliance";
  case CLAUSE_VISION:
    return "The " + nation + " give shared vision";
  case CLAUSE_EMBASSY:
    return "The " + nation + " give an embassy";
  case CLAUSE_SHARED_TILES:
    return "The " + nation + " share their tiles";
  }

  return "";
}



/**************************************************************************
 ...
**************************************************************************/
function diplomacy_cancel_treaty(player_id)
{
  var packet = {"pid" : packet_diplomacy_cancel_pact,
	        "other_player_id" : player_id,
                "clause" : DS_CEASEFIRE};
  send_request(JSON.stringify(packet));

  update_nation_screen();

  setTimeout(update_nation_screen, 500);
  setTimeout(update_nation_screen, 1500);
}



/**************************************************************************
 ...
**************************************************************************/
function createDiplomacyDialog(counterpart) {
  const pplayer = client.conn.playing;
  const counterpartId = counterpart['playerno'];

  const selfData = meeting_template_data(pplayer, counterpart);
  const counterpartData = meeting_template_data(counterpart, pplayer);
  const title = `Diplomacy: ${counterpart['name']} of the ${nations[counterpart['nation']]['adjective']}`;

  const diplomacyDialog = $("<div>").attr("id", `diplomacy_dialog_${counterpartId}`).attr("title", title);
  $("#game_page").append(diplomacyDialog);

  diplomacyDialog.html(`
    <div>
      Treaty clauses:<br>
      <div class='diplomacy_messages' id='diplomacy_messages_${counterpartId}'></div>
      <div>
        <!-- Player Box for Self -->
        <div class='diplomacy_player_box'>
          <!-- Self Flag or Canvas -->
          ${selfData.flag ? `<img src='/images/flags/${selfData.flag}' class='flag_self' id='flag_self_${counterpartId}'>` : `<canvas class='flag_self' id='flag_self_${counterpartId}' width='58' height='40'></canvas>`}
          <div class='agree_self' id='agree_self_${counterpartId}'></div>
          <h3>${selfData.adjective} ${selfData.name}</h3>
          <div class='dipl_div'>
            <div id='hierarchy_self_${counterpartId}'><a tabindex='0' class='menu-button-activator ui-button ui-widget ui-state-default ui-corner-all'><span class='ui-icon ui-icon-triangle-1-s'></span>Add Clause...</a>
              <ul class='dipl_add'>
                ${selfData.clauses.map(clause => `
                  ${clause.title ? `<li><div>${clause.title}</div><ul>${clause.clauses.map(subClause => `<li><div><a href='#' onclick='create_clause_req(${counterpartId}, ${selfData.pid}, ${subClause.type}, ${subClause.value});'>${subClause.name}</a></div></li>`).join('')}</ul></li>` :
                  `<li><div><a href='#' onclick='create_clause_req(${counterpartId}, ${selfData.pid}, ${clause.type}, ${clause.value});'>${clause.name}</a></div></li>`}
                `).join('')}
              </ul>
            </div>
            <span class='diplomacy_gold'>Gold:<input id='self_gold_${counterpartId}' type='number' step='1' size='3' value='0'></span>
          </div>
        </div>
        <!-- Player Box for Counterpart -->
        <div class='diplomacy_player_box'>
          <!-- Counterpart Flag or Canvas -->
          ${counterpartData.flag ? `<img src='/images/flags/${counterpartData.flag}' class='flag_counterpart' id='flag_counterpart_${counterpartId}'>` : `<canvas class='flag_counterpart' id='flag_counterpart_${counterpartId}' width='58' height='40'></canvas>`}
          <div class='agree_counterpart' id='agree_counterpart_${counterpartId}'></div>
          <h3>${counterpartData.adjective} ${counterpartData.name}</h3>
          <div class='dipl_div'>
            <div id='hierarchy_counterpart_${counterpartId}'><a tabindex='0' class='menu-button-activator ui-button ui-widget ui-state-default ui-corner-all'><span class='ui-icon ui-icon-triangle-1-s'></span>Add Clause...</a>
              <ul class='dipl_add'>
                ${counterpartData.clauses.map(clause => `
                  ${clause.title ? `<li><div>${clause.title}</div><ul>${clause.clauses.map(subClause => `<li><div><a href='#' onclick='create_clause_req(${counterpartId}, ${counterpartData.pid}, ${subClause.type}, ${subClause.value});'>${subClause.name}</a></div></li>`).join('')}</ul></li>` :
                  `<li><div><a href='#' onclick='create_clause_req(${counterpartId}, ${counterpartData.pid}, ${clause.type}, ${clause.value});'>${clause.name}</a></div></li>`}
                `).join('')}
              </ul>
            </div>
            <span class='diplomacy_gold'>Gold:<input id='counterpart_gold_${counterpartId}' type='number' step='1' size='3' value='0'></span>
          </div>
        </div>
      </div>
    </div>
  `);

  diplomacyDialog.dialog({
    bgiframe: true,
    modal: false,
    width: is_small_screen() ? "90%" : "50%",
    height: 450,
    buttons: {
      "Accept treaty": function () {
        accept_treaty_req(counterpartId);
      },
      "Cancel meeting": function () {
        cancel_meeting_req(counterpartId);
      },
      "Declare war": function () {
        diplomacy_cancel_treaty(counterpartId);
        cancel_meeting_req(counterpartId);
      }
    },
    dialogClass: 'diplomacy_dialog',
    close: function () {
      cancel_meeting_req(counterpartId);
    }
  }).dialogExtend({
    "minimizable": true,
    "closable": true,
    "icons": {
      "minimize": "ui-icon-circle-minus",
      "restore": "ui-icon-newwin"
    }
  });

  diplomacyDialog.dialog('open');

  const selfFlagElement = $(`#flag_self_${counterpartId}`);
  const counterpartFlagElement = $(`#flag_counterpart_${counterpartId}`);
  const selfNation = nations[pplayer['nation']];
  const counterpartNation = nations[counterpart['nation']];

  if (selfNation['customized']) {
    meeting_paint_custom_flag(selfNation, selfFlagElement[0]);
  }
  if (counterpartNation['customized']) {
    meeting_paint_custom_flag(counterpartNation, counterpartFlagElement[0]);
  }

  create_clauses_menu($(`#hierarchy_self_${counterpartId}`));
  create_clauses_menu($(`#hierarchy_counterpart_${counterpartId}`));

  if (game_info.trading_gold && clause_infos[CLAUSE_GOLD]['enabled']) {
    $(`#self_gold_${counterpartId}`).attr({
      "max": pplayer['gold'],
      "min": 0
    });

    $(`#counterpart_gold_${counterpartId}`).attr({
      "max": counterpart['gold'],
      "min": 0
    });

    $(`#counterpart_gold_${counterpartId}`).change(function () {
      meeting_gold_change_req(counterpartId, counterpartId, parseFloat($(`#counterpart_gold_${counterpartId}`).val()));
    });

    $(`#self_gold_${counterpartId}`).change(function () {
      meeting_gold_change_req(counterpartId, pplayer['playerno'], parseFloat($(`#self_gold_${counterpartId}`).val()));
    });

  } else {
    $(`#self_gold_${counterpartId}`).prop("disabled", true).parent().hide();
    $(`#counterpart_gold_${counterpartId}`).prop("disabled", true).parent().hide();
  }

  diplomacyDialog.css("overflow", "visible");
  diplomacyDialog.parent().css("z-index", 1000);

  if (dialogs_minimized_setting) {
    diplomacyDialog.dialogExtend("minimize");
  }
}


function meeting_paint_custom_flag(nation, flag_canvas)
{
  var tag = "f." + nation['graphic_str'];
  var flag_canvas_ctx = flag_canvas.getContext("2d");
  flag_canvas_ctx.scale(1.5, 1.5);
  flag_canvas_ctx.drawImage(sprites[tag], 0, 0);
}

function create_clauses_menu(content) {
  content.css('position', 'relative');
  var children = content.children();
  var button = children.eq(0);
  var menu = children.eq(1);
  menu.menu();
  menu.hide();
  menu.css({
    position: 'absolute',
    top: button.height()
       + parseFloat(button.css('paddingTop'))
       + parseFloat(button.css('paddingBottom'))
       + parseFloat(button.css('borderTopWidth')),
    left: parseFloat(button.css('marginLeft'))
  });
  var menu_open = function () {
    menu.show();
    menu.data('diplAdd', 'open');
  };
  var menu_close = function () {
    menu.hide();
    menu.data('diplAdd', 'closed');
  };
  button.click(function () {
    if (menu.data('diplAdd') == 'open') {
      menu_close();
    } else {
      menu_open();
    }
  });
  menu.click(function (e) {
    if (e && e.target && e.target.tagName == 'A') {
      menu_close();
    }
  });
  content.hover(menu_open, menu_close);
}

/**************************************************************************
 Request update of gold clause
**************************************************************************/
function meeting_gold_change_req(counterpart_id, giver, gold)
{
  var clauses = diplomacy_clause_map[counterpart_id];
  if (clauses != null) {
    for (var i = 0; i < clauses.length; i++) {
      var clause = clauses[i];
      if (clause['giver'] == giver && clause['type'] == CLAUSE_GOLD) {
        if (clause['value'] == gold) return;
        remove_clause_req(counterpart_id, i);
      }
    }
  }

  if (gold != 0) {
    var packet = {"pid" : packet_diplomacy_create_clause_req,
                  "counterpart" : counterpart_id,
                  "giver" : giver,
                  "type" : CLAUSE_GOLD,
                  "value" : gold};
    send_request(JSON.stringify(packet));
  }
}

/**************************************************************************
 Build data object for the dialog template.
**************************************************************************/
function meeting_template_data(giver, taker)
{
  var data = {};
  var nation = nations[giver['nation']];

  if (!nation['customized']) {
    data.flag = nation['graphic_str'] + ".svg";
  }

  data.adjective = nation['adjective'];
  data.name = giver['name'];
  data.pid = giver['playerno'];

  var all_clauses = [];

  var clauses = [];
  if (clause_infos[CLAUSE_MAP]['enabled']) {
    clauses.push({type: CLAUSE_MAP, value: 1, name: 'World-map'});
  }
  if (clause_infos[CLAUSE_SEAMAP]['enabled']) {
    clauses.push({type: CLAUSE_SEAMAP, value: 1, name: 'Sea-map'});
  }
  if (clauses.length > 0) {
    all_clauses.push({title: 'Maps...', clauses: clauses});
  }

  if (game_info.trading_tech && clause_infos[CLAUSE_ADVANCE]['enabled']) {
    clauses = [];
    for (var tech_id in techs) {
      if (player_invention_state(giver, tech_id) == TECH_KNOWN
          && (player_invention_state(taker, tech_id) == TECH_UNKNOWN
              || player_invention_state(taker, tech_id) == TECH_PREREQS_KNOWN)) {
        clauses.push({
          type: CLAUSE_ADVANCE,
          value: tech_id,
          name: techs[tech_id]['name']
        });
      }
    }
    if (clauses.length > 0) {
      all_clauses.push({title: 'Advances...', clauses: clauses});
    }
  }

  if (game_info.trading_city && clause_infos[CLAUSE_CITY]['enabled']) {
    clauses = [];
    for (var city_id in cities) {
      var pcity = cities[city_id];
      if (city_owner(pcity) == giver
          && !does_city_have_improvement(pcity, "Palace")) {
        clauses.push({
          type: CLAUSE_CITY,
          value: city_id,
          name: decodeURIComponent(pcity['name'])
        });
      }
    }
    if (clauses.length > 0) {
      all_clauses.push({title: 'Cities...', clauses: clauses});
    }
  }

  if (clause_infos[CLAUSE_VISION]['enabled']) {
    all_clauses.push({type: CLAUSE_VISION, value: 1, name: 'Give shared vision'});
  }
  if (clause_infos[CLAUSE_EMBASSY]['enabled']) {
    all_clauses.push({type: CLAUSE_EMBASSY, value: 1, name: 'Give embassy'});
  }
  if (clause_infos[CLAUSE_SHARED_TILES]['enabled']) {
    all_clauses.push({type: CLAUSE_SHARED_TILES, value: 1, name: 'Share tiles'});
  }
  if (giver == client.conn.playing) {
    clauses = [];
    if (clause_infos[CLAUSE_CEASEFIRE]['enabled']) {
      clauses.push({type: CLAUSE_CEASEFIRE, value: 1, name: 'Cease-fire'});
    }
    if (clause_infos[CLAUSE_PEACE]['enabled']) {
      clauses.push({type: CLAUSE_PEACE, value: 1, name: 'Peace'});
    }
    if (clause_infos[CLAUSE_ALLIANCE]['enabled']) {
      clauses.push({type: CLAUSE_ALLIANCE, value: 1, name: 'Alliance'});
    }
    if (clauses.length > 0) {
      all_clauses.push({ title: 'Pacts...', clauses: clauses });
    }
  }

  data.clauses = all_clauses;

  return data;
}

