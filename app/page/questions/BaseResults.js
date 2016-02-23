Ext.define('Player.page.questions.BaseResults', {
  extend: 'Player.page.questions.Question',


  requires: [
    'Player.page.questions.EmailPopupMixin',
    'Player.page.questions.PrintMixin'
  ],

  layout: {
    align: 'center',
    type: 'vbox'
  },
  scrollable: {
    direction: 'vertical',
    directionLock: true
  },
  feedback: {
    provide: true,
    "fail": {
      "title": Lang.results.Sorry,
      "#text": Lang.results.You_did_not_pass
    },
    "success": {
      "title": Lang.results.Pass,
      "#text": Lang.results.Congrats_Pass
    }
  },
  config: {
    qustionId: 'results',
    qtype: 'Results',
    recordId: undefined,
    narration: undefined,
    nonNavPage: true,
    isTocEntry: false,
    feedback: {
      provide: false
    },
    showCheckAnswer: false,

    results: undefined,
    email_results: false,
    print_results: false,
    incReview: false,

    // email/print
    useServer: true,
    LMS_name: false,
    incQuizTitle: false,
    emailSubject: Lang.results.Email_Subject,
    sendToEmail: "sendToEmail@asdf.com",
    serverURL: 'https://demo.litmosauthor.com/email/sendEmail.php',
    printMessage: undefined,

    tracking: false,
    complete: true
  },

  constructor: function(cfg) {
    var me = this,
      items = cfg.items || [];
    cfg = cfg || {};

    items = [{
      styleHtmlContent: true,
      html: '<img src="resources/images/QuizResultsIcon-02.png" width="100" height="100" /> <div class="quizresulttitle">' + Lang.results.Quiz_Results + '<div>'
    }, {
      itemId: 'quizResults',
      styleHtmlContent: true,
      tpl: ['<table width="200" border="0" cellpadding="12"><tr>', '<td align="right" class="results-title">' + Lang.results.Total_Correct + '</td>', '<td>{correct}</td>', '</tr><tr>', '<td align="right" class="results-title">' + Lang.results.Total_Incorrect + '</td>', '<td>{incorrect}</td>', '</tr><tr>', '<td align="right" class="results-title">' + Lang.results.Score + '</td>', '<td>{points}</td>', '</tr><tr>', '<td align="right" class="results-title">' + Lang.results.Possible_Score + '</td>', '<td>{pointsPossible}</td>', '</tr><tr>', '<td align="right" class="results-title">' + Lang.results.Percentage + '</td>', '<td>{intScore}%</td>', '</tr>', '</table>']
    }, {
      itemId: 'quizfeedback',
      styleHtmlContent: true,
      html: ''
    }];

    // add Review
    if (cfg.incReview) {
      items.push({
        xtype: 'button',
        itemId: 'reviewBtn',
        autoEvent: 'review',
        ui: 'action',
        margin: '10 10 10 10',
        text: Lang.results.Review,
        listeners: {
          click: me.onReview,
          tap: me.onReview,
          scope: me
        }
      });
    }

    // Add Email
    if (cfg.email_results) {
      // load EmailPopupMixin mixin
      me.self.mixin('EmailPopupMixin', Player.page.questions.EmailPopupMixin);



      // add email button
      items.push({
        xtype: 'button',
        itemId: 'emailBtn',
        autoEvent: 'email',
        ui: 'action',
        margin: '10 10 10 10',
        text: Lang.results.Email_Results,
        listeners: {
          click: me.onShowEmailForm,
          tap: me.onShowEmailForm,
          scope: me
        }
      });
    }

    // Add Print
    if (cfg.print_results) {
      // load PrintMixin mixin
      me.self.mixin('PrintMixin', Player.page.questions.PrintMixin);

      items.push({
        itemId: 'printMessage',
        styleHtmlContent: true,
        html: cfg.printMessage['#text']
      }, {
        xtype: 'button',
        itemId: 'printBtn',
        autoEvent: 'print',
        ui: 'action',
        margin: '10 10 10 10',
        text: Lang.results.Print_Results,
        listeners: {
          click: me.onPrint,
          tap: me.onPrint,
          scope: me
        }
      });
    }

    me.callParent([Ext.apply({
      items: items
    }, cfg)]);
  },

  updateResults: function(config) {
    if (this.rendered) {
      this.queryById('quizResults').setData(config);
    }
  },

  onReview: function() {
    this.fireEvent('review', this);
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