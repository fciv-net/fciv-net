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


var reqtree = {};
var reqtree_xwidth = 330;
var reqtree_ywidth = 80;

/**************************************************************************
 Technology tree algorithm, assigning the position of each technology in the tree.
**************************************************************************/
function generate_req_tree() {
  reqtree = {};

  for (let tech_id in techs) {
    let ptech = techs[tech_id];
    ptech['subreqs'] = [];
  }

  for (let tech_id in techs) {
    let ptech = techs[tech_id];

    if (ptech['req'][0] > 0) {
      techs[ptech['req'][0]]['subreqs'].push(ptech);
    }
    if (ptech['req'][1] > 0) {
      techs[ptech['req'][1]]['subreqs'].push(ptech);
    }
  }

  for (let tech_id in techs) {
    let ptech = techs[tech_id];
    if (ptech['req'][0] == 0 && ptech['req'][1] == 0) {
      reqtree_assign_level(ptech, 0);
    }
  }

  var level_counts = {};
  for (let x = 0; x < Object.keys(techs).length; x++) {
    level_counts[x] = 0;
  }
  for (let tech_id in techs) {
    let ptech = techs[tech_id];
    ptech['ylevel'] = level_counts[ptech['xlevel']];
    level_counts[ptech['xlevel']] = level_counts[ptech['xlevel']] + 1;
  }

  for (let tech_id in techs) {
    let ptech = techs[tech_id];
    reqtree[tech_id] = {'x' : 20 + ptech['xlevel'] * reqtree_xwidth, 'y': 20 + ptech['ylevel'] * reqtree_ywidth};
  }

}

/**************************************************************************
 ...
**************************************************************************/
function reqtree_assign_level(ptech, xlevel) {
  if (ptech['xlevel'] == null || ptech['xlevel'] < xlevel) {
    ptech['xlevel'] = xlevel;
  }

  if (ptech['subreqs'] != null) {
    for (let n = 0; n < ptech['subreqs'].length; n++) {
      reqtree_assign_level(ptech['subreqs'][n], xlevel + 1);
    }
  }
}