Ext.define('Player.page.CustomQuiz', {
    extend: 'Ext.carousel.Carousel',

    requires: ['Ext.form.*',
        'Player.page.questions.DDNUM',
        'Player.page.questions.DDTASK',
        'Player.page.questions.ESSAY',
        'Player.page.questions.HOIMAGE',
        'Player.page.questions.FB',
        'Player.page.questions.Intro',
        'Player.page.questions.MC',
        'Player.page.questions.MCAUDIO',
        'Player.page.questions.MCH',
        'Player.page.questions.MCHAUDIO',
        'Player.page.questions.MCHIMAGE',
        'Player.page.questions.MCIMAGE',
        'Player.page.questions.TF',
        'Player.page.questions.Results',
        'Player.page.questions.Review'
        ],

    config: {
        layout: 'vbox',
        indicator: false,
        scrollable: false,
        height: '100%',
        pType: 'Quiz',
        quizRecord: null,
        quizMode: 'test',
        recordId: '',
        locked: 'none',
        pageData: {
            title: 'Page Title 2',
            pText: ''
        },
        listeners: [{
            fn: 'onCarouselActiveItemChange',
            event: 'activeitemchange'
        }]
    },

    onCarouselActiveItemChange: function (container, value, oldValue, options) {
        var me = this,
            mp = Ext.getCmp("mainPages"),
            mpActiveIindex = mp.getActiveIndex(),
            quizRecord = me.getQuizRecord();
        if (!me.isActive) {
            return;
        }
        var i = me.getActiveIndex();

        if (i === 0) {
            // First Page
            Player.app.fireEvent('lockPages', 'right');
            if (mpActiveIindex > 0) {
                Player.app.fireEvent('lockButtonDirection', 'none');
            } else {
                Player.app.fireEvent('lockButtonDirection', 'left');
            }

        } else if (i + 1 === me.innerItems.length) {
            if (value.xtype == 'review') {
                // REVIEW page
                Player.app.fireEvent('lockPages', 'left');
                if (mpActiveIindex == mp.items.length - 1) {

                    Player.app.fireEvent('lockButtonDirection', 'right');
                } else {
                    me.setLocked('none');
                    Player.app.fireEvent('lockButtonDirection', 'none');
                }
            } else {
                Player.app.fireEvent('lockPages', 'left');
                // Last page
                if (mpActiveIindex == mp.items.length - 1) {
                    if (me.getQuizMode() == 'test') {
                        Player.app.fireEvent('lockButtonDirection', 'both');
                    } else {
                        Player.app.fireEvent('lockButtonDirection', 'right');
                    }
                } else {
                    if (me.getQuizMode() == 'test') {
                        Player.app.fireEvent('lockButtonDirection', 'left');
                    } else {
                        Player.app.fireEvent('lockButtonDirection', 'none');
                    }

                }
            }
        } else {
            Player.app.fireEvent('lockPages', 'both');

            if (me.getQuizMode() == 'test') {
                me.setLocked('left');
                Player.app.fireEvent('lockButtonDirection', 'left');
            } else {
                Player.app.fireEvent('lockButtonDirection', 'none');
            }
            // a Middle page
        }
        oldValue.cleanup();

        value.start();

        if (quizRecord.raw.number_questions) {
            Player.app.fireEvent('updatePageNumber', value.config.adjustedPageNumber);
        }
    },

    applyPageData: function (config) {
        return config;
    },

    updatePageData: function (newPageData, oldPageData) {
        var me = this,
            qs = Ext.getStore("Quizes"),
            quizRecord = qs.findRecord('id', newPageData.id, 0, false, true, true),
            quizData = quizRecord.raw,
            questionsToAsk, questionsList, i, questionData, questionRecord, panel, s, data, errorStr,
            pageOffset = newPageData.pageNum + 1,
            //Custom Variables
            pretest = quizData.preTest,
            posttest = quizData.postTest,
            pretestRecorded, posttestRecorded;

        me.setQuizRecord(quizRecord);
        pretestRecorded = me.apiPreTestStored();
        posttestRecorded = me.apiPostTestStored();

        //console.log("PreTest: " + quizData.preTestStored);
        //console.log("PostTest: " + quizData.postTestStored);
        //me.getPageData().preTestStored = true;
        //console.log("PreTest: " + newPageData.preTestStored);
        //console.log("PostTest: " + newPageData.postTestStored);
        //console.log("quiz Data preTest: " + quizData.preTest);
        //console.log("Settings tracking: " + Player.settings.get('tracking'));
        //console.log("preTest: " + pretest + " -postTest: " + posttest + " -pretestRecorded: " + pretestRecorded + " -posttestRecorded: " + posttestRecorded)


        //********************Customized Code**********************
        if (pretest && pretestRecorded) {
            me.apiGetPreTestScore();
            //Pretest already recorded, so go to results page.
            panel = Ext.create('Player.page.questions.Results', {
                itemId: 'quizResults',
                results: {},
                listeners: {
                    review: me.onReview,
                    scope: this
                },
                quizData: quizData,
                adjustedPageNumber: pageOffset++
            });
            me.add(panel);

            me.pageOffset = pageOffset;
            me.getComponent('quizResults').setResults(quizRecord.data);
        } else if (posttest && posttestRecorded) {
            me.apiGetPostTestScore();
            //Posttest already recorded, so go to results page.
            panel = Ext.create('Player.page.questions.Results', {
                itemId: 'quizResults',
                results: {},
                listeners: {
                    review: me.onReview,
                    scope: this
                },
                quizData: quizData,
                adjustedPageNumber: pageOffset++
            });
            me.add(panel);

            me.pageOffset = pageOffset;
            me.getComponent('quizResults').setResults(quizRecord.data);
        } else {
            //Build Quiz Normally
            //*************************End*****************************
            // Add INTRO
            if (quizData.includeIntro) {
                var intro = quizData.introText || {};
                panel = Ext.create('Player.page.questions.Intro', {
                    introHead: intro.heading || '',
                    introText: intro['#text'] || '',
                    adjustedPageNumber: pageOffset++
                });
                me.add(panel);
            }

            // Add QUESTIONS
            if (quizData.randomize) {
                s = [];
                // Randomize the array
                while (quizData.question.length) {
                    s.push(quizData.question.splice(Math.random() * quizData.question.length, 1)[0]);
                }
                while (s.length) {
                    quizData.question.push(s.pop());
                }
            }

            questionsList = quizData.question;

            if (quizData.useSupset || quizData.useSubset) {
                questionsToAsk = quizData.numquestions;
            } else if (questionsList) {
                questionsToAsk = questionsList.length;
            } else {
                questionsToAsk = [];
            }

            me.setQuizMode(quizData.quizmode);

            /// generate global feedback
            feedbackObject = {};
            if (quizData.feedback) {
                if (quizData.feedback.mobileInitPrompt) {
                    me.setInitprompt_Text(quizData.feedback.mobileInitPrompt['#text']);
                } else if (quizData.feedback.initPrompt) {
                    feedbackObject.initprompt_Text = quizData.feedback.initPrompt['#text'];
                }
                if (quizData.feedback.evalPrompt) {
                    feedbackObject.evalprompt_Text = quizData.feedback.evalPrompt['#text'];
                }
                if (quizData.feedback.correctFeedback) {
                    feedbackObject.correctfeedback_Text = quizData.feedback.correctFeedback['#text'];
                }
                if (quizData.feedback.incorrectFeedback) {
                    feedbackObject.incorrectfeedback_Text = quizData.feedback.incorrectFeedback['#text'];
                }
                if (quizData.feedback.triesFeedback) {
                    feedbackObject.triesfeedback_Text = quizData.feedback.triesFeedback['#text'];
                }
                if (quizData.feedback.tries) {
                    feedbackObject.tries = quizData.feedback.tries;
                }
                if (typeof quizData.feedback.provide == 'boolean') {
                    feedbackObject.provideFeedback = quizData.feedback.provide;
                }
            }


            for (i = 0, ln = questionsToAsk; i < ln; i++) {
                questionData = questionsList[i];
                questionRecord = quizRecord.questionsStore.findRecord('id', questionData.id, false, true, true);

                //try {
                //console.log("Question:Player.page.questions." + questionData.qtype);
                panel = Ext.create('Player.page.questions.' + questionData.qtype, Ext.Object.merge({
                    questionRecord: questionRecord,
                    listeners: {
                        questoncomplete: me.onQuestionComplete,
                        scope: this
                    },
                    adjustedPageNumber: pageOffset++
                }, feedbackObject));
                me.add(panel);
                /*} catch (e) {
                    data = '';
                    try {
                        data = JSON.stringify(questionData);
                    } catch (ee) {}
                    errorStr = 'Error:: Could not creating quiz question. Type: ' + questionData.qtype + ' Error:' + e + ' Data:' + data;
                    //throw errorStr;
                }*/
            }

            // Add RESULTS
            if (quizData.showresults) {
                panel = Ext.create('Player.page.questions.Results', {
                    itemId: 'quizResults',
                    results: {},
                    listeners: {
                        review: me.onReview,
                        scope: this
                    },
                    quizData: quizData,
                    adjustedPageNumber: pageOffset++
                });
                me.add(panel);
            }
            me.pageOffset = pageOffset;
            //
        }
    },
    onQuestionComplete: function (questionRecord) {
        var me = this,
            quizRecord = me.getQuizRecord(),
            i, ln = me.items.length,
            allComplete = true,
            tempQuestion, tempQuestionRecord,
            percentage = 0,
            pass = false,
            //Custom Variables
            quizData = quizRecord.raw,
            pretest = quizData.preTest,
            posttest = quizData.postTest;
        //console.log("onQuestionComplete called");
        //********************Customized Code (if statements added in two places)******************
        if (me.recordedScore) {
            return;
        }
        for (i = 0; i < ln; i++) {
            tempQuestion = me.items.items[i];
            tempQuestionRecord = tempQuestion.getQuestionRecord();
            if (tempQuestionRecord && !tempQuestionRecord.get('complete')) {
                allComplete = false;
                break;
            }
        }
        if (allComplete) {
            me.recordedScore = true;
            /*if (posttest)
            {
                me.clearPostResults();
            } else {*/
            me.clearResults();
            //}
            // Record Each Question
            for (i = 0; i < ln; i++) {
                tempQuestion = me.items.items[i];
                tempQuestionRecord = tempQuestion.getQuestionRecord();
                if (tempQuestionRecord) {
                    me.updateResults(tempQuestionRecord);
                }
            }
            //console.log("allComplete in CustomQuiz.");
            // Calculate Pass/Fail, percentage
            /* if (posttest)
            {
                percentage = Math.round((quizRecord.get('pointsPost') / quizRecord.get('pointsPossiblePost')) * 100);
                quizRecord.set('intScorePost', percentage);
            } else {*/
            percentage = Math.round((quizRecord.get('points') / quizRecord.get('pointsPossible')) * 100);
            quizRecord.set('intScore', percentage);
            // }

            pass = (percentage >= quizRecord.get('passingScore'));
            quizRecord.set('passed', pass);

            if (quizRecord.raw.showresults) {
                me.getComponent('quizResults').setResults(quizRecord.data);
            }

            // SCORM Recording
            if (posttest) {
                //if (quizRecord.get('reportScore')) {
                try {
                    var success = SCORM.SetScore(percentage, quizRecord.get('intMaxScore'), quizRecord.get('intMinScore'));
                } catch (e) {
                    console.log("Score was not recorded: " + e);
                }
                //}

                me.apiSetObjectivePost("posttest");

                //me.apiSetObjectiveScorePost(quizRecord.get('pointsPost'),quizRecord.get('intScorePost'),quizRecord.get('correctPost'),quizRecord.get('incorrectPost'),quizRecord.get('pointsPossiblePost'));
                me.apiSetObjectiveScorePost(quizRecord.get('points'), quizRecord.get('intScore'), quizRecord.get('correct'), quizRecord.get('incorrect'), quizRecord.get('pointsPossible'));
            } else if (pretest) {
                me.apiSetObjective("pretest");

                me.apiSetObjectiveScore(quizRecord.get('points'), quizRecord.get('intScore'), quizRecord.get('correct'), quizRecord.get('incorrect'), quizRecord.get('pointsPossible'));
            }
            //*****************************End***************************
            switch (quizRecord.get('recordStatus')) {
                case 'none':
                    quizRecord.set('complete', true);
                    break;
                case 'passFail':
                    if (pass) {
                        try {
                            var success = SCORM.SetPassed();
                        } catch (e) {}
                        quizRecord.set('complete', true);
                    } else {
                        try {
                            var success = SCORM.SetFailed();
                        } catch (e) {}
                        quizRecord.set('complete', true);
                    }
                    break;
                case 'completed':
                    try {
                        var success = SCORM.SetReachedEnd();
                    } catch (e) {}
                    quizRecord.set('complete', true);
                    break;
                case 'passIncomplete':
                    if (pass) {
                        try {
                            var success = SCORM.SetPassed();
                        } catch (e) {}
                        quizRecord.set('complete', true);
                    } else {
                        try {
                            var success = SCORM.ResetStatus();
                        } catch (e) {}
                        quizRecord.set('complete', false);
                    }
                    break;
                case 'apiPassFail':
                    if (pass) {
                        quizRecord.set('complete', true);
                    } else {
                        quizRecord.set('complete', false);
                    }
                    break;
                case 'apiCompleted':
                    quizRecord.set('complete', true);
                    break;
                default:
                    quizRecord.set('complete', true);
                    break;
            }

            // Mark page complere
            if (quizRecord.get('complete')) {
                this.fireEvent('page-complete');
            }
        }
    },
    updateResults: function (questionRecord) {
        var me = this,
            quizRecord = me.getQuizRecord(),
            quizData = quizRecord.data,
            questionData = questionRecord.data,
            posttest = quizData.postTest;
        //This is called on the results page or more correctly when quiz is finished.
        //console.log("updateResults called.");     
        /* if (posttest)
        {
            if (questionData.blnCorrect) {
                quizRecord.set('correctPost', ++quizData.correctPost);
                quizRecord.set('pointsPost', quizData.pointsPost + questionData.intWeighting);
            } else {
                quizRecord.set('incorrectPost', ++quizData.incorrectPost);
            }
            quizRecord.set('pointsPossiblePost', quizData.pointsPossiblePost + questionData.intWeighting);
        } else {*/
        if (questionData.blnCorrect) {
            quizRecord.set('correct', ++quizData.correct);
            quizRecord.set('points', quizData.points + questionData.intWeighting);
        } else {
            quizRecord.set('incorrect', ++quizData.incorrect);
        }
        quizRecord.set('pointsPossible', quizData.pointsPossible + questionData.intWeighting);
        // }

        try {
            //console.log("DATA:" + JSON.stringify(questionData));
        } catch (e) {}

        if (questionData.tracking) { // && using Scorm?
            switch (questionData.qtype) {
                case 'MCHIMAGE':
                case 'MCHAUDIO':
                case 'MCH':
                    try {
                        //SCORM.CreateResponseIdentifier(questionData.correctResponse.Short, questionData.correctResponse.Long)
                        //SCORM.CreateResponseIdentifier(questionData.response.Short, questionData.response.Long)
                        var scormResponses = [],
                            scormCorrectResponses = [],
                            tempResponse;
                        for (var i = 0, ln = questionData.response.length; i < ln; i++) {
                            tempResponse = questionData.response[i];
                            scormResponses.push(SCORM.CreateResponseIdentifier(tempResponse.Short, tempResponse.Long));
                        };
                        for (var i = 0, ln = questionData.correctResponse.length; i < ln; i++) {
                            tempResponse = questionData.correctResponse[i];
                            scormCorrectResponses.push(SCORM.CreateResponseIdentifier(tempResponse.Short, tempResponse.Long));
                        };

                        var success = SCORM.RecordMultipleChoiceInteraction(questionData.strID, scormResponses, questionData.blnCorrect, scormCorrectResponses, questionData.strDescription.replace(/(<([^>]+)>)/ig, ""), questionData.intWeighting, questionData.intLatency, questionData.strLearningObjectiveID);
                    } catch (e) {
                        console.log("MCH Error:" + e);
                    }
                    break;
                case 'TF':
                    try {
                        var success = SCORM.RecordTrueFalseInteraction(questionData.strID, questionData.response, questionData.blnCorrect, questionData.correctResponse, questionData.strDescription.replace(/(<([^>]+)>)/ig, ""), questionData.intWeighting, questionData.intLatency, questionData.strLearningObjectiveID);
                    } catch (e) {}
                    break;
                case 'FB':
                case 'ESSAY':
                    try {
                        var success = SCORM.RecordFillInInteraction(questionData.strID, questionData.response, questionData.blnCorrect, questionData.correctResponse, questionData.strDescription.replace(/(<([^>]+)>)/ig, ""), questionData.intWeighting, questionData.intLatency, questionData.strLearningObjectiveID);
                    } catch (e) {}
                    break;
                case 'MC':
                    try {
                        var scormResponses = [],
                            scormCorrectResponses = [],
                            tempResponse;
                        for (var i = 0, ln = questionData.response.length; i < ln; i++) {
                            tempResponse = questionData.response[i];
                            scormResponses.push(SCORM.CreateResponseIdentifier(tempResponse.Short, tempResponse.Long));
                        };
                        for (var i = 0, ln = questionData.correctResponse.length; i < ln; i++) {
                            tempResponse = questionData.correctResponse[i];
                            scormCorrectResponses.push(SCORM.CreateResponseIdentifier(tempResponse.Short, tempResponse.Long));
                        };
                        var success = SCORM.RecordMultipleChoiceInteraction(questionData.strID, scormResponses, questionData.blnCorrect, scormCorrectResponses, questionData.strDescription.replace(/(<([^>]+)>)/ig, ""), questionData.intWeighting, questionData.intLatency, questionData.strLearningObjectiveID);
                    } catch (e) {
                        console.log("MC Error:" + e);
                    }
                    break;
            }
        }
    },
    //************************Custom********************
    clearResults: function () {
        var me = this,
            pData = me.getPageData(),
            quizRecord = me.getQuizRecord(),
            quizData = quizRecord.raw,
            pretest = quizData.preTest,
            posttest = quizData.postTest
            doit = true;
        console.log("clearResults called in Customquiz.js.")
        if (pretest) {
            if (me.apiPreTestStored()) {
                doit = false;
            }
        } else if (posttest) {
            if (me.apiPostTestStored()) {
                doit = false;
            }
        }
        if (doit) {
            quizRecord.set('correct', 0);
            quizRecord.set('points', 0);
            quizRecord.set('incorrect', 0);
            quizRecord.set('pointsPossible', 0);
            quizRecord.set('intScore', 0);
        }
    },

    //Probably don't need this.
    /* clearPostResults: function () {
        var me = this,
            pData = me.getPageData(),
            quizRecord = me.getQuizRecord();

        quizRecord.set('correctPost', 0);
        quizRecord.set('pointsPost', 0);
        quizRecord.set('incorrectPost', 0);
        quizRecord.set('pointsPossiblePost', 0);
        quizRecord.set('intScorePost', 0);
    },*/
    //**********************End*************************
    onReview: function () {
        var me = this,
            pData = me.getPageData(),
            quizRecord = me.getQuizRecord(),
            panel;

        me.remove(me.getComponent('quizReview'))

        panel = Ext.create('Player.page.questions.Review', {
            itemId: 'quizReview',
            results: {},
            listeners: {
                retake: me.onRetake,
                scope: me
            },
            adjustedPageNumber: me.pageOffset - 1, // don't count review
            quizRecord: quizRecord
        });
        me.add(panel);

        me.next();
    },
    onRetake: function () {
        var me = this;
        me.setActiveItem(0);
        me.remove(me.getComponent('quizReview'));
    },

    resetQuestions: function () {
        var me = this,
            ln = me.items.items.length;
        for (i = 0; i < ln; i++) {
            tempQuestion = me.items.items[i];
            tempQuestionRecord = tempQuestion.getQuestionRecord();
            if (tempQuestionRecord) {
                tempQuestionRecord.set('complete', false);
            }
        }
    },

    initialize: function () {
        var me = this;
        me.setAnimation({
            duration: 500,
            easing: {
                type: 'ease-in-out'
            }
        });

        me.setActiveItem(0);
        me.callParent(arguments);
        me.clearResults();
    },
    start: function () {
        var me = this,
            pData = me.getPageData(),
            quizRecord = me.getQuizRecord();
        me.setActiveItem(0);
        me.isActive = true;
        if (me.innerItems.length > 1) {
            Player.app.fireEvent('lockPages', 'right');
        }
        me.resetQuestions();
        me.getActiveItem().start();

        if (me.getQuizMode() == 'test') {
            me.setLocked('left');
            Player.app.fireEvent('lockButtonDirection', 'left');
        }

        // Adjust page number if counting questions
        if (quizRecord.raw.number_questions) {
            Player.app.fireEvent('updatePageNumber', me.getActiveItem().config.adjustedPageNumber);
        }
        me.recordedScore = false;
    },
    close: function () {
        try {
            Ext.getCmp('main').getComponent('instructions').setHidden(true);
        } catch (e) {
            console.log("e:" + e);
        }
        this.getActiveItem().cleanup();
        this.isActive = false;
        Player.app.fireEvent('lockPages', 'none');
    },
    setRendered: function (rendered) {
        var me = this,
            wasRendered = me.rendered;

        if (rendered !== wasRendered) {
            me.rendered = rendered;

            var items = me.items.items,
                carouselItems = me.carouselItems,
                i, ln, item;

            for (i = 0, ln = items.length; i < ln; i++) {
                item = items[i];

                if (!item.isInnerItem()) {
                    item.setRendered(rendered);
                }
            }
            // Why is carouselItems null??? Maybe I should return false?
            if (!carouselItems) {
                return true;
            }
            for (i = 0, ln = carouselItems.length; i < ln; i++) {
                carouselItems[i].setRendered(rendered);
            }

            return true;
        }

        return false;
    },
    onDragStart: function (e) {
        var me = this,
            lockDir = me.getLocked();

        if (e.deltaX > 0 && (lockDir == 'left' || lockDir == 'both')) {
            return;
        } else if (e.deltaX < 0 && (lockDir == 'right' || lockDir == 'both')) {
            return;
        }

        me.callParent(arguments);
    },

    onDrag: function (e) {
        var me = this,
            lockDir = me.getLocked();

        if (e.deltaX > 0 && (lockDir == 'left' || lockDir == 'both')) {
            return;
        } else if (e.deltaX < 0 && (lockDir == 'right' || lockDir == 'both')) {
            return;
        }

        me.callParent(arguments);
    },

    onDragEnd: function (e) {
        var me = this,
            lockDir = me.getLocked();

        if (e.deltaX > 0 && (lockDir == 'left' || lockDir == 'both')) {
            return;
        } else if (e.deltaX < 0 && (lockDir == 'right' || lockDir == 'both')) {
            return;
        }

        me.callParent(arguments);
    },
    nextHandler: function () {
        var me = this;
        if (me.getActiveIndex() + 1 < me.innerItems.length) {
            me.next();
            return false;
        }
        return true;
    },
    previousHandler: function () {
        var me = this;
        if (me.getActiveIndex() > 0) {
            me.previous();
            return false;
        }
        return true;
    },


    //*************Customization Functions*************
    apiSetObjective: function (oId, oStatus) {
        var me = this,
            blnResult, objCnt = 0,
            data_tracking = Player.settings.get('tracking'),
            quizRecord = me.getQuizRecord(),
            objInt = "cmi.objectives." + objCnt + ".";

        if (data_tracking == "SCORM1.3") {
            if (oId) {
                //Need to create a JavaScript equivalent function for CallSetValue
                blnResult = SCORM.SCORM2004_CallSetValue(objInt + "id", oId);
                if (oStatus) blnResult = SCORM.SCORM2004_CallSetValue(objInt + "success_status", oStatus) && blnResult;
                blnResult = SCORM.SCORM2004_CallSetValue(objInt + "completion_status", "completed") && blnResult;

                //if (oDesc) ExternalInterface.call("SCOSetValue",objInt + "description",oDesc);
                //scormValue_array[9] = 1; //Not being used in mobile version
            }
        }
        //me.getPageData().preTestStored = true;
        quizRecord.set('preTestStored', true);
    },
    apiSetObjectiveScore: function (nRaw, sResult, nCorrect, nIncorrect, nPossible) {
        var me = this,
            blnResult, objCnt = 0, //objCnt is set to 0 because this is for pretest.
            data_tracking = Player.settings.get('tracking'),
            quizRecord = me.getQuizRecord(),
            nMax = quizRecord.get('intMaxScore'),
            nMin = quizRecord.get('intMinScore'),
            objInt = "cmi.objectives." + objCnt + ".score.";

        if (data_tracking == "SCORM1.3") {
            blnResult = SCORM.SCORM2004_CallSetValue(objInt + "min", nMin);
            blnResult = SCORM.SCORM2004_CallSetValue(objInt + "max", nMax) && blnResult;
            blnResult = SCORM.SCORM2004_CallSetValue(objInt + "raw", nRaw) && blnResult;
            blnResult = SCORM.SCORM2004_CallSetValue(objInt + "scaled", (sResult / 100)) && blnResult;

            objInt = "cmi.objectives." + objCnt + ".";
            blnResult = SCORM.SCORM2004_CallSetValue(objInt + "description", nCorrect + "~" + nIncorrect + "~" + nPossible) && blnResult;
        }
    },
    apiSetObjectivePost: function (oId, oStatus) {
        var me = this,
            blnResult, objCnt = 1,
            data_tracking = Player.settings.get('tracking'),
            quizRecord = me.getQuizRecord(),
            objInt = "cmi.objectives." + objCnt + ".";

        if (data_tracking == "SCORM1.3" || data_tracking == "SCORM1.2") {
            if (oId) {
                //Need to create a JavaScript equivalent function for CallSetValue

                if (data_tracking == "SCORM1.3") {
                    blnResult = SCORM.SCORM2004_CallSetValue(objInt + "id", oId);
                    if (oStatus) blnResult = SCORM.SCORM2004_CallSetValue(objInt + "success_status", oStatus) && blnResult;
                    blnResult = SCORM.SCORM2004_CallSetValue(objInt + "completion_status", "completed") && blnResult;
                } else {
                    blnResult = SCORM.SCORM_CallSetValue(objInt + "id", oId);
                    if (oStatus) blnResult = SCORM.SCORM_CallSetValue(objInt + "status", oStatus) && blnResult;
                }

                //if (oDesc) ExternalInterface.call("SCOSetValue",objInt + "description",oDesc);
                //scormValue_array[9] = 1; //Not being used in mobile version.
            }
        }
        //me.getPageData().postTestStored = true;
        quizRecord.set('postTestStored', true);
    },
    apiSetObjectiveScorePost: function (nRaw, sResult, nCorrect, nIncorrect, nPossible) {
        var me = this,
            blnResult, objCnt = 1, //objCnt is set to 1 because this is for posttest.
            data_tracking = Player.settings.get('tracking'),
            quizRecord = me.getQuizRecord(),
            nMax = quizRecord.get('intMaxScore'),
            nMin = quizRecord.get('intMinScore'),
            objInt = "cmi.objectives." + objCnt + ".score.";

        if (data_tracking == "SCORM1.3" || data_tracking == "SCORM1.2") {

            if (data_tracking == "SCORM1.3") {
                blnResult = SCORM.SCORM2004_CallSetValue(objInt + "min", nMin);
                blnResult = SCORM.SCORM2004_CallSetValue(objInt + "max", nMax) && blnResult;
                blnResult = SCORM.SCORM2004_CallSetValue(objInt + "raw", nRaw) && blnResult;
                blnResult = SCORM.SCORM2004_CallSetValue(objInt + "scaled", (sResult / 100)) && blnResult;

                objInt = "cmi.objectives." + objCnt + ".";
                blnResult = SCORM.SCORM2004_CallSetValue(objInt + "description", nCorrect + "~" + nIncorrect + "~" + nPossible) && blnResult;
            } else if (data_tracking == "SCORM1.2") {
                //Record for SCORM 1.2
                //Use the comment element
                /*blnResult = SCORM.SCORM_CallSetValue(objInt + "min", nMin);
                blnResult = SCORM.CallSetValue(objInt + "max", nMax) && blnResult;
                blnResult = SCORM.CallSetValue(objInt + "raw", nRaw) && blnResult;*/
                /*if (me.getPageData().preTestStored)
                {
                    scormData = ExternalInterface.call("SCOGetValue","cmi.comments");
                    ExternalInterface.call("SCOSetValue","cmi.comments",scormData + "&" + nCorrect + "~" + nIncorrect + "~" + nPossible);
                } else {
                    ExternalInterface.call("SCOSetValue","cmi.comments",nCorrect + "~" + nIncorrect + "~" + nPossible);
                }*/
            }
        }
    },
    apiPreTestStored: function () {
        var me = this,
            quizRecord = me.getQuizRecord(),
            objStr, preTestStored = quizRecord.get('preTestStored');

        if (!preTestStored) {
            try {
                objStr = SCORM.SCORM2004_CallGetValue("cmi.objectives.0.id");
            } catch (e) {
                console.log("Not able to grab objective data from LMS: " + e);
            }

            if (objStr == "pretest") {
                preTestStored = true;
                quizRecord.set('preTestStored', preTestStored)
                //me.getPageData().preTestStored = preTestStored;
            }
        }

        return preTestStored;
    },
    apiPostTestStored: function () {
        var me = this,
            quizRecord = me.getQuizRecord(),
            objStr, intCount, postTestStored = quizRecord.get('postTestStored');

        if (!postTestStored) {
            try {
                intCount = SCORM.SCORM2004_CallGetValue("cmi.objectives._count");
                if (intCount > 1) objStr = SCORM.SCORM2004_CallGetValue("cmi.objectives.1.id");
            } catch (e) {
                console.log("Not able to grab objective data from LMS: " + e);
            }

            if (objStr == "posttest") {
                postTestStored = true;
                //me.getPageData().postTestStored = postTestStored;
                quizRecord.set('postTestStored', postTestStored);
            }
        }

        return postTestStored;
    },
    apiGetPreTestScore: function () {
        var me = this,
            objStr, quizRecord = me.getQuizRecord();
        try {
            objStr = SCORM.SCORM2004_CallGetValue("cmi.objectives.0.score.raw");
            quizRecord.set('points', objStr);
            objStr = SCORM.SCORM2004_CallGetValue("cmi.objectives.0.score.scaled");
            quizRecord.set('intScore', (objStr * 100));
            objStr = SCORM.SCORM2004_CallGetValue("cmi.objectives.0.description");

            var tmpArray = objStr.split("~");
            quizRecord.set('correct', tmpArray[0]);
            quizRecord.set('incorrect', tmpArray[1]);
            quizRecord.set('pointsPossible', tmpArray[2]);
        } catch (e) {
            console.log("Unable to retrieve objective data from LMS: " + e);
        }
    },
    apiGetPostTestScore: function () {
        var me = this,
            quizRecord = me.getQuizRecord();
        try {
            objStr = SCORM.SCORM2004_CallGetValue("cmi.objectives.1.score.raw");
            quizRecord.set('points', objStr);
            objStr = SCORM.SCORM2004_CallGetValue("cmi.objectives.1.score.scaled");
            quizRecord.set('intScore', (objStr * 100));
            objStr = SCORM.SCORM2004_CallGetValue("cmi.objectives.1.description");

            var tmpArray = objStr.split("~");
            quizRecord.set('correct', tmpArray[0]);
            quizRecord.set('incorrect', tmpArray[1]);
            quizRecord.set('pointsPossible', tmpArray[2]);
        } catch (e) {
            console.log("Unable to retrieve objective data from LMS: " + e);
        }
    }
});