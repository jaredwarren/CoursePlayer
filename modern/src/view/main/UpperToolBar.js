Ext.define('Player.view.main.UpperToolBar', {
	extend: 'Ext.Panel',

	requires: [
		'Player.view.main.UpperToolbarModel'
	],

	reference: 'upperToolBar',
	viewModel: {
		type: 'uppertoolbar'
	},
	config: {
		height: 47,
		baseCls: 'x-toolbar',
		layout: {
			align: 'center',
			type: 'hbox'
		}
	}

});