/*
Handles all of the quiz logic
*/
Ext.define('Player.page.QuizMixin', {
  extend: 'Ext.Base',

  config: {
    maxscore: 100,
    minscore: 0,
    passingScore: 0,
    quizmode: "test",
    recordStatus: "none",
    reportScore: true,
    showresults: true,
    incReview: true,
    includeIntro: true,
    randomize: true
  },

  recordedScore: false,
  completed: false,

  defaultFeedback: {
    provide: true,
    "initPrompt": {
      "#text": Lang.quiz.Select_an_Option
    },
    "evalPrompt": {
      "#text": Lang.quiz.Tap_CheckAnswer_Button
    },
    "correctFeedback": {
      "#text": Lang.quiz.Yes_that_is_correct
    },
    "incorrectFeedback": {
      "#text": Lang.quiz.No_that_is_incorrect
    },
    "triesFeedback": {
      "#text": Lang.quiz.Incorrect_Try_Again
    }
  },

  quizRecord: {
    correct: 0,
    incorrect: 0,
    questionsToAsk: 0,
    points: 0,
    pointsPossible: 0,
    intScore: 0,
    passed: false
  },

  refreshQuestionList: function(cfg) {
    var me = this,
      questionList = [];

    // force to array
    if (cfg.hasOwnProperty('question')) {
      if (Object.prototype.toString.call(cfg.question) != '[object Array]') {
        questionList = [cfg.question];
      } else {
        // make sure it's cloned
        questionList = cfg.question.slice(0);
      }
    }

    // apply defaults to questions
    // filter out non-questions
    var defaultFeedback = Ext.Object.merge({}, me.defaultFeedback, cfg.feedback);
    var intro, review, results;
    var pageNum = parseInt(cfg.pageNum, 10);
    for (var i = questionList.length - 1; i >= 0; i--) {
      var tempQuestion = questionList[i];

      delete tempQuestion.title;

      // xtype
      tempQuestion.xtype = tempQuestion.qtype;

      // look for intro, results, review
      switch (tempQuestion.qtype) {
        case 'Intro':
          intro = questionList.splice(i++, 1)[0];
          continue;
          break;
        case 'Results':
          results = questionList.splice(i++, 1)[0];
          continue;
          break;
        case 'Review':
          review = questionList.splice(i++, 1)[0];
          continue;
          break;
        default:
          // number_questions
          tempQuestion.pageNum = pageNum++;
          break;
      }

      // default tries
      if (!tempQuestion.tries) {
        tempQuestion.tries = cfg.tries || 1;
      }

      // default feedback
      tempQuestion.defaultFeedback = defaultFeedback;
    };

    // Randomize questions
    if (cfg.randomize && questionList.length > 1) {
      s = [];
      while (questionList.length) {
        s.push(questionList.splice(Math.random() * questionList.length, 1)[0]);
      }
      while (s.length) {
        questionList.push(s.pop());
      }
    }

    // Sub set of question
    if (cfg.useSubset) {
      var numquestions = cfg.numquestions;
      if (numquestions > 0) {
        questionList = questionList.splice(0, cfg.numquestions);
      } // else what?
    }

    // Add INTRO
    if (cfg.includeIntro) {
      if (!intro) {
        intro = {};
      }
      // default intro
      var introText = cfg.introText,
        introHeading = '';
      if (introText && introText.hasOwnProperty('heading')) {
        introHeading = introText.heading
      }
      if (introText && introText.hasOwnProperty('#text')) {
        introText = introText['#text']
      }
      var defaultIntro = {
        introHead: introHeading,
        introText: introText,
        xtype: "intro",
        questionId: "intro",
        qtype: "Intro"
      };

      // merge with default results
      questionList.unshift(Ext.Object.merge(defaultIntro, intro));
    }

    // Add Results
    if (cfg.showresults) {
      if (!results) {
        results = {};
      }
      // merge with default results
      questionList.push(Ext.Object.merge({
        xtype: "Results",
        questionId: "results",
        qtype: "Results",
        quizTitle: cfg.title,
        incReview: cfg.incReview,
        print_results: cfg.print_results,
        email_results: cfg.email_results,
        useServer: cfg.useServer,
        serverURL: cfg.serverURL,
        LMS_name: cfg.LMS_name,
        incQuizTitle: cfg.incQuizTitle,
        emailSubject: cfg.emailSubject,
        sendToEmail: cfg.sendToEmail,
        printMessage: cfg.printMessage,
        listeners: {
          review: me.onReview,
          scope: me
        }
      }, results));
    }

    // Add Review
    if (cfg.incReview) {
      if (!review) {
        review = {};
      }
      // merge with default review
      me._reviewObj = Ext.Object.merge({
        xtype: "Review",
        questionId: "review",
        qtype: "Review",
        incRetakeButton: cfg.incRetakeButton,
        listeners: {
          retake: me.onRetake,
          scope: me
        }
      }, review);
    }

    return questionList;
  },
  _reviewObj: {},

  onBeforeQuestionchange: function(sender, newQuestion, oldQuestion, eOpts) {
    // close old page
    if ( !! oldQuestion) {
      oldQuestion.close();
    }
  },

  onQuestionchange: function(sender, newQuestion, oldQuestion, eOpts) {
    var me = this;

    if (newQuestion) {
      //  TODO: find a better way to listen for  question-complete....
      newQuestion.on('queston-complete', me.onQuestionComplete, me);

      if(me._started){ // keep popup from showing when quiz isn't main page
        // Start New page
        newQuestion.start();
      }

      me.fireEvent('page-change', me, newQuestion);
    }
  },


  onQuestionComplete: function(question, questionRecord) {
    var me = this,
      quizRecord = {
        correct: 0,
        incorrect: 0,
        questionsToAsk: 0,
        points: 0,
        pointsPossible: 0,
        intScore: 0
      },
      questions = me.getQuestions(),
      qType = question.getQtype(),
      allComplete = true;

    if (me.recordedScore && me.getQuizmode() == 'test') {
      console.warn("Score already recorded...");
      return;
    }

    // Check if all questions are complete
    Ext.Array.each(questions, function(tempQuestion, index, items) {
      if (tempQuestion.getTracking() && !tempQuestion.getComplete()) {
        allComplete = false;
        return false;
      }
    });

    // if all complete record questions
    if (allComplete) {
      // Record Each Question
      Ext.Array.each(questions, function(tempQuestion, index, items) {
        if (tempQuestion.getTracking()) {
          me.recordQuestion(tempQuestion);

          // calcualte results
          var tempQuestionRecord = tempQuestion.getQuestionRecord();
          if (tempQuestionRecord.blnCorrect) {
            quizRecord.correct += 1;
            quizRecord.points += tempQuestionRecord.intWeighting;
          } else {
            quizRecord.incorrect += 1;
          }
          quizRecord.questionsToAsk += 1;
          quizRecord.pointsPossible += tempQuestionRecord.intWeighting;
        }
      });

      // Calculate Pass/Fail, percentage, round to 2 decimal places
      quizRecord.intScore = Math.round((quizRecord.points / quizRecord.pointsPossible) * 10000) / 100;
      quizRecord.passed = (quizRecord.intScore >= me.passingScore);

      // update results page if any
      if (me.getShowresults()) {
        me.query('Results')[0].setResults(quizRecord);
      }

      // Update Results
      if (me.getIncReview()) {
        me._reviewObj.questions = questions;
        me._reviewObj.score = {
          intScore: quizRecord.intScore,
          questionsToAsk: quizRecord.questionsToAsk,
          correct: quizRecord.correct
        };
      }

      // SCORM Recording
      if (me.getReportScore()) {
        SCORM.SetScore(quizRecord.intScore, me.maxscore, me.minscore);
      }

      switch (me.getRecordStatus()) {
        case 'none':
          me.completed = true;
          break;
        case 'passFail':
          if (quizRecord.passed) {
            SCORM.SetPassed();
          } else {
            SCORM.SetFailed();
            me.completed = true;
          }
          break;
        case 'completed':
          SCORM.SetCompleted();
          me.completed = true;
          break;
        case 'passIncomplete':
          if (quizRecord.passed) {
            SCORM.SetPassed();
            me.completed = true;
          } else {
            SCORM.ResetStatus();
            me.completed = false;
          }
          break;
        case 'apiPassFail':
          if (quizRecord.passed) {
            me.completed = true;
          } else {
            me.completed = false;
          }
          break;
        case 'apiCompleted':
          me.completed = true;
          break;
        default:
          me.completed = true;
          break;
      }

      // Mark page complere
      if (me.completed) {
        me.fireEvent('page-complete', me);
      }

      me.recordedScore = true;
    }
  },
  recordQuestion: function(question) {
    var me = this,
      questionRecord = question.getQuestionRecord();
    // TODO: see if I can move the SCORM.RecordInteraction calls to the Question class
    if (question.getTracking()) {
      switch (question.getQtype()) {
        case 'MCHIMAGE':
        case 'MCHAUDIO':
        case 'MCH':
        case 'HOIMAGE':
        case 'MC':
          var scormResponses = Ext.Array.map(questionRecord.response, function(response, index, items) {
            return SCORM.CreateResponseIdentifier(response.Short, response.Long);
          });
          var scormCorrectResponses = Ext.Array.map(questionRecord.correctResponse, function(response, index, items) {
            return SCORM.CreateResponseIdentifier(response.Short, response.Long);
          });
          SCORM.RecordMultipleChoiceInteraction(questionRecord.strID, scormResponses, questionRecord.blnCorrect, scormCorrectResponses, questionRecord.strDescription.replace(/(<([^>]+)>)/ig, ""), questionRecord.intWeighting, questionRecord.intLatency, questionRecord.strLearningObjectiveID, questionRecord.startTime);
          break;
        case 'TF':
          SCORM.RecordTrueFalseInteraction(questionRecord.strID, questionRecord.response, questionRecord.blnCorrect, questionRecord.correctResponse, questionRecord.strDescription.replace(/(<([^>]+)>)/ig, ""), questionRecord.intWeighting, questionRecord.intLatency, questionRecord.strLearningObjectiveID, questionRecord.startTime);
          break;
        case 'FB':
        case 'ESSAY':
          SCORM.RecordFillInInteraction(questionRecord.strID, questionRecord.response, questionRecord.blnCorrect, questionRecord.correctResponse, questionRecord.strDescription.replace(/(<([^>]+)>)/ig, ""), questionRecord.intWeighting, questionRecord.intLatency, questionRecord.strLearningObjectiveID, questionRecord.startTime);
          break;
        default:
          console.warn("Unsupported qtype:", question);
          break;
      }
    }
  },


  onRetake: function() {
    var me = this;
    // refresh questions
    if (me.getRandomize()) {
      me.setQuestions(me.refreshQuestionList(me.config));
    } else {
      // reset questions
      Ext.Array.each(me.getQuestions(), function(question, index, items) {
        if (question.getTracking()) {
          question.setComplete(false);
        }
      });
    }

    var review = me.query('Review')[0];
    if (review) {
      me.remove(review);
    }

    // reset state variables
    me.quizRecord = {
      correct: 0,
      incorrect: 0,
      questionsToAsk: 0,
      points: 0,
      pointsPossible: 0,
      intScore: 0
    };

    me.recordedScore = false;
    me.completed = false;

    me.resetQuestions();
  }
});