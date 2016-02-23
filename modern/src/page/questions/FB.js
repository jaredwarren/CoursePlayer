Ext.define('Player.page.questions.FB', {
  extend: 'Player.page.questions.Question',

  xtype: 'FB',

  layout: {
    align: 'center',
    type: 'vbox'
  },
  scrollable: {
    direction: 'vertical',
    directionLock: true
  },
  config: {
    responses: undefined,
    otherRespCorrect: false,
    exactMatch: false,
    caseSensitive: false,
    feedback: {
      "initPrompt": {
        "#text": Lang.questions.FB.initPrompt
      }
    }
  },

  distractorType: 'textfield',

  constructor: function(cfg) {
    var me = this,
      allResponses = cfg.responses.response,
      correctResponses = [];

    // Update Store Refrence
    for (var i = 0, ln = allResponses.length; i < ln; i++) {
      var tempResponse = allResponses[i];
      if (tempResponse.correct && !! tempResponse['#text']) {
        correctResponses.push({
          Short: tempResponse['#text']+'',
          Long: tempResponse['#text']+''
        });
      }
    };

    cfg.questionRecord = {};
    cfg.questionRecord.correctResponse = correctResponses;

    me.callParent([Ext.apply({
      items: [me.getDistractor()]
    }, cfg)]);
  },


  getDistractor: function(distractor) {
    var me = this;
    return {
      xtype: me.distractorType,
      label: Lang.questions.FB.EnterAnswer + ":",
      labelAlign: 'top',
      clearIcon: false,
      cls: 'question-text-input',
      enableKeyEvents: true,
      name: 'inputText',
      value: '',
      itemId: 'inputText'
    };
  },

  initialize: function() {
    var me = this;
    me.callParent(arguments);

    me.down('#inputText').on('keyup', me.onSelect, me, {
      buffer: 500
    });
  },

  /*Guess/Answer*/
  evalutateGuess: function() {
    var me = this,
      correct = false,
      guessString = me.getValues().inputText || '',
      exactMatch = me.getExactMatch(),
      caseSensitive = me.getCaseSensitive(),
      otherRespCorrect = me.getOtherRespCorrect(),
      responses = me.getQuestionRecord().correctResponse;

    if (!caseSensitive && guessString) {
      guessString = guessString.toLowerCase();
    }
    if (otherRespCorrect) {
      correct = true;
    }

    // there's got to be a better ay to do this...
    for (var i = responses.length - 1; i >= 0; i--) {
      var response = responses[i],
        answerString = response.Long;
      if (!caseSensitive) {
        answerString = answerString.toLowerCase();
      }
      if (otherRespCorrect) {
        if (exactMatch) {
          if (guessString == answerString) {
            correct = false;
            break;
          } else {
            continue;
          }
        } else {
          if (guessString.search(answerString) >= 0) {
            correct = false;
            break;
          } else {
            continue;
          }
        }
      } else {
        if (exactMatch) {
          if (guessString == answerString) {
            correct = true;
            break;
          } else {
            continue;
          }
        } else {
          if (guessString.search(answerString) >= 0) {
            correct = true;
            break;
          } else {
            continue;
          }
        }
      }
    }
    return correct;
  },

  /*Cleanup*/
  disableQuestion: function() {
    var me = this;
    me.queryById('inputText').setDisabled(true);
    me.callParent(arguments);
  },

  clearOptions: function() {
    var me = this,
      qs = me.queryById('inputText');
    qs.setDisabled(false);
    qs.setValue('');
    me.callParent(arguments);
  }
});