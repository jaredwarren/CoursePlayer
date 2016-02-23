Ext.define('Player.page.Essay', {
	extend: 'Player.page.BaseEssay',
	xtype: 'Essay',
	requires: [
		'Player.page.components.TextArea'
	],
	//layout: 'fit',
	layout: "border",
	anchor: "100% 100%",
	// required, otherwise scroller will cover while page
	scrollable: false
});