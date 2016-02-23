Ext.define('Player.page.questions.MCAUDIO', {
	extend: 'Player.page.questions.BaseMCAUDIO',

	xtype: 'MCAUDIO',

	requires: [
		'Ext.field.Checkbox',
		'Player.page.components.AudioBox'
	],

	onPlay: function(event) {
		var me = this;
		// pause all others...
		Ext.Array.each(me.query('audio'), function(audio, index, items) {
			if (audio.media.dom != event.target) {
				audio.pause();
			}
		});
	}
});