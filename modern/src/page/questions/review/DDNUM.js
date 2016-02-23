Ext.define('Player.page.questions.review.DDNUM', {
  extend: 'Ext.form.Panel',
  xtype: 'reviewDDNUM',

  config: {
    question: undefined
  },
  distractorType: 'container',

  constructor: function(cfg) {
    var me = this,
      items = [],
      responses = cfg.question.getQuestionRecord().response,
      correctResponses = cfg.question.getQuestionRecord().correctResponse;
    cfg = cfg || {};

    items = cfg.question.getQuestionRecord().question;

    var distractorList = [{
      html: 'Your answers were:',
      cls: 'review-label'
    }];
    var reviewHTML = '<u>Your answers were:</u>';
    Ext.Array.each(correctResponses, function(correctResponse, correctResponseIndex) {
      if (typeof correctResponse == "undefined") {
        return;
      }
      var responseHtml = '';
      var response;
      Ext.Array.each(responses, function(r, responseIndex) {
        if (r.correctMatch == correctResponse.matchelement) {
          response = r;
          return false;
        }
      });
      if (response) {
        if (response.correct) {
          responseHtml = '<span style="width:16px; color: green;"> &#x2713; </span><span>' + response.Short + " : " + correctResponse.title + '</span>';
        } else {
          responseHtml = '<span style="width:16px; color: red;"> &#x2717; </span><span>' + response.Short + " : " + correctResponse.title + '</span>';
        }
      } else {
        responseHtml = '<span style="width:16px; color: red;"> &#x2717; </span><span> - : ' + correctResponse.title + '</span>';
      }

      reviewHTML += '<div>' + responseHtml + '</div>';
      distractorList.push({
        xtype: me.distractorType,
        html: responseHtml,
        styleHtmlContent: true,
        correct: (response && response.correct)
      });
    });

    items.push({
      xtype: 'container',
      width: '100%',
      margin: '30 0 0 0',
      cls: 'distractorContainer',
      layout: {
        type: 'vbox',
        pack: 'start'
      },
      items: distractorList
    });

    // add correct response text
    if (!cfg.question.getQuestionRecord().blnCorrect) {
      var ddistractorList = [{
        html: 'The correct answers were:',
        cls: 'review-label'
      }];
      reviewHTML += '<br/><br/><u>The correct answers were:</u>';
      Ext.Array.each(correctResponses, function(correctResponse, correctResponseIndex) {
        if (typeof correctResponse == "undefined") {
          return;
        }

        reviewHTML += '<div>' + correctResponse.matchelement + " : " + correctResponse.title + '</div>';
        ddistractorList.push({
          html: correctResponse.matchelement + " : " + correctResponse.title
        });
      });

      items.push({
        xtype: 'container',
        width: '100%',
        margin: '30 0 40 0',
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
        scrollable: {
          direction: 'vertical',
          directionLock: true
        },
        width: '100%',
        flex: 1,
        layout: {
          type: 'vbox',
          pack: 'start'
        },
        items: items
      }]
    }, cfg)]);
  }
});