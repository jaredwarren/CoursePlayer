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
      responses = cfg.question.questionRecord.response,
      correctResponses = cfg.question.questionRecord.correctResponse;
    cfg = cfg || {};

    items = cfg.question.getQuestionRecord().question;

    var distractorList = [];
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
      xtype: 'fieldcontainer',
      width: '100%',
      cls: 'distractorContainer',
      defaultType: 'container',
      fieldLabel: 'Your answers were',
      labelAlign: 'top',
      layout: 'anchor',
      items: distractorList
    });

    // add correct response text
    if (!cfg.question.getQuestionRecord().blnCorrect) {
      var ddistractorList = [];
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
        xtype: 'fieldcontainer',
        width: '100%',
        margin: '20 0 0 0',
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
        width: '90%',
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