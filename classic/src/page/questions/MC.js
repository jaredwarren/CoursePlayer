Ext.define('Player.page.questions.MC', {
  extend: 'Player.page.questions.BaseMC',

  xtype: 'MC',

  requires: [
    'Ext.form.field.Checkbox'
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
        xtype: 'fieldcontainer',
        itemId: 'distractorContainer',
        defaultType: me.distractorType,
        width: '90%',
        layout: 'anchor',
        defaults: {
          style: 'white-space: auto',
          anchor: '100%'
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

    var name = me.getDistractorName(distractor.letter);
    return {
      xtype: me.distractorType,
      inputValue: distractor.letter,
      boxLabel: distractorText,
      name: name,
      labelWrap: true,
      id: 'distractor_' + me.questionId + '_' + distractor.letter,
      labelWidth: null,
      styleHtmlContent: true,
      letter: distractor.letter,
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
      qs = me.query(me.distractorType);

    Ext.Array.each(me.query(me.distractorType), function(distractor, index, items) {
      if (Ext.isBoolean(distractor.value)) {
        distractor.setValue(false);
      }
      distractor.checked = false
      distractor.setDisabled(false);
    });
    me.callParent(arguments);
  }
});