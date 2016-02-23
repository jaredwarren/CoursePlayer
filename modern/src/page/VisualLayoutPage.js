Ext.define('Player.page.VisualLayoutPage', {
	extend: 'Player.page.BaseVisualLayoutPage',

	layout: "fit",

	initialize: function() {
		var me = this;
		me.callParent(arguments);
		me.on('resize', me.onResize, me);
	},

	onResize: function() {
		this.resizeCanvas(arguments);
	}
});