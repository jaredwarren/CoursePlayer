Ext.define('Player.page.questions.BaseQuestion', {
  extend: 'Ext.form.Panel',

  requires: [
    'Player.page.components.TextImage',
    'Player.page.questions.FeedBackPopup',
    'Player.page.questions.Instructions'
  ],

  cls: 'question',

  layout: {
    align: 'center',
    type: 'vbox'
  },
  scrollable: {
    direction: 'vertical',
    directionLock: true
  },

  config: {
    quizTitle: undefined,
    recordId: undefined,
    narration: false,
    nonNavPage: true,
    isTocEntry: false,
    pageNum: 0,
    bookmark: '',

    qustionId: undefined,
    qtype: undefined,

    questionText: undefined,
    feedback: undefined,

    resetBtn: false,
    tracking: true,
    overrideFeedback: false,
    tries: 1,
    provideFeedback: true,

    showCheckAnswer: true,

    triesAttempted: 0,

    tracking: true,
    complete: false,

    questionRecord: {
      strID: '',
      strDescription: '',
      strLearningObjectiveID: '',
      blnCorrect: false,
      correctResponse: [],
      response: [],
      intWeighting: 1,
      intLatency: 0
    }
  },

  constructor: function(cfg) {
    var me = this,
      items = cfg.items || [];
    cfg = cfg || {};

    // default quesiton record
    me.config.questionRecord.strID = cfg.strID;
    cfg.questionRecord = Ext.Object.merge({}, me.config.questionRecord, cfg.questionRecord);

    //unshift audio bar
    cfg.questionRecord.question = [];
    if (cfg.hasOwnProperty('questionText')) {
      if (cfg.questionText.hasOwnProperty('filePath')) {
        var audiobar = {
          xtype: 'audiobar',
          itemId: 'audio',
          //region: 'south',
          width: '90%',
          mediaPath: cfg.questionText.filePath,
          autoPlayMedia: cfg.questionText.autoPlayMedia
        };
        items.unshift(audiobar);
        cfg.questionRecord.question.unshift(audiobar);
      }

      // add question text
      var questionText = me.filterQuestionText(cfg.questionText);
      if (questionText) {
        var questionObj = {
          xtype: 'textimage',
          cls: 'questiontext',
          itemId: 'questionText',
          region: 'center',
          width: '90%',
          pText: questionText,
          imageFile: cfg.imageFile,
          iconType: cfg.iconType || 'zoom',
          imgPos: cfg.imgPos,
          captionhead: cfg.captionhead,
          captiontext: cfg.captiontext,
          imageWidth: cfg.imageWidth
        };

        items.unshift(questionObj);
        cfg.questionRecord.question.unshift(questionObj);

        // string description
        if (!cfg.questionRecord.strDescription) {
          cfg.questionRecord.strDescription = questionText.replace(/(<([^>]+)>)/ig, "");
        }
      }
    }

    // default feedback
    if (cfg.overrideFeedback) {
      cfg.feedback = Ext.Object.merge({}, cfg.defaultFeedback, me.config.feedback, cfg.feedback);
    } else {
      cfg.feedback = Ext.Object.merge({}, cfg.defaultFeedback, me.config.feedback);
    }

    // action items
    var actionItems = [];
    // reset button
    if (cfg.resetBtn) {
      actionItems.push({
        xtype: 'button',
        itemId: 'resetBtn',
        autoEvent: 'reset',
        text: Lang.quiz.Reset,
        margin: '10 10 10 10',
        iconCls: 'pictos pictos-refresh',
        ui: 'resetBtn',
        disabled: true,
        listeners: {
          click: me.onResetAnswers,
          tap: me.onResetAnswers,
          scope: me
        }
      });
    }

    // check answer
    if (me.config.showCheckAnswer) {
      actionItems.push({
        xtype: 'button',
        itemId: 'checkAnswerBtn',
        iconCls: 'pictos pictos-check2',
        ui: 'checkAnswerBtn',
        text: Lang.quiz.Check_Answer,
        margin: '10 10 10 10',
        disabled: true,
        listeners: {
          click: me.onCheckAnswer,
          tap: me.onCheckAnswer,
          scope: me
        }
      });
    }

    if (actionItems.length > 0) {
      items.push({
        xtype: 'container',
        layout: {
          align: 'center',
          type: 'hbox',
          pack: 'end'
        },
        docked: 'bottom',
        items: actionItems
      });
    }

    delete cfg.items;

    me.callParent([Ext.apply({
      items: [{
        xtype: 'container',
        cls: 'question-container',
        width: '90%',
        scrollable: false,
        flex: cfg.flexParent || null,
        layout: {
          align: 'center',
          type: 'vbox',
          pack: 'start'
        },
        items: items
      }]
    }, cfg)]);
  },


  /*Event Handlers*/
  onSelect: function(checkbox, newValue, oldValue, eOpts) {
    var me = this;
    if (me.firstSelect && me.getProvideFeedback()) {
      me.showInstructions('evalPrompt', true);
      me.firstSelect = false;
    }
    if (me.getShowCheckAnswer()) {
      me.queryById('checkAnswerBtn').enable();
    }
    if (me.getResetBtn()) {
      me.queryById('resetBtn').enable();
    }
  },

  onResetAnswers: function() {
    var me = this;
    me.clearOptions();
    if (me.getShowCheckAnswer()) {
      me.queryById('checkAnswerBtn').disable();
      me.queryById('checkAnswerBtn').setText(Lang.quiz.Check_Answer);
    }
    if (me.getResetBtn()) {
      me.queryById('resetBtn').disable();
    }
  },

  onCheckAnswer: function(showFeedback) {
    var me = this,
      triesAttempted = me.triesAttempted,
      questionRecord = me.getQuestionRecord();

    // don't reevaluate if tries left, otherwise will always be wrong
    if (!showFeedback && me.getComplete()) {
      return;
    }

    if (triesAttempted >= me.getTries()) {
      if (showFeedback) {
        if (questionRecord.blnCorrect) {
          me.showFeedbackPopup(Lang.quiz.Correct, 'correctFeedback');
        } else {
          me.showFeedbackPopup(Lang.quiz.Incorrect, 'incorrectFeedback');
        }
      }
      me.disableQuestion();
      return;
    }

    me.triesAttempted = ++triesAttempted;

    // evalutate guess
    if (me.evalutateGuess()) {
      // Correct
      if (showFeedback) {
        me.showFeedbackPopup(Lang.quiz.Correct, 'correctFeedback');
      }
      questionRecord.blnCorrect = true;
      me.disableQuestion();
    } else {
      if (showFeedback) {
        if (triesAttempted >= me.getTries()) {
          me.showFeedbackPopup(Lang.quiz.Incorrect, 'incorrectFeedback');
        } else {
          me.showFeedbackPopup(Lang.quiz.Try_Again, 'triesFeedback');
        }
      }
      questionRecord.blnCorrect = false;
    }

    // calculate latency
    var d = new Date();
    questionRecord.intLatency = (d.getTime() - me.startTime);

    if (triesAttempted >= me.getTries()) {
      me.disableQuestion();
    }
    me.setComplete(true);

    me.fireEvent('queston-complete', me, questionRecord);
  },

  /*Cleanup*/
  clearOptions: function() {
    this.firstSelect = true;
  },

  disableQuestion: function() {
    var me = this;
    if (me.getShowCheckAnswer()) {
      me.queryById('checkAnswerBtn').setText("View Feedback");
    }
    if (me.getResetBtn()) {
      me.queryById('resetBtn').disable();
    }
  },

  /*Guess/Answer*/
  evalutateGuess: function(guess, answer) {
    var me = this;
    if (!guess) {
      guess = me.getGuessAnswer();
    }
    if (!answer) {
      answer = me.getCorrectAnswer();
    }
    return (guess == answer);
  },

  /*
  Instructions
  */
  _toasts: [],
  hideInstructions: function() {
    Ext.Array.each(this._toasts, function(toast, index, toasts) {
      toast.animate = false;
      toast.hide();
      //toast.destory();
    });
    this._toasts = [];
  },
  getFeedbackText: function(feedbackType, showCheckAnswer) {
    var me = this,
      feedback = me.getFeedback(),
      instructionText = '';
    if (feedback.hasOwnProperty(feedbackType)) {
      instructionText = feedback[feedbackType];
    } else {
      instructionText = feedbackType;
    }
    if (instructionText && instructionText.hasOwnProperty('#text')) {
      instructionText = instructionText['#text'];
    }
    return instructionText;
  },
  showInstructions: function(feedbackType, showCheckAnswer) {
    var me = this,
      instructionText = me.getFeedbackText(feedbackType, showCheckAnswer);

    me.makeToast({
      message: instructionText,
      timeout: 2000,
      closable: true,
      align: 'br'
    });
  },

  /*
  FeedBackPopup
  */
  _feedbacks: [],
  showFeedbackPopup: function(title, feedbackType) {
    var me = this,
      feedback = me.getFeedback(),
      feedbackText = '';
    if (feedback.hasOwnProperty(feedbackType)) {
      feedbackText = feedback[feedbackType];
    } else {
      feedbackText = feedbackType;
    }
    if (feedbackText && feedbackText.hasOwnProperty('#text')) {
      feedbackText = feedbackText['#text'];
    }
    var f = Ext.Msg.alert(title, feedbackText);
    me._feedbacks.push(f);
  },
  hideFeedbackPopup: function() {
    Ext.Array.each(this._feedbacks, function(feedback, index, toasts) {
      feedback.animate = false;
      feedback.hide();
      //feedback.destory();
    });
    this._feedbacks = [];
  },

  /*
  Page Navigation
  */
  start: function() {
    var me = this;

    var initPrompt = me.getFeedback().initPrompt;
    if (initPrompt) {
      me.makeToast({
        message: me.getFeedback().initPrompt['#text'],
        timeout: 2000,
        title: me.getFeedback().initPrompt.title || '',
        closable: true,
        align: 'br'
      });
    }

    me.onResetAnswers();

    me.triesAttempted = 0;

    // start time
    var d = new Date();
    me.startTime = d.getTime();
  },

  close: function() {
    var me = this;
    me.onCheckAnswer(false);
    me.hideInstructions();
    me.hideFeedbackPopup();
  },
  filterQuestionText: function(questionText) {
    if (questionText) {
      if (questionText.hasOwnProperty('#text')) {
        return questionText['#text'];
      } else {
        return questionText;
      }
    }
    return '';
  }
})