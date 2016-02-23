Ext.define('Player.page.questions.review.DDTASK', {
  extend: 'Ext.form.Panel',
  xtype: 'reviewDDTASK',

  config: {
    question: undefined
  },
  distractorType: 'container',

  constructor: function(cfg) {
    var me = this,
      responses = cfg.question.getQuestionRecord().response,
      correctResponses = cfg.question.getQuestionRecord().correctResponse;
    cfg = cfg || {};

    items = cfg.question.getQuestionRecord().question;

    items.push({
      xtype: 'container',
      width: '100%',
      margin: '30 0 0 0',
      layout: {
        type: 'vbox',
        pack: 'start'
      }
    });

    var distractorList = [{
      html: 'Your answers were:',
      cls: 'review-label'
    }];
    Ext.Array.each(correctResponses, function(correctResponse, matchelement) {
      if (typeof correctResponse == "undefined") {
        return;
      }
      distractorList = [{
        html: correctResponse.title.toString(),
        cls: 'review-label'
      }];
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
        xtype: 'container',
        width: '100%',
        margin: '30 0 0 0',
        layout: {
          type: 'vbox',
          pack: 'start'
        },
        items: distractorList
      });
    });

    // add correct response text
    if (!cfg.question.getQuestionRecord().blnCorrect) {
      var ddistractorList = [{
        html: 'The correct answers were:',
        cls: 'review-label'
      }],
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
          xtype: 'container',
          layout: {
            type: 'vbox',
            pack: 'start'
          },
          items: ms
        });
      });

      items.push({
        xtype: 'container',
        width: '100%',
        margin: '30 0 40 0',
        defaultType: 'container',
        layout: {
          type: 'vbox',
          pack: 'start'
        },
        items: ddistractorList
      });
    }

    me.callParent([Ext.apply({
      items: [{
        xtype: 'formpanel',
        cls: 'DDTASK-form',
        scrollable: {
          direction: 'vertical',
          directionLock: true
        },
        width: '100%',
        flex: 1,
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