Ext.define('Player.page.questions.review.DDTASK', {
  extend: 'Ext.form.Panel',
  xtype: 'reviewDDTASK',

  config: {
    question: undefined
  },
  distractorType: 'container',

  constructor: function(cfg) {
    var me = this,
      responses = cfg.question.questionRecord.response,
      correctResponses = cfg.question.questionRecord.correctResponse;
    cfg = cfg || {};

    items = cfg.question.getQuestionRecord().question;

    items.push({
      xtype: 'fieldcontainer',
      width: '100%',
      margin: '30 0 0 0',
      defaultType: 'container',
      fieldLabel: 'Your answers were',
      labelAlign: 'top',
      layout: 'anchor'
    });

    var distractorList = [];
    Ext.Array.each(correctResponses, function(correctResponse, matchelement) {
      if (typeof correctResponse == "undefined") {
        return;
      }
      distractorList = [];
      Ext.Array.each(responses, function(userResponse, responseIndex) {
        if (userResponse.Short === matchelement.toString()) {
          var responseHtml = '';
          if (userResponse.correct) {
            responseHtml = '<div style="width:16px; color: green; float: left;">&#x2713;</div> : ' + userResponse.Long;
          } else {
            responseHtml = '<div style="width:16px; color: red; float: left;">&#x2717;</div> : ' + userResponse.Long;
          }
          distractorList.push({
            xtype: me.distractorType,
            html: responseHtml,
            styleHtmlContent: true
          });
        }
      });

      items.push({
        xtype: 'fieldcontainer',
        width: '100%',
        margin: '30 0 0 0',
        flex: 1,
        defaultType: 'container',
        fieldLabel: correctResponse.title.toString(),
        labelAlign: 'top',
        layout: 'anchor',
        items: distractorList
      });
    });

    // add correct response text
    if (!cfg.question.getQuestionRecord().blnCorrect) {
      var ddistractorList = [],
        correctHtml = '';
      Ext.Array.each(correctResponses, function(correctResponse, correctResponseIndex) {
        if (typeof correctResponse == "undefined") {
          return;
        }
        var ms = [];
        Ext.Array.each(correctResponse.matches, function(match, correctResponseIndex) {
          ms.push({
            xtype: 'container',
            html: match.text,
            styleHtmlContent: true
          });
        });
        ddistractorList.push({
          xtype: 'fieldcontainer',
          fieldLabel: correctResponse.title.toString(),
          labelAlign: 'top',
          items: ms
        });
      });

      items.push({
        xtype: 'fieldcontainer',
        width: '100%',
        flex: 1,
        margin: '30 0 40 0',
        defaultType: 'container',
        fieldLabel: 'The correct answers were',
        labelAlign: 'top',
        layout: 'anchor',
        items: ddistractorList
      });
    }

    me.callParent([Ext.apply({
      items: [{
        xtype: 'form',
        cls: 'DDTASK-form',
        width: '90%',
        height: '100%',
        flex: 2,
        layout: {
          align: 'center',
          type: 'vbox',
          pack: 'start'
        },
        items: items
      }]
    }, cfg)]);
  }
});