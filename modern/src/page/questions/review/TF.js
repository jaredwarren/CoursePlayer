Ext.define('Player.page.questions.review.TF', {
  extend: 'Player.page.questions.review.MCH',
  xtype: 'reviewTF',
  getDistractor: function(distractor, response) {
    var me = this;
    return {
      xtype: me.distractorType,
      html: response + " " + distractor.distractorText,
      styleHtmlContent: true,
      correct: distractor.correct
    };
  }
});