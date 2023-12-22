(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['city'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"city_tabs\">\n  <ul>\n    <li><a href=\"#city_tabs-1\" onclick=\"javascript:city_tab_index=0;\">Overview</a></li>\n    <li><a href=\"#city_tabs-2\" onclick=\"javascript:city_tab_index=1;\">Production</a></li>\n    <li><a href=\"#city_tabs-3\" onclick=\"javascript:city_tab_index=2;\">Traderoutes</a></li>\n    <li class=\"extra_tabs_big\" onclick=\"javascript:city_tab_index=3;\"><a href=\"#city_tabs-4\">Settings</a></li>\n    <li><a href=\"#city_tabs-5\" onclick=\"javascript:city_tab_index=4;\">Governor</a></li>\n  </ul>\n\n  <div id=\"city_tabs-1\">\n    <div id=\"city_overview_tab\" class=\"citydlg_tabs\">\n    <div id=\"city_viewport\">\n    <div id=\"specialist_panel\">\n    </div>\n\n    <div class=\"city_panel\">\n      <div id=\"city_dialog_info\">\n	  <div></div>\n	  <div style=\"float:left;\">\n	  <span id=\"city_size\"></span>\n	  <div id='city_production_overview'></div>\n	  <div id='city_production_turns_overview'></div>\n	</div>\n	<div style=\"float: left; margin-top: -20px; padding-left: 20px;\"> \n	  <table id=\"city_stats\">\n	  <tr><td>Food: </td><td id=\"city_food\"></td></tr>\n	  <tr><td>Prod: </td><td id=\"city_prod\"></td></tr>\n	  <tr><td>Trade: </td><td id=\"city_trade\"></td></tr>\n	  <tr><td>Gold:: </td><td id=\"city_gold\"></td></tr>\n	  <tr><td>Luxury: </td><td id=\"city_luxury\"></td></tr>\n	  <tr><td>Science: </td><td id=\"city_science\"></td></tr>\n	  <tr><td>Corruption: </td><td id=\"city_corruption\"></td></tr>\n	  <tr><td>Waste: </td><td id=\"city_waste\"></td></tr>\n	  <tr><td>Pollution: </td><td id=\"city_pollution\"></td></tr>\n      <tr><td>Culture: </td><td id=\"city_culture\"></td></tr>\n  	  </table>\n        </div>\n      </div>\n\n    </div>\n    <div id=\"city_improvements_panel\" class=\"city_panel\">\n      <div style=\"clear: left;\"></div>\n      <div id=\"city_improvements\">\n        <div id=\"city_improvements_title\">City Improvements:</div>\n        <div id=\"city_improvements_list\"></div>\n      </div>\n      \n      <div id=\"city_present_units\" >\n        <div id=\"city_present_units_title\">Present Units:</div>\n        <div id=\"city_present_units_list\"></div>\n      </div>\n\n      <div id=\"city_supported_units\" >\n        <div id=\"city_supported_units_title\">Supported Units:</div>\n        <div id=\"city_supported_units_list\"></div>\n      </div>\n\n    </div>\n\n\n  </div>\n  </div>\n  </div> \n  <div id=\"city_tabs-2\">\n    <div id=\"city_production_tab\" class=\"citydlg_tabs\">\n      <div id='worklist_left'>\n        <div id='worklist_dialog_headline'></div>\n        <div id='worklist_heading'>Target Worklist:</div><div id='city_current_worklist'></div>\n      </div>\n      <div id='worklist_right'>\n        <div id='worklist_production_choices'></div>\n      </div>\n      <div id=\"worklist_control\">\n        <button type=\"button\" class=\"button\" onClick=\"city_insert_in_worklist();\" id=\"city_worklist_insert_btn\" title=\"Insert before first selected task, or first in the list\"><i class=\"fa fa-chevron-left fa-fw\"></i></button>\n        <div class=\"wc_spacer\"></div>\n        <button type=\"button\" class=\"button\" onClick=\"city_worklist_task_up();\" id=\"city_worklist_up_btn\" style=\"height: 20%;\" title=\"Move selected tasks up\"><i class=\"fa fa-chevron-up fa-fw\"></i></button>\n        <button type=\"button\" class=\"button\" onClick=\"city_worklist_task_down();\" id=\"city_worklist_down_btn\" style=\"height: 20%;\" title=\"Move selected tasks down\"><i class=\"fa fa-chevron-down fa-fw\"></i></button>\n        <div class=\"wc_spacer\"></div>\n        <button type=\"button\" class=\"button\" onClick=\"city_exchange_worklist_task();\" id=\"city_worklist_exchange_btn\" title=\"Change selected tasks\"><i class=\"fa fa-exchange fa-fw\"></i></button>\n        <div class=\"wc_spacer\"></div>\n        <button type=\"button\" class=\"button\" onClick=\"city_worklist_task_remove();\" id=\"city_worklist_remove_btn\" title=\"Remove selected tasks\"><i class=\"fa fa-trash fa-fw\"></i></button>\n      </div>\n    </div>\n  </div> \n  <div id=\"city_tabs-3\">\n    <div id=\"city_traderoutes_tab\" class=\"citydlg_tabs\"></div>\n  </div> \n  <div id=\"city_tabs-4\">\n    <div id=\"city_settings_tab\" class=\"citydlg_tabs\">\n      <div id=\"city_disband_options\" >\n        <input id=\"disbandable_city\" type=\"checkbox\" name=\"disband_city0\" value=\"disband_city0\"/>Disband city if built settler at size 1.\n\n        <br>\n        <input id='show_unreachable_items' type='checkbox'/>Show unreachable worklist items<br/>\n\n      </div>\n\n    </div>\n  </div>\n\n    <div id=\"city_tabs-5\">\n        <div id=\"city_governor_tab\" class=\"citydlg_tabs\">\n            <form name=\"cma_vals\" id=\"cma_form\" >\n                <table border=\"0\">\n                    <tbody>\n                    <tr>\n\n                        <td>\n                            <span style=\"\">\n                              <input id=\"cma_food\" class=\"cma_checkbox\" type=\"checkbox\" name=\"cma_food\" value=\"\" onclick=\"button_pushed_toggle_cma();\" />\n                              <img style=\"\" class=\"lowered_gov\" src=\"/images/wheat.png\">\n                              <b>Food </b>\n                            </span>\n                        </td>\n                        <td>\n                            <span style=\"\">\n                              <input id=\"cma_shield\" class=\"cma_checkbox\" type=\"checkbox\" name=\"cma_shield\" value=\"\" onclick=\"button_pushed_toggle_cma();\" />\n                              <img style=\"\" class=\"lowered_gov\" src=\"/images/shield14x18.png\">\n                              <b>Shield </b>\n                            </span>\n                        </td>\n                        <td>\n                            <span style=\"\">\n                              <input id=\"cma_trade\" class=\"cma_checkbox\" type=\"checkbox\" name=\"cma_trade\" value=\"\" onclick=\"button_pushed_toggle_cma();\" />\n                              <img style=\"\" class=\"lowered_gov\" src=\"/images/trade.png\">\n                              <b>Trade </b>\n                            </span>\n                        </td>\n                        <td>\n                            <span style=\"\">\n                              <input id=\"cma_gold\" class=\"cma_checkbox\" type=\"checkbox\" name=\"cma_gold\" value=\"\" onclick=\"button_pushed_toggle_cma();\" />\n                              <img style=\"\" class=\"lowered_gov\" src=\"/images/gold.png\">\n                              <b>Gold </b>\n                           </span>\n                        </td>\n                        <td>\n                            <span style=\"\">\n                              <input id=\"cma_luxury\" class=\"cma_checkbox\" type=\"checkbox\" name=\"cma_luxury\" value=\"\" onclick=\"button_pushed_toggle_cma();\" />\n                              <img style=\"\" class=\"lowered_gov\" src=\"/images/lux.png\">\n                              <b>Luxury </b>\n                            </span>\n                        </td>\n                        <td>\n                           <span style=\"\">\n                              <input id=\"cma_science\" class=\"cma_checkbox\" type=\"checkbox\" name=\"cma_science\" value=\"\" onclick=\"button_pushed_toggle_cma();\" />\n                              <img style=\"\" class=\"lowered_gov\" src=\"/images/sci.png\">\n                              <b>Science </b>\n                           </span>\n                        </td>\n\n                    </tr>\n                    </tbody>\n                </table>\n            </form>\n\n\n        </div>\n    </div>\n\n</div>  \n";
},"useData":true});
templates['diplomacy_meeting'] = template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.lambda, alias3=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class='diplomacy_player_box'>\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"player") : depth0)) != null ? lookupProperty(stack1,"flag") : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.program(4, data, 0, blockParams, depths),"data":data,"loc":{"start":{"line":10,"column":2},"end":{"line":14,"column":9}}})) != null ? stack1 : "")
    + "  <div class='agree_"
    + alias3(alias2((depth0 != null ? lookupProperty(depth0,"box") : depth0), depth0))
    + "' id='agree_"
    + alias3(alias2((depth0 != null ? lookupProperty(depth0,"box") : depth0), depth0))
    + "_"
    + alias3(alias2(((stack1 = (depth0 != null ? lookupProperty(depth0,"counterpart") : depth0)) != null ? lookupProperty(stack1,"pid") : stack1), depth0))
    + "'></div>\n  <h3>"
    + alias3(alias2(((stack1 = (depth0 != null ? lookupProperty(depth0,"player") : depth0)) != null ? lookupProperty(stack1,"adjective") : stack1), depth0))
    + " "
    + alias3(alias2(((stack1 = (depth0 != null ? lookupProperty(depth0,"player") : depth0)) != null ? lookupProperty(stack1,"name") : stack1), depth0))
    + "</h3>\n  <div class='dipl_div' >\n    <div id='hierarchy_"
    + alias3(alias2((depth0 != null ? lookupProperty(depth0,"box") : depth0), depth0))
    + "_"
    + alias3(alias2(((stack1 = (depth0 != null ? lookupProperty(depth0,"counterpart") : depth0)) != null ? lookupProperty(stack1,"pid") : stack1), depth0))
    + "'><a tabindex='0' class='menu-button-activator ui-button ui-widget ui-state-default ui-corner-all'><span class='ui-icon ui-icon-triangle-1-s'></span>Add Clause...</a>\n      <ul class='dipl_add'>"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"player") : depth0)) != null ? lookupProperty(stack1,"clauses") : stack1),{"name":"each","hash":{},"fn":container.program(6, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":19,"column":27},"end":{"line":29,"column":15}}})) != null ? stack1 : "")
    + "</ul>\n    </div>\n    <span class='diplomacy_gold'>Gold:<input id='"
    + alias3(alias2((depth0 != null ? lookupProperty(depth0,"box") : depth0), depth0))
    + "_gold_"
    + alias3(alias2(((stack1 = (depth0 != null ? lookupProperty(depth0,"counterpart") : depth0)) != null ? lookupProperty(stack1,"pid") : stack1), depth0))
    + "' type='number' step='1' size='3' value='0'></span>\n  </div>\n</div>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  <img src='/images/flags/"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"player") : depth0)) != null ? lookupProperty(stack1,"flag") : stack1), depth0))
    + "' class='flag_"
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"box") : depth0), depth0))
    + "' id='flag_"
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"box") : depth0), depth0))
    + "_"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"counterpart") : depth0)) != null ? lookupProperty(stack1,"pid") : stack1), depth0))
    + "'>\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  <canvas class='flag_"
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"box") : depth0), depth0))
    + "' id='flag_"
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"box") : depth0), depth0))
    + "_"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"counterpart") : depth0)) != null ? lookupProperty(stack1,"pid") : stack1), depth0))
    + "' width='58' height='40'></canvas>\n";
},"6":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "\n"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"title") : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0, blockParams, depths),"inverse":container.program(10, data, 0, blockParams, depths),"data":data,"loc":{"start":{"line":20,"column":8},"end":{"line":28,"column":15}}})) != null ? stack1 : "")
    + "      ";
},"7":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "          <li><div>"
    + container.escapeExpression(container.lambda((depth0 != null ? lookupProperty(depth0,"title") : depth0), depth0))
    + "</div>\n          <ul>"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"clauses") : depth0),{"name":"each","hash":{},"fn":container.program(8, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":22,"column":14},"end":{"line":24,"column":19}}})) != null ? stack1 : "")
    + "</ul>\n          </li>\n";
},"8":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "\n            <li><div><a href='#' onclick='create_clause_req("
    + alias2(alias1(((stack1 = (depths[2] != null ? lookupProperty(depths[2],"counterpart") : depths[2])) != null ? lookupProperty(stack1,"pid") : stack1), depth0))
    + ", "
    + alias2(alias1(((stack1 = (depths[2] != null ? lookupProperty(depths[2],"player") : depths[2])) != null ? lookupProperty(stack1,"pid") : stack1), depth0))
    + ", "
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"type") : depth0), depth0))
    + ", "
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"value") : depth0), depth0))
    + ");'>"
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"name") : depth0), depth0))
    + "</a></div></li>\n          ";
},"10":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "          <li><div><a href='#' onclick='create_clause_req("
    + alias2(alias1(((stack1 = (depths[1] != null ? lookupProperty(depths[1],"counterpart") : depths[1])) != null ? lookupProperty(stack1,"pid") : stack1), depth0))
    + ", "
    + alias2(alias1(((stack1 = (depths[1] != null ? lookupProperty(depths[1],"player") : depths[1])) != null ? lookupProperty(stack1,"pid") : stack1), depth0))
    + ", "
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"type") : depth0), depth0))
    + ", "
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"value") : depth0), depth0))
    + ");'>"
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"name") : depth0), depth0))
    + "</a></div></li>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "\n<div id='diplomacy_dialog_"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"counterpart") : depth0)) != null ? lookupProperty(stack1,"pid") : stack1), depth0))
    + "'>\n  <div>\n    Treaty clauses:<br>\n    <div class='diplomacy_messages' id='diplomacy_messages_"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"counterpart") : depth0)) != null ? lookupProperty(stack1,"pid") : stack1), depth0))
    + "'></div>\n"
    + ((stack1 = container.invokePartial(lookupProperty(partials,"diplomacy_player_box"),depth0,{"name":"diplomacy_player_box","hash":{"player":(depth0 != null ? lookupProperty(depth0,"self") : depth0),"box":"self"},"data":data,"indent":"    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(lookupProperty(partials,"diplomacy_player_box"),depth0,{"name":"diplomacy_player_box","hash":{"player":(depth0 != null ? lookupProperty(depth0,"counterpart") : depth0),"box":"counterpart"},"data":data,"indent":"    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "  </div>\n</div>\n";
},"main_d":  function(fn, props, container, depth0, data, blockParams, depths) {

  var decorators = container.decorators, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  fn = lookupProperty(decorators,"inline")(fn,props,container,{"name":"inline","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"args":["diplomacy_player_box"],"data":data,"loc":{"start":{"line":1,"column":0},"end":{"line":34,"column":11}}}) || fn;
  return fn;
  }

,"useDecorators":true,"usePartial":true,"useData":true,"useDepths":true});
templates['intel'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "\n    <li>"
    + container.escapeExpression(container.lambda((depth0 != null ? lookupProperty(depth0,"state") : depth0), depth0))
    + "<ul>\n    "
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"nations") : depth0),{"name":"each","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":27,"column":4},"end":{"line":27,"column":47}}})) != null ? stack1 : "")
    + "\n    </ul></li>\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "<li>"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</li>";
},"4":function(container,depth0,helpers,partials,data) {
    return "    No contact with other nations\n    ";
},"6":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "\n    <li class=\"tech-"
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"who") : depth0), depth0))
    + "\">"
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"name") : depth0), depth0))
    + "</li>\n";
},"8":function(container,depth0,helpers,partials,data) {
    return "    This exciting tribe does not seem to invest in technology.\n    ";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div id=\"intel_tabs\">\n  <ul>\n    <li><a href=\"#intel_tabs-overview\">Overview</a></li>\n    <li><a href=\"#intel_tabs-diplomacy\">Diplomacy</a></li>\n    <li><a href=\"#intel_tabs-technology\">Technology</a></li>\n  </ul>\n\n  <div id=\"intel_tabs-overview\" class=\"inteldlg_tabs\">\n    <table class=\"vert-attr-list\">\n    <tr><th>Ruler</th><td>"
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"ruler") : depth0), depth0))
    + "</td></tr>\n    <tr><th>Government</th><td>"
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"government") : depth0), depth0))
    + "</td></tr>\n    <tr><th>Capital</th><td>"
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"capital") : depth0), depth0))
    + "</td></tr>\n    <tr><th>Gold</th><td>"
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"gold") : depth0), depth0))
    + "</td></tr>\n    <tr><th>&nbsp;</th><td></td></tr>\n    <tr><th>Tax</th><td>"
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"tax") : depth0), depth0))
    + "</td></tr>\n    <tr><th>Science</th><td>"
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"science") : depth0), depth0))
    + "</td></tr>\n    <tr><th>Luxury</th><td>"
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"luxury") : depth0), depth0))
    + "</td></tr>\n    <tr><th>&nbsp;</th><td></td></tr>\n    <tr><th>Researching</th><td>"
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"researching") : depth0), depth0))
    + "</td></tr>\n    <tr><th>Culture</th><td>"
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"culture") : depth0), depth0))
    + "</td></tr>\n    </table>\n  </div> \n\n  <div id=\"intel_tabs-diplomacy\" class=\"inteldlg_tabs\">\n    <ul>"
    + ((stack1 = lookupProperty(helpers,"each").call(alias3,(depth0 != null ? lookupProperty(depth0,"dipl") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(4, data, 0),"data":data,"loc":{"start":{"line":25,"column":8},"end":{"line":32,"column":13}}})) != null ? stack1 : "")
    + "</ul>\n  </div> \n\n  <div id=\"intel_tabs-technology\" class=\"inteldlg_tabs\">\n    <ul>"
    + ((stack1 = lookupProperty(helpers,"each").call(alias3,(depth0 != null ? lookupProperty(depth0,"tech") : depth0),{"name":"each","hash":{},"fn":container.program(6, data, 0),"inverse":container.program(8, data, 0),"data":data,"loc":{"start":{"line":36,"column":8},"end":{"line":40,"column":13}}})) != null ? stack1 : "")
    + "</ul>\n  </div> \n \n</div>  \n";
},"useData":true});
})();