Ext.define('Player.page.questions.Intro', {
  extend: 'Player.page.questions.Question',

  xtype: 'intro',

  layout: {
    align: 'center',
    type: 'vbox'
  },


  config: {
    qustionId: 'intro',
    qtype: 'Intro',
    recordId: undefined,
    introText: '',
    introHead: '',
    introIcon: 'resources/images/quizIcon-03.jpg',
    feedback: {
      "initPrompt": {
        "#text": Lang.quiz.intro.initPrompt
      },
      provide: true
    },
    showCheckAnswer: false,
    tracking: false,
    complete: true
  },

  constructor: function(cfg) {
    var me = this,
      introIcon = 'resources/images/quizIcon-03.jpg';
    cfg = cfg || {};

    if (cfg.hasOwnProperty('introIcon')) {
      introIcon = cfg.introIcon;
    }

    me.callParent([Ext.apply({
      items: [{
        xtype: 'image',
        src: introIcon,
        alt: cfg.introHead,
        cls: 'quiz-icon',
        width: 176,
        height: 167
      }, {
        xtype: 'container',
        itemId: 'quiztitle',
        cls: 'quiz-intro-heading',
        html: cfg.introHead,
        styleHtmlContent: true
      }, {
        xtype: 'container',
        itemId: 'quizintro',
        width: '100%',
        cls: 'quiz-intro-text',
        html: cfg.introText,
        styleHtmlContent: true
      }]
    }, cfg)]);
  },
  
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
  }
});