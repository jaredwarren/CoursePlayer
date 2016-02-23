Ext.define('Player.page.questions.BaseMC', {
  extend: 'Player.page.questions.Question',

  layout: {
    align: 'center',
    type: 'vbox'
  },
  scrollable: {
    direction: 'vertical',
    directionLock: true
  },
  config: {
    distractors: undefined
  },

  distractorType: 'checkboxfield',

  refreshQuestionList: function(cfg) {
    var me = this,
      distractors = cfg.distractors.distractor,
      correctResponse = [];

    me.responseKey = {};

    var distractorList = [];
    for (var i = 0; i < distractors.length; i++) {
      var distractor = distractors[i];

      if (!distractor.letter) {
        distractor.letter = String.fromCharCode(65 + i);
      }

      distractorObj = me.getDistractor(distractor);
      if (distractorObj) {
        distractorList.push(distractorObj);
        // remove html tags for SCORM
        if (distractor.correct) {
          correctResponse.push({
            Short: distractor.letter,
            Long: distractorObj.longText
          });
        }
        me.responseKey[distractor.letter] = distractorObj.longText;
      }
    };

    if (cfg.distractors.randomize) {
      distractorList = randomizeArray(distractorList);
    }

    // Update Store Refrence
    cfg.questionRecord.correctResponse = correctResponse;

    return distractorList;
  },

  /*Acccessors*/
  // distractor name should be the same for all radio, but not checkbox
  getDistractorName: function(letter) {
    return letter;
  },

  getCorrectAnswer: function() {
    var me = this,
      correctResponses = me.getQuestionRecord().correctResponse,
      answerString = '';

    for (i = 0, ln = correctResponses.length; i < ln; i++) {
      answerString += correctResponses[i].Short;
    }
    return answerString;
  },

  getGuessAnswer: function() {
    var me = this,
      results = me.getValues(),
      guessString = '',
      userResponse = [];

    var resultKeys = Ext.Object.getAllKeys(results).sort();
    Ext.Array.each(resultKeys, function(resultKey, index, items) {
      var value = results[resultKey];
      guessString += value;
      userResponse.push({
        Short: value,
        Long: me.responseKey[value]
      });
    });

    me.getQuestionRecord().response = userResponse;

    return guessString;
  },

  /*Cleanup*/
  disableQuestion: function() {
    var me = this,
      qs = me.query(me.distractorType);
    for (var i = qs.length - 1; i >= 0; i--) {
      qs[i].setDisabled(true);
    };
    me.callParent(arguments);
  },

  /*
  Page Navigation
  */
  start: function() {
    var me = this;
    // randomize distractors
    if (me.getDistractors().randomize) {
      var distractorContainer = me.queryById('distractorContainer');
      distractorContainer.removeAll();
      distractorContainer.add(me.refreshQuestionList(me.getConfig()));
    }

    me.callParent(arguments);
  }
});