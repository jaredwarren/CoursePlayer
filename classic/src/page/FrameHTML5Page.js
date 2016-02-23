Ext.define('Player.page.FrameHTML5Page', {
	extend: 'Player.page.BaseFrameHTML5Page',

	xtype: 'FrameHTML5Page',

	getBodyEl: function() {
		return this.queryById('pageHtml').body.dom;
	},
	setLoadingMask: function(message) {
		var me = this,
			maskObject = false;
		if (message === false) {
			if (me.pageMask) {
				me.pageMask.hide();
			}
		} else {
			if (!me.pageMask) {
				me.pageMask = new Ext.LoadMask({
					msg: message,
					target: me
				});
			} else {
				me.pageMask.msg = message;
			}
			if (!me.pageMask.isVisible()) {
				me.pageMask.show();
			}
		}
	}
});