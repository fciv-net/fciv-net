/**********************************************************************
 Fciv.net - the web version of Freeciv. http://www.fciv.net/
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


/****************************************************************************
 Init the Freeciv 3D AI Chat LLM.
****************************************************************************/
function init_web_llm()
{
  if (!mentat_enabled || !is_webgpu_supported()) {
    $("#mentat_tab").hide();
  } else {
    $("#mentat_tab").show();
  }

  if (!mentat_enabled || !is_webgpu_supported()) return;

  setTimeout(send_init_message_to_llm, 5000);


}

/****************************************************************************
 Send initial message to Web-llm to start it up.
****************************************************************************/
function send_init_message_to_llm() {
  $("#chatui-input").val("Hello Freeciv game advisor, please introduce this game Freeciv 3D, which is a free open source strategy game playable in the web browser.");
  $("#chatui-send-btn").click();

}

/****************************************************************************
 Check if WebGPU is supported.
****************************************************************************/
function is_webgpu_supported() {
  return ('gpu' in navigator);
}