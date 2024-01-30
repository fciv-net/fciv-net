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


/**************************************************************************
 Show the intelligence report dialog, with data depending on the
 stablishment of an embassy.
**************************************************************************/
function show_intelligence_report_dialog()
{
  if (selected_player == -1) return;
  var pplayer = players[selected_player];

  if (client_is_observer()
      || client.conn.playing.real_embassy[selected_player]) {
    show_intelligence_report_embassy(pplayer);
  } else {
    show_intelligence_report_hearsay(pplayer);
  }
}

/**************************************************************************
 Show the intelligence report dialog when there's no embassy.
**************************************************************************/
function show_intelligence_report_hearsay(pplayer)
{
  var msg = "Ruler " + pplayer['name'] + "<br>";
  if (pplayer['government'] > 0) {
    msg += "Government: " + governments[pplayer['government']]['name'] + "<br>";
  }

  if (pplayer['gold'] > 0) {
      msg += "Gold: " + pplayer['gold'] + "<br>";
    }

  if (pplayer['researching'] != null && pplayer['researching'] > 0 && techs[pplayer['researching']] != null) {
    msg += "Researching: " + techs[pplayer['researching']]['name'] + "<br>";
  }


  msg += "<br><br>Establishing an embassy will show a detailed intelligence report."

  show_dialog_message("Intelligence report for " + pplayer['name'],
      msg);

}

/**************************************************************************
 Show the intelligence report dialog when there's an embassy.
**************************************************************************/
function show_intelligence_report_embassy(pplayer) {
  // Reset dialog page.
  $("#intel_dialog").remove();
  $("<div id='intel_dialog'></div>").appendTo("div#game_page");

  const capital = player_capital(pplayer);

  const intelData = {
    ruler: pplayer.name,
    government: governments[pplayer.government].name,
    capital: capital ? capital.name : '(capital unknown)',
    gold: pplayer.gold,
    tax: `${pplayer.tax}%`,
    science: `${pplayer.science}%`,
    luxury: `${pplayer.luxury}%`,
    researching: '(Unknown)',
    culture: pplayer.culture,
    dipl: [],
    tech: []
  };

  // Future techs
  const research = research_get(pplayer);
  if (research) {
    const researchingTech = techs[research.researching];
    intelData.researching = researchingTech ? `${researchingTech.name} (${research.bulbs_researched}/${research.researching_cost})` : "(Nothing)";

    const myResearch = client_is_observer() ? null : research_get(client.conn.playing).inventions;
    for (const techId in techs) {
      if (research.inventions[techId] == TECH_KNOWN) {
        intelData.tech.push({
          name: techs[techId].name,
          who: (myResearch && myResearch[techId] == TECH_KNOWN) ? "both" : "them"
        });
      }
    }
  }

  if (pplayer.diplstates) {
    pplayer.diplstates.forEach((st, i) => {
      if (st.state !== DS_NO_CONTACT && i !== pplayer.playerno) {
        let dplSt = intelData.dipl[st.state];
        if (!dplSt) {
          dplSt = {
            state: get_diplstate_text(st.state),
            nations: []
          };
          intelData.dipl[st.state] = dplSt;
        }
        dplSt.nations.push(nations[players[i].nation].adjective);
      }
    });
  }

  const intelTabsHTML = `
    <div id="intel_tabs">
      <ul>
        <li><a href="#intel_tabs-overview">Overview</a></li>
        <li><a href="#intel_tabs-diplomacy">Diplomacy</a></li>
        <li><a href="#intel_tabs-technology">Technology</a></li>
      </ul>

      <div id="intel_tabs-overview" class="inteldlg_tabs">
        <table class="vert-attr-list">
          <tr><th>Ruler</th><td>${intelData.ruler}</td></tr>
          <tr><th>Government</th><td>${intelData.government}</td></tr>
          <tr><th>Capital</th><td>${intelData.capital}</td></tr>
          <tr><th>Gold</th><td>${intelData.gold}</td></tr>
          <tr><th>&nbsp;</th><td></td></tr>
          <tr><th>Tax</th><td>${intelData.tax}</td></tr>
          <tr><th>Science</th><td>${intelData.science}</td></tr>
          <tr><th>Luxury</th><td>${intelData.luxury}</td></tr>
          <tr><th>&nbsp;</th><td></td></tr>
          <tr><th>Researching</th><td>${intelData.researching}</td></tr>
          <tr><th>Culture</th><td>${intelData.culture}</td></tr>
        </table>
      </div>

      <div id="intel_tabs-diplomacy" class="inteldlg_tabs">
        <ul>
          ${intelData.dipl.length > 0 ?
            intelData.dipl.map(st =>
              `<li>${st.state}<ul>${st.nations.map(nation => `<li>${nation}</li>`).join('')}</ul></li>`
            ).join('')
            :
            '<li>No contact with other nations</li>'
          }
        </ul>
      </div>

      <div id="intel_tabs-technology" class="inteldlg_tabs">
        <ul>
          ${intelData.tech.length > 0 ?
            intelData.tech.map(tech => `<li class="tech-${tech.who}">${tech.name}</li>`).join('')
            :
            '<li>This exciting tribe does not seem to invest in technology.</li>'
          }
        </ul>
      </div>
    </div>
  `;

  $('#intel_dialog').html(intelTabsHTML);
  $('#intel_dialog').dialog({
    bgiframe: true,
    modal: true,
    title: `Foreign Intelligence: ${nations[pplayer.nation].adjective} Empire`,
    width: 'auto'
  });

  $('#intel_dialog').dialog('open');
  $('#intel_tabs').tabs();
  $('#game_text_input').blur();
}


