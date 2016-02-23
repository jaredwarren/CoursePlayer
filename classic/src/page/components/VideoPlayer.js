Ext.define('Player.page.components.VideoPlayer', {
	extend: 'Player.page.components.BaseVideoPlayer',

	xtype: 'videoplayer',

	requires: [
		'Player.page.components.VideoComponent',
		'Player.page.components.VideoControls'
	],
	onResize: function() {
		var me = this;
		me.callParent(arguments);
		// If I call resize too soon, I get a bunch of layout run failed errors
		// so I'm waiting until the video is laoded to call resize again.
		if (me.videoLoaded) {
			me.resizeVideo(arguments);
		}
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