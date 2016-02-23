Ext.define('Player.page.questions.review.MCAUDIO', {
	extend: 'Player.page.questions.review.MC',
	xtype: 'reviewMCAUDIO',

	getDistractor: function(distractor, response) {
		var me = this;
		return {
			xtype: 'audiobox',
			mediaPath: distractor.filePath,
			items: [{
				xtype: me.distractorType,
				html: response + " " + distractor.letter + ": " + distractor.distractorText,
				styleHtmlContent: true
			}]
		};
	}
});