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

var texture_cache = {};
var webgl_mapview_font = "27px arial, sans serif";


/**********************************************************************
  ...
***********************************************************************/
function get_unit_activity_text(punit)
{
  var activity = punit['activity'];

  /* don't draw activity for enemy units */
  if (client.conn.playing == null || punit['owner'] != client.conn.playing.playerno) {
    return null;
  }

  switch (activity) {
    case ACTIVITY_CLEAN:
    case ACTIVITY_POLLUTION:
      return "c";

    case ACTIVITY_MINE:
      return "m";

    case ACTIVITY_PLANT:
      return "M";

    case ACTIVITY_IRRIGATE:
      return "i";

    case ACTIVITY_CULTIVATE:
      return "I";

    case ACTIVITY_FORTIFIED:
      return "F";

    case ACTIVITY_BASE:
      return "B";

    case ACTIVITY_SENTRY:
      return "S";

    case ACTIVITY_PILLAGE:
      return "P";

    case ACTIVITY_GOTO:
      return "G";

    case ACTIVITY_EXPLORE:
      return "X";

    case ACTIVITY_TRANSFORM:
      return "T";

    case ACTIVITY_FORTIFYING:
      return "F";

    case ACTIVITY_GEN_ROAD:
      return "R";

    case ACTIVITY_CONVERT:
      return "C";
  }

  if (unit_has_goto(punit)) {
    return "G";
  }

  switch (punit['ssa_controller']) {
  case SSA_NONE:
    break;
  case SSA_AUTOSETTLER:
    return "A";
  case SSA_AUTOEXPLORE:
    return "X";
  }

  return null;
}
