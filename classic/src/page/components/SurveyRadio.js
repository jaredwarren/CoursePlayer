Ext.define('Player.page.components.SurveyRadio', {
	extend: 'Ext.Container',
	alias: ['widget.surveyradio'],
	config: {
		layout: {
			type: 'hbox',
			pack: 'center'
		},
		width: '100%',
		cls: 'surveyradio-container',
		items: [],
		questionId: 'question0',
		columns: [1, 2, 3, 4, 5],
		answered: false
	},

	updateColumns: function(newColumns) {
		var me = this;

		Ext.Object.each(newColumns, function(key, value) {
			me.add({
				xtype: 'radiofield',
				name: me.getQuestionId(),
				label: value,
				value: value,
				labelAlign: 'bottom',
				listeners: {
					check: me.onSelect,
					scope: me
				}
			});
		});
	},
	onSelect: function(radio) {
		var me = this;
		if (me.getDisabled()) {
			return false;
		}
		me.setAnswered(true);
		me.fireEvent('select', me, radio.getValue());
	},

	disable: function(){
		this.callParent(arguments);
		var me = this,
			radios = me.query('radiofield');
		for (var i = radios.length - 1; i >= 0; i--) {
			radios[i].disable();
		};
	},
	enable: function(){
		this.callParent(arguments);
		var me = this,
			radios = me.query('radiofield');
		for (var i = radios.length - 1; i >= 0; i--) {
			radios[i].enable();
		};
	},

	initialize: function() {
		var me = this;
	}
});