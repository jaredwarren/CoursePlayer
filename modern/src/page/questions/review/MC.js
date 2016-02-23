Ext.define('Player.page.questions.review.MC', {
  extend: 'Player.page.questions.review.ReviewQuestion',

  xtype: 'reviewMC',

  constructor: function(cfg) {
    var me = this,
      items,
      responses = cfg.question.getQuestionRecord().response,
      correctResponses = cfg.question.getQuestionRecord().correctResponse;
    cfg = cfg || {};

    var distractors = cfg.question.queryById('distractorContainer').items.items,
      distractorList = [];
    Ext.Array.each(distractors, function(item, index, items) {
      var response = '';
      // TODO: make this and html into template..................
      if (me.findLetter(correctResponses, item.raw.letter) && me.findLetter(responses, item.raw.letter)) {
        response = '<div style="width:16px; color: green; float: left;">' + "&#x2713;" + '</div>';
      } else if (me.findLetter(responses, item.raw.letter)) {
        response = '<div style="width:16px; color: red; float: left;">' + "&#x2717;" + '</div>';
      } else {
        response = '<div style="width:16px; float: left;">' + "&nbsp;" + '</div>';
      }
      
      distractorList.push(me.getDistractor(item.raw, response));
    });
    
    me.callParent([Ext.apply({
      items: [{
        xtype: 'panel',
        itemId: 'distractorContainer',
        defaultType: 'panel',
        //layout: 'anchor',
        defaults: {
          width: '100%',
          height: 100
        },
        items: distractorList
      }]
    }, cfg)]);
  },

  getDistractor: function(distractor, response) {
    var me = this;
    return {
      xtype: me.distractorType,
      html: response + " " + distractor.letter + ": " + distractor.distractorText,
      styleHtmlContent: true,
      correct: distractor.correct
    };
  }
});