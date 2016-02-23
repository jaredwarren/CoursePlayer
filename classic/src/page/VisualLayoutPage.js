Ext.define('Player.page.VisualLayoutPage', {
	extend: 'Player.page.BaseVisualLayoutPage',

	layout: "border",

	onResize: function() {
		var me = this;
		me.callParent(arguments);
		me.resizeCanvas(arguments);
	}
});