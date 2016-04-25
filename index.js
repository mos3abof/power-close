var {ToggleButton} = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var self = require("sdk/self");
var tabs = require("sdk/tabs");
var cm = require("sdk/context-menu");

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

function closeTabsByKeyword(keyword) {
	if (keyword) {
		for each(var tab
	in
		tabs
	)
		{
			if (tab.url.indexOf(keyword) > -1) {
				tab.close();
			}
		}
	}
}

// Listen for content coming from the panel
panel.port.on('text-entered', function (text) {
	closeTabsByKeyword(text);
	panel.hide();
});

panel.on('show', function () {
	panel.port.emit("show");
});

var script = "self.on('click', function (node, data) {" +
	"   url_to_close = new URL(document.URL).hostname;" +
	"   self.postMessage(url_to_close);" +
	"});";

cm.Item({
	label: "Close all tabs from this domain",
	context: cm.PageContext(),
	contentScript: script,
	onMessage: function (url_to_close) {
		closeTabsByKeyword(url_to_close);
	}
});
