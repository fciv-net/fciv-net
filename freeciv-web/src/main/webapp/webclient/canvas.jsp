 <image id="map_tiletype_grid" style="display:none;">
 <image id="borders_image" style="display:none;">

 <image id="roads_image" style="display:none;">
 <canvas id="roads_canvas" style="display:none;"></canvas>

 <div id="mapview_canvas_div">
    <%-- The main mapview canvas --%>  
    <div id="mapcanvas"></div>
    
    <%-- Message chatbox --%>
    <div id="game_chatbox_panel">
      <div id="freeciv_custom_scrollbar_div">
        <ol id="game_message_area"></ol>
      </div>
      <div id="game_chat_box">
        <canvas id="chat_direction" width="29" height="20" role="button"></canvas>
        <input id="game_text_input" type="text" name="text_input" />
      </div>
    </div>

    <%-- Game status panel --%>
    <div id="game_status_panel_bar"></div>

    <%-- Unit orders and info panel --%>
    <div id="game_unit_panel">
	<div id="game_unit_info">&nbsp;
	</div>
    </div>


  </div>
