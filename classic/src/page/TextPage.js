Ext.define('Player.page.TextPage', {
	extend: 'Player.page.BaseTextPage',

	// fixes layout run failed problem
	layout: "border",
	anchor: "100% 100%",
	// required, otherwise scroller will cover while page
	scrollable: false
});