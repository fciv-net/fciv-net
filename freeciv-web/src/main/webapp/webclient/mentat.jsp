<div id="mentat_div" style="padding: 5px; padding-left: 20px;">
<h2>Mentat for Freeciv</h2>


<link href="/web-llm/src/llm_chat.css?<%= Math.random() %>" rel="stylesheet" type="text/css"/>

<div class="chatui">
   <div class="chatui-select-wrapper">
    <select id="chatui-select">
    </select>
   </div>
  <div class="chatui-chat" id="chatui-chat" height="100">
  </div>

  <div class="chatui-inputarea">
    <input id="chatui-input" type="text" class="chatui-input"  placeholder="Enter your message...">
    <button id="chatui-send-btn" class="chatui-send-btn"></button>
    <button id="chatui-reset-btn" class="chatui-reset-btn"></button>
  </div>
</div>

<div class="chatui-extra-control">
  <label id="chatui-info-label"></label>
</div>

  <b><i>
    Large Language Model AI Chat for Freeciv 3D. Requires WebGPU support in Google Chrome and Nvidia GPU hardware.<br>
    Try the TinyLlama (fast and not so smart) or Mistral (slow and smart) models.
    Download size: 2.2 GB.
   </i></b>

</div>

<!--- Place script after ui to make sure ui loads first -->
<script src="/web-llm/dist/llm_chat.5e8e8dcb.js?<%= Math.random() %>" defer=""></script>