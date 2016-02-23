Ext.define('Player.page.WordGame', {
    extend: 'Player.page.Page',

    alias: ['widget.WordGame'],

    requires: [],

    config: {
        layout: {
            pack: 'start',
            type: 'card',
            align: 'center'
        },
        styleHtmlContent: true,
        scrollable: false,
        height: '100%',
        recordId: '',
        items: [
            // title top
            {
                xtype: 'panel',
                html: 'Page Title',
                itemId: 'pageTitle',
                cls: 'instruction-title',
                width: '100%',
                docked: 'top',
                layout: {
                    type: 'fit'
                }
            },
            // score & timer top
            {
                xtype: 'container',
                docked: 'top',
                cls: 'spin-score',
                layout: {
                    align: 'center',
                    pack: 'center',
                    type: 'hbox'
                },
                items: [{
                    xtype: 'button',
                    iconCls: 'help',
                    itemId: 'helpBtn',
                    ui: 'plain'
                }, {
                    xtype: 'container',
                    itemId: 'scoreLabel',
                    html: '<span class="spin-score-label">Score</span> <span class="spin-score-count">-- of --</span>'
                }, {
                    xtype: 'container',
                    itemId: 'timeLabel',
                    hidden: true,
                    html: '<span class="spin-time">00:00</span>'
                }]
            },
            // contents
            {
                xtype: 'container',
                itemId: 'gameCard',
                scrollable: {
                    direction: 'vertical',
                    directionLock: true
                },
                layout: {
                    pack: 'start',
                    type: 'vbox',
                    align: 'center'
                },
                items: [{
                    xtype: 'textimage',
                    html: '',
                    width: '91%',
                    cls: 'page-content',
                    itemId: 'pageText'
                }, {
                    xtype: 'textfield',
                    label: 'Enter you answer here:',
                    labelAlign: 'top',
                    clearIcon: false,
                    cls: 'question-text-input',
                    name: 'inputText',
                    itemId: 'inputText'
                }]
            }, {
                xtype: 'container',
                itemId: 'feedbackCard',
                scrollable: false,
                height: '100%',
                layout: {
                    pack: 'start',
                    type: 'fit',
                    align: 'start'
                },
                items: [{
                    xtype: 'container',
                    itemId: 'finalFeedbackTitle',
                    docked: 'top'
                }, {
                    xtype: 'list',
                    itemId: 'feedbackList',
                    cls: 'feedbacklist',
                    scrollable: {
                        direction: 'vertical',
                        directionLock: true
                    },
                    itemTpl: ['<tpl if="correct">',
                        '<div class="responseimg"><img class="correct" src="' + g_styleRoot + 'resources/images/WordGame/correct.png"/></div>',
                        '<tpl else>',
                        '<div class="responseimg"><img class="incorrect" src="' + g_styleRoot + 'resources/images/WordGame/incorrect.png"/></div>',
                        '</tpl>',
                        '<div class="response">{response}</div>',
                        '<div class="answer">{answer}</div>'
                    ],
                    items: [{
                        xtype: 'container',
                        scrollDock: 'top',
                        itemId: 'feedbackListHeader',
                        cls: 'feedbackListHeader',
                        docked: 'top',
                        html: 'Your Response: Correct Response'

                    }],
                    height: '100%',
                    width: '100%'
                }]
            },
            // bottom bar
            {
                xtype: 'container',
                docked: 'bottom',
                itemId: 'bottomBar',
                layout: {
                    type: 'hbox',
                    pack: 'center',
                    align: 'center'
                },
                items: [{
                    xtype: 'button',
                    text: 'Hint',
                    itemId: 'hintBtn',
                    margin: '4 4 4 4',
                    ui: 'action'
                }, {
                    xtype: 'button',
                    itemId: 'submitBtn',
                    text: 'Submit Answer',
                    margin: '4 4 4 4',
                    disabled: true,
                    ui: 'action'
                }]
            }
        ],
        listeners: [{
            fn: 'onFeedbackSelect',
            event: 'select',
            delegate: '#feedbackList'
        }, {
            fn: 'onShowInstructions',
            event: 'tap',
            delegate: '#helpBtn'
        }, {
            fn: 'onSubmitAnswer',
            event: 'tap',
            delegate: '#submitBtn'
        }, {
            fn: 'onHint',
            event: 'tap',
            delegate: '#hintBtn'
        }],
        pageData: {}
    },

    applyPageData: function(config) {
        // cleanup missing questions
        var questions = config.game.question;
        for (var i = questions.length - 1; i >= 0; i--) {
            var question = questions[i];
            if (typeof question.text == 'undefined' || typeof question.answer == 'undefined') {
                questions.splice(i, 1);
                continue;
            }
        };

        return config;
    },

    updatePageData: function(newPageData, oldPageData) {
        var me = this,
            pText = '';

        me.query('#submitBtn')[0].setText(newPageData.btn.submit_btn);
        me.query('#hintBtn')[0].setText(newPageData.btn.hint_btn);

        me.query('#pageTitle')[0].setHtml(newPageData.title);


        if (newPageData.text.feedback_final_txt) {
            me.query('#finalFeedbackTitle')[0].setHtml(newPageData.text.feedback_final_txt);
        }

        me.query('#feedbackListHeader')[0].setHtml('<div class="feedbackheader spacer">&nbsp;</div><div class="feedbackheader yourresponse">' + newPageData.text.your_responsetitle_txt + '</div><div class="feedbackheader correctresponse">' + newPageData.text.correct_responsetitle_txt) + '</div>';

        if (newPageData.timed) {
            me.query('#timeLabel')[0].show();
        }

        // randomize questions
        if (newPageData.configuration.shuffle) {
            newPageData.game.question = me.randomizeArray(newPageData.game.question);
        }

        me.maxPoints = newPageData.game.question.length;
        ApplyMathJax(me.element.dom);
    },

    goToQuestion: function(questionNumber) {
        var me = this,
            pageData = me.getPageData(),
            inputText = me.down('#inputText'),
            questionData = pageData.game.question[questionNumber];

        if (questionNumber > pageData.game.question.length - 1) {
            me.onGameComplete();
            return;
        }

        me.currentQuestion = questionNumber;
        // clear value
        inputText.setValue();
        // add key up, enable submitBtn
        inputText.on('keyup', me.enableCheckBtn, me, {
            single: true
        });

        // set timer
        me.timeLeft = questionData.time;

        if (questionData.hint) {
            me.query('#hintBtn')[0].show();
        } else {
            me.query('#hintBtn')[0].hide();
        }

        // set ptext
        me.query('#pageText')[0].setPageData({
            pType: 'text',
            pText: {
                '#text': questionData.text
            }
        });

        me.timerStart();
    },

    goToNextQuestion: function() {
        var me = this;
        me.onHintContinue(); // if timer is running
        if (me.currentQuestion == me.maxPoints - 1) {
            me.onGameComplete();
        } else {
            me.goToQuestion(++me.currentQuestion);
        }
    },

    enableCheckBtn: function(e) {
        this.query('#submitBtn')[0].enable();
    },

    onSubmitAnswer: function(e) {
        var me = this,
            pageData = me.getPageData(),
            questionData = pageData.game.question[me.currentQuestion],
            inputText = me.query('#inputText')[0],
            guessString = '',
            answerString = '';
        me.query('#submitBtn')[0].disable();

        clearInterval(me.timer);

        // score
        guessString = inputText.getValue();
        questionData.response = guessString;

        answerString = questionData.answer + '';
        if (!pageData.configuration.caseSensitive) {
            guessString = guessString.toLowerCase();
            answerString = answerString.toLowerCase();
        }
        questionData.correct = (guessString == answerString);
        if (questionData.correct) {
            me.currentScore++;
            me.setScore();
        }

        // feedback
        if (pageData.timed) {
            me.goToNextQuestion();
        } else {
            me.onShowFeedback();
        }
    },

    // on hint
    onHint: function() {
        var me = this,
            pageData = me.getPageData(),
            questionData = pageData.game.question[me.currentQuestion];

        if (!me.hintPopup) {
            me.hintPopup = Ext.create('Ext.Panel', {
                xtype: 'container',
                itemId: 'popupInstructions',
                centered: true,
                hideOnMaskTap: true,
                modal: true,
                hidden: true,
                width: '80%',
                height: '80%',
                scrollable: 'vertical',
                layout: {
                    align: 'center',
                    pack: 'justify',
                    type: 'vbox'
                },
                cls: 'spin-instructions-popup',
                items: [{
                    xtype: 'titlebar',
                    docked: 'top',
                    title: pageData.btn.hint_btn
                }, {
                    xtype: 'container',
                    itemId: 'hintText',
                    width: '100%',
                    html: questionData.hint
                }, {
                    xtype: 'container',
                    docked: 'bottom',
                    padding: '8 4 4 4',
                    layout: {
                        align: 'center',
                        pack: 'center',
                        type: 'hbox'
                    },
                    items: [{
                        xtype: 'button',
                        text: pageData.btn.continue_btn,
                        itemId: 'startBtn',
                        ui: 'action'
                    }]
                }]
            });
            me.hintPopup.query('#startBtn')[0].on('tap', me.onHintContinue, me);
            Ext.getCmp('main').add(me.hintPopup);
        }
        me.hintPopup.query('#hintText')[0].setHtml(questionData.hint);
        me.hintPopup.show();
    },
    onHintContinue: function() {
        var me = this;
        if (me.hintPopup) {
            me.hintPopup.hide();
        }
    },

    onFeedbackSelect: function(list, record, eOpts) {
        var me = this;
        me.currentQuestion = list.getStore().indexOf(record);
        me.onShowFeedback();
    },
    // on Feedback
    onShowFeedback: function() {
        var me = this,
            pageData = me.getPageData(),
            questionData = pageData.game.question[me.currentQuestion];

        if (!me.feedbackPopup) {
            me.feedbackPopup = Ext.create('Ext.Panel', {
                xtype: 'container',
                itemId: 'popupInstructions',
                centered: true,
                modal: true,
                hidden: true,
                width: '90%',
                height: '90%',
                scrollable: 'vertical',
                layout: {
                    align: 'start',
                    pack: 'start',
                    type: 'vbox'
                },
                cls: 'wordgame-popup',
                items: [{
                    xtype: 'titlebar',
                    docked: 'top',
                    title: pageData.text.feedpopuptitle_txt
                }, {
                    xtype: 'container',
                    itemId: 'initialLabel',
                    cls: 'feedback-label',
                    html: pageData.text.feedpopupsubtitle_txt
                }, {
                    xtype: 'container',
                    itemId: 'initialText',
                    cls: 'feedback-text',
                    html: questionData.text
                }, {
                    xtype: 'container',
                    itemId: 'responseLabel',
                    cls: 'feedback-label',
                    html: pageData.text.your_responsetitle_txt
                }, {
                    xtype: 'container',
                    itemId: 'responseText',
                    cls: 'feedback-text',
                    html: questionData.response
                }, {
                    xtype: 'container',
                    itemId: 'correctLabel',
                    cls: 'feedback-label',
                    html: pageData.text.correct_responsetitle_txt
                }, {
                    xtype: 'container',
                    itemId: 'correctText',
                    cls: 'feedback-text',
                    html: questionData.answer
                }, {
                    xtype: 'container',
                    itemId: 'feedbackLabel',
                    cls: 'feedback-label',
                    html: pageData.text.feedpopuptitle_txt
                }, {
                    xtype: 'container',
                    itemId: 'feedbackText',
                    cls: 'feedback-text',
                    html: questionData.feedback
                }, {
                    xtype: 'container',
                    docked: 'bottom',
                    padding: '8 4 4 4',
                    layout: {
                        align: 'center',
                        pack: 'center',
                        type: 'hbox'
                    },
                    items: [{
                        xtype: 'button',
                        text: pageData.btn.close_btn,
                        itemId: 'closeBtn',
                        ui: 'action'
                    }]
                }]
            });
            me.feedbackPopup.query('#closeBtn')[0].on('tap', me.onFeedbackContinue, me);
            Ext.getCmp('main').add(me.feedbackPopup);
        }
        me.feedbackPopup.query('#initialText')[0].setHtml(questionData.text);
        me.feedbackPopup.query('#responseText')[0].setHtml(questionData.response);
        me.feedbackPopup.query('#correctText')[0].setHtml(questionData.answer);
        me.feedbackPopup.query('#feedbackText')[0].setHtml(questionData.feedback);
        me.feedbackPopup.show();
    },
    onFeedbackContinue: function() {
        var me = this,
            pageData = me.getPageData();

        if (!pageData.timed && me.gameState != 'complete') {
            me.goToNextQuestion();
        }

        me.feedbackPopup.hide();
    },


    onGameComplete: function() {
        var me = this,
            listData = me.getPageData().game.question;
        me.gameState = 'complete';

        me.down('#bottomBar').hide();
        if(listData.length > 0){
            me.down('#feedbackList').setData(listData);
        }
        me.setActiveItem(1);
    },



    // set score
    setScore: function() {
        var me = this;
        me.scoreLabel = me.scoreLabel || me.getPageData().text.score_txt;
        me.query('#scoreLabel')[0].setHtml('<span class="spin-score-label">' + me.scoreLabel + '</span> <span class="spin-score-count">' + me.currentScore + ' of ' + me.maxPoints + '</span>');
    },

    onInstructionContinue: function() {
        var me = this;
        me.instructionsPopup.query('#instructionsAudio')[0].pause();
        me.instructionsPopup.hide();

        if (me.gameState != 'complete') {
            me.goToQuestion(0);
            me.timerStart();
        }
    },
    onShowInstructions: function() {
        var me = this,
            pageData = me.getPageData(),
            audio = me.query('#audio')[0];
        if (!me.instructionsPopup) {
            me.instructionsPopup = Ext.create('Ext.Panel', {
                xtype: 'container',
                itemId: 'popupInstructions',
                centered: true,
                modal: true,
                hidden: true,
                width: '90%',
                height: '90%',
                scrollable: 'vertical',
                layout: {
                    align: 'center',
                    pack: 'justify',
                    type: 'vbox'
                },
                cls: 'spin-instructions-popup',
                items: [{
                    xtype: 'titlebar',
                    docked: 'top',
                    title: pageData.popInstruct.titleInst
                }, {
                    xtype: 'container',
                    html: pageData.popInstruct['#text']
                }, {
                    xtype: 'container',
                    docked: 'bottom',
                    layout: {
                        align: 'center',
                        pack: 'center',
                        type: 'hbox'
                    },
                    items: [{
                        xtype: 'audiobox',
                        itemId: 'instructionsAudio'
                    }, {
                        xtype: 'button',
                        text: pageData.popInstruct.startBTNTitle,
                        itemId: 'startBtn',
                        ui: 'action'
                    }]
                }]
            });
            me.instructionsPopup.query('#startBtn')[0].on('tap', me.onInstructionContinue, me);
            Ext.getCmp('main').add(me.instructionsPopup);
        }
        if (pageData.audioPath) {
            me.instructionsPopup.query('#instructionsAudio')[0].setMediaPath(pageData.audioPath.replace('https:', 'http:'));
        }
        me.instructionsPopup.show();
        if (me.gameState != 'complete') {
            me.gameState = 'paused';
        }
    },

    timerStart: function() {
        var me = this;
        me.gameState = 'running';
        clearInterval(me.timer);
        // Start Timer
        me.timer = setInterval(function() {
            if (me.gameState != 'running') {
                return;
            }
            if (me.timeLeft <= 0) {
                clearInterval(me.timer);
                me.goToNextQuestion();
                return;
            }
            me.timeLeft--;
            var timerLabel = me.query('#timeLabel')[0];
            if (timerLabel) {
                me.query('#timeLabel')[0].setHtml('<span class="spin-time">' + me.secondsToTime(me.timeLeft) + '</span>');
            }
        }, 1000);
    },

    secondsToTime: function(sec_num) {
        var hours = Math.floor(sec_num / 3600),
            minutes = Math.floor((sec_num - (hours * 3600)) / 60),
            seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        return ' ' + minutes + ':' + seconds;
    },


    reset: function() {
        var me = this;

        me.currentScore = 0;
        me.currentQuestion = 0;
        me.setScore();
        me.setActiveItem(0);
        me.query('#bottomBar')[0].show();
        // reset timer
        clearInterval(me.timer);
        me.gameState = '';
    },

    start: function() {
        var me = this;
        me.callParent(arguments);
        // show instructions, start time like in matching
        me.onShowInstructions();
        me.currentScore = 0;
        me.setScore();
    },
    close: function() {
        var me = this;
        me.reset();
        // close popups
        if (me.feedbackPopup) {
            me.feedbackPopup.hide();
        }
        me.instructionsPopup.query('#instructionsAudio')[0].pause();
        me.instructionsPopup.hide();
    }
});