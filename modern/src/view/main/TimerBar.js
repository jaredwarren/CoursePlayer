Ext.define('Player.view.main.TimerBar', {
	extend: 'Ext.Panel',
	xtype: 'timerbar',
	requires: [
		'Player.view.main.TimerController',
		'Player.view.main.TimerModel'
	],

	reference: 'timerbar',
	controller: 'timer',
	viewModel: 'timer',
	layout: {
		type: 'hbox',
		pack: 'center',
		align: 'center'
	},

	docked: 'top',
	height: 47,
	bind: {
		html: '<center>{timeString}</center>'
	}
});