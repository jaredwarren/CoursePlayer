Ext.define('Player.page.VLPComponents.NoteView', {
	extend: 'Player.page.VLPComponents.BaseNoteView',
	xtype: 'vlpnoteview',
	// stupid hack to fix scrolling not working
	afterRender: function() {
		var me = this;
		me.callParent(arguments);
		me.queryById('noteText').setHeight(me.getHeight());
	}
});