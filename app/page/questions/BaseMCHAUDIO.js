Ext.define('Player.page.questions.BaseMCHAUDIO', {
  extend: 'Player.page.questions.MCAUDIO',

  distractorType: 'radiofield',

  /*Acccessors*/
  // distractor name should be the same for all radio, but not checkbox
  getDistractorName: function(letter) {
    return 'distractor_' + this.questionId;
  }
});