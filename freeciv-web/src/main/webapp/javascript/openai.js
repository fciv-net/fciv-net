/**********************************************************************
    OpenAI - the 3D web version of Freeciv. http://www.fciv.net/
    Copyright (C) 2009-2023  The FCIV.NET project

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
  Returns the current game context to OpenAI.
**************************************************************************/
function get_openai_game_context()
{
  var context = ""
  if (observing) return;

  var pplayer = client.conn.playing;

  if (civclient_state == C_S_PREPARING) {
    context += "The current player is called " + username + ". ";
    context += "The game has not started yet. Press the start button to start the game."
    return context;
  }

  context += "The current player is called " + username + " of the " + nations[pplayer['nation']]['adjective'] + " nation. \n";
  context += "Population of the players nation: " +  civ_population(client.conn.playing.playerno) + ".\n";
  context += "Government of the player: " + governments[client.conn.playing['government']]['name']  + ".\n";
  context += "Current game year and turn: " + get_year_string() + ". \n";
  context += "Current gold of the player: " + pplayer['gold'] + ". \n";
  if (techs[client.conn.playing['researching']] != null) {
      context += research_goal_text = "The player is currently researching " + techs[client.conn.playing['researching']]['name'] + ". ";
  } else {
    context += " The player has not chosen something to research.";
  }

  context += "These are the players in the game: ";
   for (var player_id in players) {
     var pplayer = players[player_id];
     if (pplayer['nation'] == -1) continue;
     context += pplayer['name'] + " of the " + nations[pplayer['nation']]['adjective'] + " nation, "
   }
   context += ".\n";


   context += " These are the cities in the game: "
   for (var city_id in cities){
       var pcity = cities[city_id];
       context += pcity['name'];
       if (nations[pcity['nation_id']] != null) {
         context += " (" +  nations[pcity['nation_id']]['name']  + ")";
       }
       context += ", ";

   }
  context += ".\n";

  context += " These are all the technologies researched and known the current player: "
  for (var tech_id in techs) {
     var ptech = techs[tech_id];
     if (player_invention_state(client.conn.playing, ptech['id']) == TECH_KNOWN) {
       context += ptech['name'] + ",";
     }
  }
  context += ".\n";

  context += " These are all the technologies not known the current player: "
  for (var tech_id in techs) {
     var ptech = techs[tech_id];
     if (player_invention_state(client.conn.playing, ptech['id']) != TECH_KNOWN) {
       context += ptech['name'] + ",";
     }
  }
  context += ".\n";

  context += " These the game units of the current player: "
  for (var unit_id in units) {
    var punit = units[unit_id];
     if (punit['owner'] == client.conn.playing.playerno ) {
       var punit_type = unit_types[punit['type']];
       context += punit_type['rule_name'] + ",";
     }
  }
  context += ".\n";

  if (civclient_state == C_S_OVER) {
    context += "The game has ended now. \n";
    return context;
  }

  return context;

}

/**************************************************************************
  Send message to OpenAI
**************************************************************************/
function send_message_to_openai(message)
{

  $.post( "/openai_chat", utf8_to_b64( get_openai_game_context()
         + " Please answer this message from the player in the game: " + message))
          .done(function( chatresponse ) {
            message_log.update({ event: E_CONNECTION, message: "<b>Assistant:</b> " + chatresponse });
          }).fail(function() {
                 message_log.update({ event: E_CONNECTION, message: "There was no answer." });
          })



}