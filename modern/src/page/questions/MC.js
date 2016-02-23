Ext.define('Player.page.questions.MC', {
  extend: 'Player.page.questions.BaseMC',

  xtype: 'MC',

  requires: [
    'Ext.field.Checkbox'
  ],

  constructor: function(cfg) {
    var me = this,
      distractorList = [];

    me.strID = cfg.questionId;
    me.questionId = Ext.id();

    cfg.questionRecord = {};

    // If not randomized, I can add them now.
    if (!cfg.distractors.randomize) {
      distractorList = me.refreshQuestionList(cfg);
    }

    // TODO: if questionRecord has guess data, apply to question
    me.callParent([Ext.apply({
      items: [{
        xtype: 'panel',
        itemId: 'distractorContainer',
        minWidth: '90%',
        defaultType: me.distractorType,
        layout: {
          type: 'vbox',
          align: 'start',
          pack: 'start'
        },
        items: distractorList
      }]
    }, cfg)]);
  },

  getDistractor: function(distractor) {
    var me = this,
      distractorText = distractor['#text'].toString();

    if (!distractorText) {
      return false;
    }
    distractor.distractorText = distractorText;

    return {
      xtype: me.distractorType,
      inputValue: distractor.letter,
      label: distractorText,
      labelAlign: 'right',
      name: me.getDistractorName(distractor.letter),
      labelWrap: true,
      labelWidth: '90%',
      width: '100%',
      //minWidth: 300,
      styleHtmlContent: true,
      letter: distractor.letter,
      value: distractor.letter,
      correct: distractor.correct,
      longText: distractorText.replace(/(<([^>]+)>)/ig, ""),
      raw: distractor,
      listeners: {
        change: {
          fn: me.onSelect,
          scope: me
        }
      }
    };
  },

  clearOptions: function() {
    var me = this,
      qs = me.query(me.distractorType),
      distractor;
    for (var i = qs.length - 1; i >= 0; i--) {
      var distractor = qs[i];
      distractor.setChecked(false);
      distractor.setDisabled(false);
    };
    me.callParent(arguments);
  }
});