Ext.define('Player.page.questions.Review', {
  extend: 'Player.page.questions.Question',

  xtype: 'Review',

  requires: [
    'Player.layout.Accordion',
    'Player.page.questions.review.ReviewQuestion',
    'Player.page.questions.review.MC',
    'Player.page.questions.review.MCH',
    'Player.page.questions.review.MCAUDIO',
    'Player.page.questions.review.MCHAUDIO',
    'Player.page.questions.review.TF',
    'Player.page.questions.review.MCHIMAGE',
    'Player.page.questions.review.MCIMAGE',
    'Player.page.questions.review.HOIMAGE',
    'Player.page.questions.review.DDTASK',
    'Player.page.questions.review.DDNUM',
    'Player.page.questions.review.ESSAY',
    'Player.page.questions.review.FB'
  ],

  layout: {
    align: 'center',
    type: 'vbox'
  },
  scrollable: {
    direction: 'vertical',
    directionLock: true
  },

  config: {
    questions: undefined,
    showCheckAnswer: false,
    tracking: false,
    complete: true,
    score: undefined
  },

  constructor: function(cfg) {
    var me = this,
      items,
      questionReviews = [],
      scoreObj = cfg.score,
      questions = cfg.questions,
      total = questions.length,
      reviewQuestions = [],
      questionContainer = [];
    cfg = cfg || {};

    // filter out review results and intro
    Ext.Array.each(questions, function(question, index, items) {
      var qtype = question.getQtype();
      if (qtype != 'Review' && qtype != 'Results' && qtype != 'Intro') {
        reviewQuestions.push(question);
      }
    });
    total = reviewQuestions.length,

    Ext.Array.each(reviewQuestions, function(question, index, items) {
      var qtype = question.getQtype();
      // generate title
      var title = Lang.review.Question_of.replace('{1}', (index + 1)).replace('{2}', total).replace('{status}', (question.getQuestionRecord().blnCorrect) ? Lang.quiz.Correct : Lang.quiz.Incorrect);
      title = (question.getQuestionRecord().blnCorrect) ? '&#x2713;' + title : '&#x2717;' + title;
      // add question
      questionContainer.push({
        xtype: 'review' + qtype,
        title: title,
        collapsed: (question.getQuestionRecord().blnCorrect),
        question: question
      });
    });

    me.callParent([Ext.apply({
      items: [{
        xtype: 'panel',
        itemId: 'questionContainer',
        width: '100%',
        title: '<span>' + Lang.review.Test_Results + '</span> - ' + '<span>' + Lang.review.Review_Score.replace("{score}", scoreObj.intScore) + '</span> - <span>' + Lang.review.Correct_of.replace("{1}", scoreObj.correct).replace("{2}", scoreObj.questionsToAsk) + '</span>',
        defaults: {
          // applied to each contained panel
          bodyStyle: 'padding:15px'
        },
        layout: {
          type: 'accordion',
          mode: 'SINGLE'
        },
        items: questionContainer
      }, {
        xtype: 'panel',
        layout: {
          type: 'hbox',
          align: 'center',
          pack: 'center'
        },
        items: [{
          xtype: 'button',
          text: Lang.review.Retake_Test,
          itemId: 'retakeBtn',
          autoEvent: 'retake',
          ui: 'action',
          listeners: {
            tap: {
              fn: me.onRetake,
              scope: me
            }
          }
        }]
      }]
    }, cfg)]);
  },
  /*updateQuestions: function(questions) {
    var me = this,
      questionReviews = [],
      total = questions.length,
      reviewQuestions = [],
      questionContainer = me.queryById('questionContainer');

    // filter out review results and intro
    Ext.Array.each(questions, function(question, index, items) {
      var qtype = question.getQtype();
      if (qtype != 'Review' && qtype != 'Results' && qtype != 'Intro') {
        reviewQuestions.push(question);
      }
    });
    total = reviewQuestions.length,

    questionContainer.removeAll();
    Ext.Array.each(reviewQuestions, function(question, index, items) {
      var qtype = question.getQtype();
      // generate title
      var title = Lang.review.Question_of.replace('{1}', (index + 1)).replace('{2}', total).replace('{status}', (question.getQuestionRecord().blnCorrect) ? Lang.quiz.Correct : Lang.quiz.Incorrect);
      title = (question.getQuestionRecord().blnCorrect) ? '&#x2713;' + title : '&#x2717;' + title;
      // add question
      questionContainer.add({
        xtype: 'review' + qtype,
        title: title,
        collapsed: (question.getQuestionRecord().blnCorrect),
        question: question
      });
    });
  },
  updateScore: function(scoreObj){
    var me = this;
    me.queryById('questionContainer').setTitle('<span>' + Lang.review.Test_Results + '</span> - ' + '<span>' + Lang.review.Review_Score.replace("{score}", scoreObj.intScore) + '</span> - <span>' + Lang.review.Correct_of.replace("{1}", scoreObj.correct).replace("{2}", scoreObj.questionsToAsk) + '</span>');
  },*/
  onCheckAnswer: function() {
    var me = this,
      questionRecord = me.getQuestionRecord();

    // calculate latency
    var d = new Date();
    questionRecord.intLatency = (d.getTime() - me.startTime);

    me.disableQuestion();

    me.fireEvent('queston-complete', me, questionRecord);
  },
  close: function() {
    this.callParent(arguments);
  },
  start: function() {
    this.callParent(arguments);
  },
  onRetake: function() {
    this.fireEvent('retake');
  }
});