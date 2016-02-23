Ext.define('Player.page.VideoQuiz', {
  extend: 'Player.page.Page',
  xtype: 'VideoQuiz',

  requires: [
    'Player.page.components.VideoPlayer',
    'Player.page.components.TextImage'
  ],
  layout: {
    type: 'vbox'
    //align: 'stretch',
    //pack: 'start'
  },
  styleHtmlContent: true,
  cls: 'page-content',
  /*scrollable: {
    direction: 'vertical',
    directionLock: true
  },*/

  config: {
    questions: undefined,
    video: undefined,
    quizConfig: undefined,
    config: undefined
  },

  constructor: function(cfg) {
    var me = this,
      items = cfg.items || [];
    cfg = cfg || {};

    items.push(Ext.Object.merge({
      xtype: 'videoplayer',
      itemId: 'videoPlayer',
      src: cfg.src,
      autoPlay: cfg.autoPlayMedia,
      listeners: {
        complete: me.onVideoComplete,
        timeupdate: me.onTimeUpdate,
        scope: me
      }
    }, cfg.video));

    if (cfg.hasOwnProperty('pText')) {
      items.push({
        xtype: 'textimage',
        pText: cfg.pText
      });
    }

    items.push({
      xtype: 'panel',
      itemId: 'questionContainer',
      titleAlign: 'center',
      centered: true,
      modal: false,
      //hidden: false,
      closable: false,
      draggable: false,
      resizable: false,
      layout: 'card',
      activeItem: 0,
      items: [{
        xtype: 'field',
        items: [{
          xtype: 'container',
          html: 'Question Text Goes here...'
        }, {
          xtype: 'checkboxfield',
          label: 'Box Label'
        }, {
          xtype: 'container',
          width: 200,
          layout: {
            type: 'hbox',
            pack: 'end'
          },
          items: [{
            xtype: 'button',
            text: 'Submit'
          }]
        }]
      }]
    });

    me.callParent([Ext.apply({
      items: items
    }, cfg)]);
  },

  initialize: function() {
    var me = this;
    me.callParent(arguments);
    me._player = me.queryById('videoPlayer');
  },

  afterComponentLayout: function() {
    var me = this,
      videoBounds = me.queryById('videoPlayer').getVideoEl().getBoundingClientRect(),
      questionContainer = me.queryById('questionContainer');

    questionContainer.setWidth(videoBounds.width);
    questionContainer.setHeight(videoBounds.height);

    if (questionContainer.rendered) {
      questionContainer.el.setX(videoBounds.left);
      questionContainer.el.setY(videoBounds.top);
    }
  },

  /*
  Questions
  */
  resetQuestions: function() {
    var me = this;
    Ext.Array.each(me.questions, function(question, index) {
      question.answered = false;
    });
    me._allQuestionsAnswered = false;
    me._videoComplete = false;
    me._maxScore = 0;
  },

  _previousPosition: -0.1,
  onTimeUpdate: function(event) {
    var me = this,
      newPosition = event.target.currentTime,
      questions = me.getQuestions(),
      question, i,
      questionsToAsk = [];

    for (i = 0; i < questions.length; i++) {
      question = questions[i];
      if (question.time <= newPosition && question.time > me._previousPosition && !question.answered) {
        questionsToAsk.push(question);
      }
    };
    if (questionsToAsk.length > 0) {
      if (me.getQuizConfig().randomize) {
        me.displayQuestions(me.randomizeArray(questionsToAsk));
      } else {
        me.displayQuestions(questionsToAsk);
      }
    }
    me._previousPosition = newPosition;
  },

  // QUESTIONS
  _currentQuestions: undefined,
  displayQuestions: function(questionsToAsk) {
    var me = this;
    // cache state, so at end of video we don't replay
    me._previousState = me._player.getState();
    // display questions
    me._currentQuestions = questionsToAsk;
    me.nextQuestion();
  },

  // Display next question or continue palying
  _currentQuestion: undefined,
  _playDisabled: undefined,
  nextQuestion: function() {
    var me = this;
    if (me._currentQuestions.length > 0) {
      me.displayQuestion(me._currentQuestions.shift());
    } else {
      me.queryById('questionContainer').hide();
      if (me._currentQuestion.qType != "popup") {
        me._playDisabled = false;
        me._player.showControls();
      }
      switch (me._previousState) {
        case "paused":
          me._player.pause();
          break;
        default:
          // TODO: allow to step back a second or so...
          if (me._player.getState() != "playing") {
            me._player.play();
          }
          break;
      }
    }
  },

  // Question
  displayQuestion: function(questionJson) {
    var me = this,
      questionContainer = me.queryById('questionContainer'),
      questionCards = [],
      questionCard = {
        xtype: 'formpanel',
        layout: {
          type: 'vbox',
          align: 'center',
          pack: 'center'
        },
        items: []
      };
    me._currentQuestion = questionJson;

    questionContainer.removeAll();

    if (questionJson.qType != 'popup') {
      // Force Pause
      me._player.pause();
      me._playDisabled = true;
      // Hide Controls
      me._player.hideControls();
    }

    // Question Text
    if (questionJson.questionText && questionJson.questionText.text) {
      questionCard.items.push({
        xtype: 'container',
        html: questionJson.questionText.text
      });
    }

    // Distractors
    var distractorXtype,
      useLetter = true;
    switch (questionJson.qType) {
      case 'multipleCorrect':
      case 'MC':
        distractorXtype = 'checkboxfield';
        break;
      case 'multipleChoice':
      case 'MCH':
      case 'trueFalse':
      case 'TF':
        useLetter = false;
        distractorXtype = 'radiofield';
        break;
      case 'fillIn':
      case 'FB':
        distractorXtype = 'textfield';
        break;
    }
    if (questionJson.distractors) {
      var distractors = questionJson.distractors;
      if (questionJson.randomizeDistractors) {
        distractors = me.randomizeArray(distractors);
      }
      Ext.Array.each(distractors, function(distractor, index) {
        var letter = String.fromCharCode(65 + index),
          name = 'distractor';
        if (useLetter) {
          name = 'distractor_' + letter;
        }
        questionCard.items.push({
          xtype: distractorXtype,
          name: name,
          value: letter,
          correct: distractor.correct,
          label: distractor.text,
          labelWidth: '70%',
          labelAlign: 'right'
        });
      });
    }

    if (questionJson.response && questionJson.response.correct) {
      questionCards.push({
        xtype: 'container',
        layout: {
          type: 'vbox',
          align: 'center',
          pack: 'center'
        },
        items: [{
          xtype: 'container',
          html: questionJson.response.correct.text
        }, {
          xtype: 'container',
          width: 200,
          layout: {
            type: 'hbox',
            pack: 'end'
          },
          items: [{
            xtype: 'button',
            itemId: 'continueButton',
            text: questionJson.continueButton.text,
            listeners: {
              tap: me.onContinue,
              scope: me
            }
          }]
        }]
      });
    }

    var incorrectCard = {};
    if (questionJson.response && questionJson.response.incorrect) {
      questionCards.push({
        xtype: 'container',
        layout: {
          type: 'vbox',
          align: 'center',
          pack: 'center'
        },
        items: [{
          xtype: 'container',
          html: questionJson.response.incorrect.text
        }, {
          xtype: 'container',
          width: 200,
          layout: {
            type: 'hbox',
            pack: 'end'
          },
          items: [{
            xtype: 'button',
            itemId: 'continueButton',
            text: questionJson.continueButton.text,
            listeners: {
              tap: me.onContinue,
              scope: me
            }
          }]
        }]
      });
    }

    var actionItems = [];
    if (questionJson.qType != 'popup') {
      if (questionJson.submitButton) {
        actionItems.push({
          xtype: 'button',
          itemId: 'submitButton',
          text: questionJson.submitButton.text,
          listeners: {
            tap: me.onSubmit,
            scope: me
          }
        });
      }
    } else {
      if (questionJson.continueButton) {
        actionItems.push({
          xtype: 'button',
          itemId: 'submitButton',
          text: questionJson.continueButton.text,
          listeners: {
            tap: me.onSubmit,
            scope: me
          }
        });
      }
    }

    if (actionItems.length > 0) {
      questionCard.items.push({
        xtype: 'container',
        width: 200,
        layout: {
          type: 'hbox',
          pack: 'end'
        },
        items: actionItems
      });
    }

    // Timer
    var timeLimit = parseInt(questionJson.timeLimit, 10);
    if (!isNaN(timeLimit) && timeLimit > 0) {
      // don't show timer for popup
      if (questionJson.qtype != "popup") {
        /*questionContainer.setTitle(me.toHHMMSS(timeLimit));
        me.timerStart(timeLimit, function() {
          questionContainer.setTitle(me.toHHMMSS(--me._currenttime));
        });*/
      } else {
        me.timerStart(timeLimit, function() {
          me._currenttime--;
        });
      }
    }

    questionCards.unshift(questionCard);
    questionContainer.add(questionCards);


    me.afterComponentLayout();
    questionContainer.setActiveItem(0);
    questionContainer.show();

    // Start latency timer
    me._latencyTimer = Date.now();
  },

  // TIMER
  _timer: undefined,
  _currenttime: undefined,
  timerStart: function(time, tick) {
    var me = this;
    clearInterval(me._timer);
    me._currenttime = parseInt(time, 10);
    // Start Timer
    me._timer = setInterval(function() {
      if (me._currenttime <= 0) {
        me.onSubmit();
        return;
      }
      tick();
    }, 1000);
  },


  _allQuestionsAnswered: false,
  _videoComplete: false,
  _maxScore: 0,

  onSubmit: function(event) {
    var me = this,
      questionContainer = me.queryById('questionContainer');

    // stop timers
    me._currentQuestion.intLatency = Date.now() - me._latencyTimer;
    clearInterval(me._timer);

    // just hide popup
    if (me._currentQuestion.qType == 'popup') {
      questionContainer.hide();
      return;
    }

    // Distractors
    var form = questionContainer.query('formpanel')[0],
      values = form.getValues(),
      distractorXtype;

    switch (me._currentQuestion.qType) {
      case 'multipleCorrect':
      case 'MC':
        distractorXtype = 'checkboxfield';
        break;
      case 'multipleChoice':
      case 'MCH':
      case 'trueFalse':
      case 'TF':
        useLetter = false;
        distractorXtype = 'radiofield';
        break;
      case 'fillIn':
      case 'FB':
        distractorXtype = 'textfield';
        break;
    }
    var distractors = questionContainer.query('radiofield'),
      correctAnswers = [];


    // get Guess
    var guess = [];
    Ext.Object.each(values, function(key, value, myself) {
      var distractor = me.query('[value="' + value + '"]')[0];
      guess.push({
        letter: value,
        responseText: distractor.getLabel(),
        name: key
      });
    });

    // get answer
    var answer = [];
    Ext.Array.each(distractors, function(distractor, index) {
      if (distractor.correct) {
        answer.push({
          letter: distractor.getValue()
        });
      }
    });

    // evaluate guess
    var isCorrect = false,
      guessString = '',
      answerString = '';
    guess = Ext.Array.sort(guess, function(a, b) {
      if (a.letter < b.letter) return -1;
      else if (a.letter > b.letter) return 1;
      else return 0;
    });
    Ext.Array.each(guess, function(distractor, index) {
      guessString += distractor.letter;
    });

    answer = Ext.Array.sort(answer, function(a, b) {
      if (a.letter < b.letter) return -1;
      else if (a.letter > b.letter) return 1;
      else return 0;
    });
    Ext.Array.each(answer, function(distractor, index) {
      answerString += distractor.letter;
    });

    isCorrect = (guessString != '' && answerString == guessString);

    me._currentQuestions.response = values;
    me._currentQuestions.answered = true;

    // SCORM
    me.recordInteraction(me._currentQuestion, guess, isCorrect);

    var score = 0;
    if (isCorrect) {
      score += me._currentQuestions.intWeighting || 1;
    }
    me._maxScore += me._currentQuestions.intWeighting || 1;
    // Quiz Score
    var allAnswered = true;
    Ext.Array.each(me.getQuestions(), function(question, index, items) {
      if (me._currentQuestion.questionId == question.questionId) {
        question.answered = true;
      }
      if (!question.answered) {
        allAnswered = false;
        return false;
      }
    });

    me._allQuestionsAnswered = allAnswered;
    if (allAnswered) {
      console.log("Score:", score, me._maxScore, me.getQuizConfig().passingScore);
      if ((score / me._maxScore) * 100 < me.getQuizConfig().passingScore) {
        SCORM.SetFailed();
      } else {
        SCORM.SetPassed();
      }
    }
    // All Done
    if (me._videoComplete && me._allQuestionsAnswered) {
      me.fireEvent('page-complete', me);
      SCORM.ConcedeControl();
    }

    // show response or next
    if (me._currentQuestions.response) {
      if (isCorrect) {
        questionContainer.setActiveItem(1);
      } else {
        questionContainer.setActiveItem(2);
      }
    } else {
      questionContainer.hide();
      me.nextQuestion();
    }
  },

  recordInteraction: function(question, guess, correct) {
    if (question.submitResponse) {
      switch (question.qType) {
        case 'multipleChoice':
        case 'MCH':
        case 'trueFalse':
        case 'TF':
        case 'multipleCorrect':
        case 'MC':
          guess = guess[0];
          var scormResponses = [],
            scormCorrectResponses = [],
            tempResponse;
          scormResponses.push(SCORM.CreateResponseIdentifier(guess.letter, responseString));
          scormCorrectResponses.push(SCORM.CreateResponseIdentifier('', question.answer));
          SCORM.RecordMultipleChoiceInteraction(question.questionId, scormResponses, correct, scormCorrectResponses, question.questionText.text.replace(/(<([^>]+)>)/ig, ""), question.intWeighting, question.intLatency, question.strLearningObjectiveID);
          break;
        case 'trueFalse':
          SCORM.RecordTrueFalseInteraction(questionRecord.strID, questionRecord.response, questionRecord.blnCorrect, questionRecord.correctResponse, questionRecord.strDescription.replace(/(<([^>]+)>)/ig, ""), questionRecord.intWeighting, questionRecord.intLatency, questionRecord.strLearningObjectiveID);
          SCORM.RecordTrueFalseInteraction(question.questionId, responseString, correct, question.answer, question.questionText.text.replace(/(<([^>]+)>)/ig, ""), question.intWeighting, question.intLatency, question.strLearningObjectiveID);
          break;
        case 'fillIn':
        case 'FB':
          SCORM.RecordFillInInteraction(question.questionId, responseString, correct, question.answer, question.questionText.text.replace(/(<([^>]+)>)/ig, ""), question.intWeighting, question.intLatency, question.strLearningObjectiveID);
          break;
        default:
          console.warn("Invalid qtype:", question.qtype);
          break;
      }
    }
  },

  onContinue: function() {
    this.nextQuestion();
  },


  // Video End, ask questions one last time
  onVideoComplete: function(event) {
    var me = this,
      newPosition = this._player.getVideoEl().currentTime,
      question, i,
      questionsToAsk = [];

    me._videoComplete = true;
    // ask remaining questions
    for (i = 0; i < me.questions.length; i++) {
      question = me.questions[i];
      if (question.time >= newPosition) {
        questionsToAsk.push(question);
      }
    };
    if (questionsToAsk.length > 0) {
      if (me.getQuizConfig().randomize) {
        me.displayQuestions(me.randomizeArray(questionsToAsk));
      } else {
        me.displayQuestions(questionsToAsk);
      }
    } else {
      SCORM.SetReachedEnd();
      if (me._videoComplete && me._allQuestionsAnswered) {
        me.fireEvent('page-complete', me);
        SCORM.ConcedeControl();
      }
    }
  },

  toHHMMSS: function(seconds) {
    var sec_num = parseInt(seconds, 10);
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    // 0 pad string
    var time = '';
    // Hours: only show if greater than 0
    if (hours < 10 && hours > 0) {
      time += "0" + hours + ":";
    } else if (hours <= 0) {
      time += '';
    } else {
      time += hours + ":";
    }
    // Minutes: always show, event if 0
    if (minutes < 10) {
      time += "0" + minutes + ":";
    } else {
      time += minutes + ":";
    }
    // Seconds: alwasys show, even if 0
    if (seconds < 10) {
      time += "0" + seconds;
    } else {
      time += seconds;
    }
    return time;
  },

  /*
  Page Stuff
  */
  hideVideo: function(e) {
    this.queryById('videoPlayer').hideVideo();
  },
  showVideo: function(e) {
    this.queryById('videoPlayer').showVideo();
  },
  start: function() {
    var me = this;
    me.queryById('videoPlayer').start();
    me.resetQuestions();
  },
  close: function() {
    this.hideVideo();
  },
  // For some stupid reason this stupid hack doesn't work with this page
  hideScroller: function() {
    // DO NOTHING
  }
});