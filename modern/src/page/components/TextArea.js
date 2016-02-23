Ext.define('Player.page.components.TextArea', {
	extend: 'Ext.Container',
	xtype: 'scrolltextarea',
	scrollable: {
		direction: 'vertical',
		directionLock: true
	},
	items: [{
		xtype: 'textareafield',
		itemId: 'textarea',
		value: '',
		clearIcon: false
	}],
	height: '100%',
	answered: false,
	config: {
		name: '',
		placeHolder: ''
	},

	updatePlaceHolder: function(placeHolder){
		this.getComponent('textarea').setPlaceHolder(placeHolder);
	},
	updateName: function(name) {
		this.query('#textarea')[0].setName(name);
	},
	initialize: function() {
		var me = this;
		me.down('#textarea').on('keyup', me.grow, me);
		me.textarea = me.element.down('textarea');
		me.textarea.dom.style['overflow'] = 'hidden';
		me.on('painted', me.onPainted, me);
	},
	onPainted: function() {
		var me = this;
		me.textarea.setHeight(me.element.getHeight());

		//me.down('#textarea').setPlaceHolder(me.config.placeHolder);
	},

	grow: function() {
		
		return;
		var me = this,
			textHeight = me.textarea.dom.scrollHeight,
			scr = me.getScrollable().getScroller();

		me.setAnswered(me.textarea.getValue() != '');
		me.fireEvent('select', me, me.textarea.getValue());

		if (me.getHeight() < textHeight) {
			me.textarea.setHeight(me.textarea.dom.scrollHeight + 2);
			scr.scrollToEnd();
		}
	}
});