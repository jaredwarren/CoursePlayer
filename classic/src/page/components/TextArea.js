Ext.define('Player.page.components.TextArea', {
	extend: 'Ext.Container',
	xtype: 'scrolltextarea',
	scrollable: {
		direction: 'vertical',
		directionLock: true
	},
	height: '100%',
	answered: false,
	config: {
		name: '',
		placeHolder: ''
	},


	constructor: function(cfg) {
		var me = this;
		me.callParent([Ext.apply({
			items: [{
				xtype: 'textareafield',
				itemId: 'textarea',
				enableKeyEvents: true,
				name: cfg.name || 'textarea',
				placeHolder: cfg.placeHolder || '',
				value: '',
				clearIcon: false
			}]
		}, cfg)]);
	},


	onRender: function() {
		var me = this;
		me.callParent(arguments);

		/*me.down('#textarea').on('keyup', me.grow, me, {
			buffer: 200
		});*/

		me.textarea = me.el.down('textarea');
		me.textarea.dom.style['overflow'] = 'hidden';
		//me.on('painted', me.onPainted, me);
		me.textarea.setHeight(me.el.getHeight());
	},
	onPainted: function() {
		var me = this;
		console.warn("TODO:");
		//me.down('#textarea').setPlaceHolder(me.config.placeHolder);
	},

	// do I need this on desktop?
	grow: function() {
		var me = this,
			textHeight = me.textarea.dom.scrollHeight,
			scr = me.getScrollable(),
			value = me.textarea.getValue();

		me.answered = (value != '');
		me.fireEvent('select', me, value);

		if (me.getHeight() < textHeight) {
			me.textarea.setHeight(me.textarea.dom.scrollHeight + 2);
			scr.scrollToEnd();
		}
	}
});