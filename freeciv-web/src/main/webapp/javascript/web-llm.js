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

var llm_chat_init = false;

/****************************************************************************
 Init the Freeciv 3D AI Chat LLM.
****************************************************************************/
function init_web_llm() {
    if (!mentat_enabled || !is_webgpu_supported() || llm_chat_init) return;

    send_message_to_llm("Hello! Introduce this game Freeciv 3D, a free open source strategy game, as a game AI advisor.");

    $("#chatui-chat").html("<div id='mentat_intro' class='msg-bubble'> <div className='msg-text'><div>Mentat chat for Freeciv 3D. Please wait while loading model.</div></div></div>");

    llm_chat_init = true;
}

/****************************************************************************
 Send message to Web-llm.
****************************************************************************/
function send_message_to_llm(message) {
  $("#chatui-input").val(message);
  $("#chatui-send-btn").click();

  $("#mentat_intro").remove();
}

/****************************************************************************
 Check if WebGPU is supported.
****************************************************************************/
function is_webgpu_supported() {
  return ('gpu' in navigator);
}