Ext.define('Player.view.main.NarrationPanel', {
	extend: 'Ext.window.Window',
	xtype: 'narrationpanel',
	cls: 'narrationpanel',

	title: Lang.Narration,
	closeAction: 'hide',
	reference: 'narration',

	scrollable: 'vertical',

	constructor: function(cfg) {
		var me = this;
		cfg = cfg || {};
		me.callParent([Ext.apply({
			listeners: {
				click: {
					fn: me.onPageTap,
					element: 'el',
					scope: me
				}
			}
		}, cfg)]);
	},

	onRender: function() {
		var me = this;
		me.callParent(arguments);
		if (me.getWidth() >= window.innerWidth * .9) {
			me.setWidth(window.innerWidth * .9);
		}
	},

	onPageTap: function(event, target, eOpts) {
		var me = this,
			tempTarget;
		event.preventDefault();
		event.stopPropagation();
		if (target) {
			tempTarget = target;
			while (tempTarget.parentNode) {
				if (tempTarget.nodeName == 'A') {
					me.fireEvent('link-tap', me, tempTarget.href, tempTarget);
					return false;
				} else {
					tempTarget = tempTarget.parentNode;
				}
			}
		}
	}
});