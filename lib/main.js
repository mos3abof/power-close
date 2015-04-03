var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var self = require("sdk/self");
var tabs = require("sdk/tabs");

var button = ToggleButton({
  id: "firefox-power-close",
  label: "Power Close",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onChange: handleChange
});

var panel = panels.Panel({
  contentURL: self.data.url("text-entry.html"),
  contentScriptFile: self.data.url("get-text.js"),
  onHide: handleHide,
  height: 150
});

function handleChange(state) {
  if (state.checked) {
    panel.show({
      position: button
    });
  }
}

function handleHide() {
  button.state('window', {checked: false});
}


// Listen for content coming from the panel
panel.port.on('text-entered', function(text){
	// loop over open tabs
	for each (var tab in tabs) {
		// If we find a match, we close it
  		if (tab.url.indexOf(text) > -1) {
  			tab.close();
  		}
  	}
  	panel.hide();
});
