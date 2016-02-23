Ext.define('Player.page.questions.BaseMCH', {
  extend: 'Player.page.questions.MC',
  distractorType: 'radiofield',
  /*Acccessors*/
  // distractor name should be the same for all radio, but not checkbox
  getDistractorName: function(letter) {
    return 'distractor_' + this.questionId;
  }
});