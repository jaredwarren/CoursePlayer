Ext.define('Player.page.questions.review.ReviewQuestion', {
  extend: 'Ext.Panel',

  xtype: 'reviewQuestion',

  config: {
    question: undefined
  },
  distractorType: 'container',
  layout: {
    align: 'center',
    type: 'vbox',
    pack: 'center'
  },

  constructor: function(cfg) {
    var me = this,
      items = [];
    cfg = cfg || {};

    // merge question text and distractors
    items = Ext.Array.merge(cfg.question.getQuestionRecord().question, cfg.items);

    // add correct response text
    if (!cfg.question.getQuestionRecord().blnCorrect) {
      var correctString = '';
      // join
      correctString = Ext.Array.map(cfg.question.getQuestionRecord().correctResponse, function(correctResponse, index, items) {
        return correctResponse.Short;
      }).join(', ');

      items.push({
        xtype: 'container',
        html: Lang.review.Correct_Answer + ": " + correctString,
        padding: '6 0 0 0'
      });
    }

    // remove so we don't have suplicate items
    delete cfg.items;

    me.callParent([Ext.apply({
      items: [{
        xtype: 'container',
        width: '90%',
        layout: {
          align: 'center',
          type: 'vbox',
          pack: 'start'
        },
        items: items
      }]
    }, cfg)]);
  },

  /*
  Utility Functions
  */
  findLetter: function(list, letter) {
    for (var i = list.length - 1; i >= 0; i--) {
      if (list[i].Short === letter) {
        return true;
      }
    };
    return false;
  }
});