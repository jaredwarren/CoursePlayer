Ext.define('Player.page.questions.review.FB', {
  extend: 'Player.page.questions.review.ReviewQuestion',
  xtype: 'reviewFB',

  constructor: function(cfg) {
    var me = this,
      items,
      responses = cfg.question.getQuestionRecord().response,
      correctResponses = cfg.question.getQuestionRecord().correctResponse;
    cfg = cfg || {};

    var distractor = cfg.question.queryById('inputText'),
      response = '';
    if (cfg.question.getQuestionRecord().blnCorrect) {
      response = '<div style="width:16px; color: green; float: left;">' + "&#x2713;" + '</div>' + distractor.value;
    } else {
      response = '<div style="width:16px; color: red; float: left;">' + "&#x2717;" + '</div>' + distractor.value;
    }

    me.callParent([Ext.apply({
      items: [{
        xtype: 'field',
        itemId: 'distractorContainer',
        defaultType: 'panel',
        layout: 'anchor',
        defaults: {
          anchor: '100%'
        },
        items: [{
          xtype: me.distractorType,
          html: response,
          styleHtmlContent: true,
          correct: distractor.correct
        }]
      }]
    }, cfg)]);
  }
});