Ext.define('Player.page.SpinTheWheel', {
    extend: 'Player.page.Page',

    requires: ['Player.page.components.AudioBox',
        'Player.page.components.TextImagePopup'
    ],

    alias: ['widget.SpinTheWheel'],

    config: {
        layout: 'card',
        styleHtmlContent: true,
        cls: ['spinthewheel', 'question'],
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        recordId: '',
        numberOfSlices: 6,
        baseSize: 300,
        items: [{
            xtype: 'container',
            layout: {
                align: 'center',
                pack: 'center',
                type: 'vbox'
            },
            items: [{
                xtype: 'container',
                itemId: 'wheelScreen',
                cls: 'wheelscreen',
                items: [{
                    xtype: 'container',
                    height: 150,
                    width: 150,
                    cls: 'spin-btn-back'
                }, {
                    xtype: 'button',
                    height: 120,
                    width: 120,
                    ui: 'action-round',
                    itemId: 'spinButton',
                    cls: 'spin-btn',
                    text: 'SPIN'
                }, {
                    xtype: 'audio',
                    hidden: true,
                    itemId: 'spinAudio',
                    preload: 'none',
                    loop: true,
                    url: g_styleRoot+'/resources/audio/spin.wav',
                    enableControls: false
                }]
            }]
        }, {
            xtype: 'formpanel',
            itemId: 'questionScreen',
            layout: {
                align: 'center',
                type: 'vbox'
            },
            scrollable: {
                direction: 'vertical',
                directionLock: true
            },
            items: [{
                xtype: 'container',
                html: 'Question Text Goes here....',
                itemId: 'questionText',
                cls: 'questiontext',
                maxWidth: '100%',
                minHeight: '100px',
                minWidth: '250px',
                items: [{
                    xtype: 'container',
                    html: 'Category:',
                    docked: 'top',
                    itemId: 'categoryText',
                    cls: 'categorytext'
                }, {
                    xtype: 'audiobox',
                    docked: 'left',
                    itemId: 'questionAudio',
                    margin: '0 8 0 8'
                }]
            }, {
                xtype: 'radiofield',
                label: '',
                name: 'distractor',
                value: 'A',
                width: '75%',
                minHeight: 57,
                labelWidth: '90%',
                labelWrap: true,
                correct: false,
                letter: 'A',
                styleHtmlContent: true,
                hidden: true,
                labelAlign: 'right'
            }, {
                xtype: 'radiofield',
                label: '',
                name: 'distractor',
                value: 'B',
                width: '75%',
                minHeight: 57,
                labelWidth: '90%',
                labelWrap: true,
                correct: false,
                letter: 'B',
                styleHtmlContent: true,
                hidden: true,
                labelAlign: 'right'
            }, {
                xtype: 'radiofield',
                label: '',
                name: 'distractor',
                value: 'C',
                width: '75%',
                minHeight: 57,
                labelWidth: '90%',
                labelWrap: true,
                correct: false,
                letter: 'C',
                styleHtmlContent: true,
                hidden: true,
                labelAlign: 'right'
            }, {
                xtype: 'radiofield',
                label: '',
                name: 'distractor',
                value: 'D',
                width: '75%',
                minHeight: 57,
                labelWidth: '90%',
                labelWrap: true,
                correct: false,
                letter: 'D',
                styleHtmlContent: true,
                hidden: true,
                labelAlign: 'right'
            }, {
                xtype: 'button',
                itemId: 'submitAnswerBtn',
                margin: '20 0 0 0',
                disabled: true,
                text: 'Submit Answer'
            }, {
                xtype: 'button',
                itemId: 'giveUpBtn',
                margin: '10 0 0 0',
                hidden: true,
                text: 'Give Up'
            }, {
                xtype: 'spacer',
                height: 20
            }]
        }, {
            xtype: 'container',
            itemId: 'reviewScreen',
            layout: 'fit',
            items: [{
                xtype: 'dataview',
                itemId: 'reviewList',
                cls: 'reviewlist',
                scrollable: {
                    direction: 'vertical',
                    directionLock: true
                },
                store: {
                    fields: ['questionNum',
                        'totalQuestions',
                        'questionText',
                        'options',
                        'feedback',
                        'timeSpent'
                    ],
                    data: []
                },
                itemTpl: [
                    '<div>',
                    '<div class="spin-review-questionhead">Question {questionNum} of {totalQuestions}</div>',
                    '<div class="spin-review-questiontext">{questionText}</div>',
                    '<div class="spin-review-options">',
                    '<tpl for="options">',
                    '<tpl if="correct"><div class="spin-review-correct">C</div>',
                    '<tpl elseif="!correct && guessed"><div class="spin-review-incorrect">X</div>',
                    '<tpl else><div class="spin-review-none">&nbsp;</div>',
                    '</tpl>',
                    '<div class="spin-review-option">{letter}: {#text}</div><br/>',
                    '</tpl>',
                    '</div>',
                    '<div class="spin-review-feedbackarea">',
                    '<div class="spin-review-feedback">{feedback}</div>',
                    '<div class="spin-review-time"><div class="spin-review-timespent-label">Time Spent on Question:</div><div class="spin-review-timespent">{timeSpent}</div></div>',
                    '</div>',
                    '</div>'
                ]
            }]
        }, {
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
                html: '<span class="spin-time">00:00</span>'
            }]
        }],
        listeners: [{
            fn: 'onAnswerSelect',
            event: 'check',
            delegate: '.radiofield'
        }, {
            fn: 'onShowInstructions',
            event: 'tap',
            delegate: '#helpBtn'
        }, {
            fn: 'onSubmitAnswer',
            event: 'tap',
            delegate: '#submitAnswerBtn'
        }, {
            fn: 'onGiveUp',
            event: 'tap',
            delegate: '#giveUpBtn'
        }, {
            fn: 'onSpin',
            event: 'tap',
            delegate: '#spinButton'
        }],
        pageData: {}
    },

    applyPageData: function(config) {
        return this.cleanupCategories(config);
    },
    cleanupCategories: function(config) {
        var me = this,
            categories = config.category;
            //debugger;
        // remove unpupulate categories
        for (var i = categories.length - 1; i >= 0; i--) {
            var category = categories[i],
                questions = category.question,
                removeCategory = true;
            // remove extra questions
            for (var j = questions.length - 1; j >= 0; j--) {
                var question = questions[j],
                    options = question.option,
                    removeQuestion = true;
                // Yes, I know active is backwards, that's because the flash is backwards. It should be "hidden", not "active"
                if (!question.active && typeof question.text != 'undefined' && question.text['#text']) {
                    for (var k = options.length - 1; k >= 0; k--) {
                        // remove extra options
                        var option = options[k];
                        if (typeof option['#text'] == 'undefined') {
                            options.splice(k, 1);
                        } else {
                            removeQuestion = false;
                        }
                    };
                    removeCategory = false;
                    question._i = j;
                } else {
                    removeQuestion = true;
                }
                if (removeQuestion) {
                    questions.splice(j, 1);
                }
            };
            if (removeCategory) {
                categories.splice(i, 1);
            }
        };
        // randomize categories
        if (config.configuration.shuffle_category) {
            config.category = me.randomizeArray(config.category);
        }
        me.setNumberOfSlices(categories.length);
        return config;
    },

    updatePageData: function(newPageData, oldPageData) {
        var me = this,
            pText = '',
            wheelScreen = me.query('#wheelScreen')[0],
            numberOfSlices = me.getNumberOfSlices(),
            degrees = Math.ceil(360 / numberOfSlices),
            wheelHtml = '';

        me.query('#spinButton')[0].setText(newPageData.btn.spin_btn);
        me.query('#giveUpBtn')[0].setText(newPageData.btn.give_btn);
        me.query('#submitAnswerBtn')[0].setText(newPageData.btn.submit_btn);

        me.query('#scoreLabel')[0].setHtml('<span class="spin-score-label">Score</span> <span class="spin-score-count">0 of ' + (newPageData.configuration.questions * newPageData.configuration.points) + '</span>');

        // Create Wheel
        wheelHtml += '<div class="pieContainer" id="pieContainer">';
        for (var i = 0; i < numberOfSlices; i++) {
            var degreesOffset = i * degrees,
                category = newPageData.category[i];
            wheelHtml += '<div id="pie' + i + '" class="pie" style="-webkit-transform: rotate(' + degreesOffset + 'deg); transform:rotate(' + degreesOffset + 'deg);" data-start="' + degreesOffset + '" data-value="' + degrees + '"></div>';

            //var widthX            
            var categoryDegree = (degrees * ((i % numberOfSlices) + .5) - 90),
                categoryLeft = (250 + Math.cos(categoryDegree * Math.PI / 180) * 200),
                categoryTop = (300 + Math.sin(categoryDegree * Math.PI / 180) * 200);

            wheelHtml += '<div id="categoryLabel' + i + '" style="left:' + categoryLeft + 'px; top:' + categoryTop + 'px" class="category-label">' + category.catTitle + '</div>';
        };
        wheelHtml += '<img id="spinArrow" class="spinthewheel-arrow" src="'+g_styleRoot+'resources/images/SpinTheWheel/arrow.png"/>' + '</div>';
        wheelScreen.setHtml(wheelHtml);

        // init selection
        me.currentPie = 0;
        me.highlightWedge(true);
        me.questionsAnswered = 0;
        me.currentPoints = 0;
        me.answerOrder = [];

        ApplyMathJax(me.element.dom);
        //me.setColors();
        me.resize();
    },
    setColors: function() {
        var me = this,
            colorData = me.getPageData()
            console.warn("color data is broken in Mobilize.php. Need to convert hex value correctly (0x0000FF)");
    },
    onInstructionContinue: function() {
        this.instructionsPopup.query('#instructionsAudio')[0].pause();
        this.instructionsPopup.hide();
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
                    html: '<br/>Instructions:<br/>' + pageData.instruction['#text']
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
                        text: pageData.btn.continue_btn,
                        itemId: 'continueBtn',
                        ui: 'action'
                    }]
                }]
            });
            me.instructionsPopup.query('#continueBtn')[0].on('tap', me.onInstructionContinue, me);
            Ext.getCmp('main').add(me.instructionsPopup);
        }
        if(pageData.audioPath){
            me.instructionsPopup.query('#instructionsAudio')[0].setMediaPath(pageData.audioPath.replace('https:', 'http:'));
        }
        me.instructionsPopup.show();
    },
    getCurrentPie: function() {
        var me = this,
            numberOfSlices = me.getNumberOfSlices(),
            pie = me.currentPie % numberOfSlices;
        if (pie < 0) {
            pie = numberOfSlices + pie;
        }
        return pie;
    },
    onSpin: function(button) {
        var me = this,
            //speed = Ext.os.is.Android?500:200,
            spinAudio = me.query('#spinAudio')[0],
            speed = 500,
            numberOfSlices = me.getNumberOfSlices(),
            number = Math.floor((Math.random() * numberOfSlices * 2) + numberOfSlices),
            direction = Math.floor((Math.random() * 2)),
            counter = 1,
            pie = me.getCurrentPie(),
            spintimer;

        button.disable();
        
        spinAudio.play();

        me.direction = direction;

        try{
            me.element.query('#pie' + pie)[0].classList.remove('highlight');
        }catch(e){}

        spintimer = setInterval(function() {
            if (counter >= number) {
                me.highlightWedge(true);
                var loaded = me.loadNextQuestion();
                if (loaded) {
                    clearInterval(spintimer);
                    spinAudio.pause();
                    Ext.defer(function() {

                        me.spinComplete();
                    }, 1000);
                    return;
                }
            }
            counter++;
            me.onRight.call(me);
            /*
            // spin both directions: note: remove animation in css first
            if (me.direction == 0) {
                me.onLeft.call(me);
            } else {
                me.onRight.call(me);
            }*/
        }, speed);
    },
    onLeft: function() {
        var me = this;
        me.currentPie--;
        me.highlightWedge(false);
    },
    onRight: function() {
        var me = this;
        me.currentPie++;
        me.highlightWedge(false);
    },
    highlightWedge: function(highlight) {
        var me = this,
            wedge,
            arr = me.element.query('#spinArrow')[0],
            numberOfSlices = me.getNumberOfSlices(),
            degrees = Math.ceil(360 / numberOfSlices),
            pie = me.getCurrentPie(),
            degreesOffset;

        degreesOffset = (degrees * (me.currentPie + .5) - 90);

        arr.style.setProperty('-webkit-transform', 'rotate(' + degreesOffset + 'deg)');
        if (highlight) {
            for (var i = 0; i < numberOfSlices; i++) {
                wedge = me.element.query('#pie' + i)[0];
                if (i == pie) {
                    wedge.classList.add('highlight');
                } else {
                    wedge.classList.remove('highlight');
                }
            };
        }
    },

    loadNextQuestion: function() {
        var me = this,
            pageData = me.getPageData(),
            pie = me.getCurrentPie(),
            category = pageData.category[pie],
            questions = category.question,
            distractors,
            options, audio,
            alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            unansweredPool = [];

        for (var i = questions.length - 1; i >= 0; i--) {
            var question = questions[i];
            if (!question.answered) {
                unansweredPool.push(i);
            }
        };
        if (unansweredPool.length == 0) {
            return false;
        }
        // pick random question
        unansweredPool = me.randomizeArray(unansweredPool);
        me.currentQuestion = questions[unansweredPool[0]];

        // set Category
        me.query('#categoryText')[0].setHtml(category.catTitle);

        // set question text
        me.query('#questionText')[0].setHtml(me.currentQuestion.text['#text']);

        // set distractors
        distractors = me.query('.radiofield');

        if (pageData.configuration.shuffle_option) {
            options = me.randomizeArray(me.currentQuestion.option);
        } else {
            options = me.currentQuestion.option;
        }
        me.currentQuestion.answerString = '';
        for (var i = 0, ln = options.length; i < ln; i++) {
            var option = options[i],
                distractor = distractors[i];
            distractor.config.correct = option.correct;
            distractor.setLabel(option['#text']);
            distractor.setChecked(false);
            distractor.show();
            option.letter = alphabet.charAt(i);
            if (option.correct) {
                me.currentQuestion.answerString += alphabet.charAt(i);
            }
        };

        // set timer
        me.timeLeft = me.currentQuestion.time;

        // set Audio
        me.query('#questionAudio')[0].setMediaPath(me.currentQuestion.audio.replace('https:', 'http:'));

        return true;
    },

    spinComplete: function() {
        var me = this;
        // Show Question
        me.setActiveItem(1);
        // Start Timer
        me.timer = setInterval(function() {
            if (me.timeLeft <= 0) {
                clearInterval(me.timer);
                me.onSubmitAnswer();
                return;
            }
            me.timeLeft--;
            me.query('#timeLabel')[0].setHtml('<span class="spin-time">' + me.secondsToTime(me.timeLeft) + '</span>');
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


    onAnswerSelect: function(e, f, g) {
        var me = this;
        me.query('#submitAnswerBtn')[0].enable();
    },

    onSubmitAnswer: function() {
        var me = this,
            distractors = me.query('.radiofield'),
            pageData = me.getPageData(),
            categories = pageData.category,
            audio = me.query('#questionAudio')[0],
            correctAnswer = '',
            guessString = '';

        clearInterval(me.timer);

        // stop audio
        audio.pause();
        audio.setMediaPath('');

        me.query('#submitAnswerBtn')[0].disable();

        // show feedback
        me.onShowFeedBack();

        // when close feedback, goto spin
        me.currentQuestion.answered = true;

        // enable Give Up button        
        me.questionsAnswered++;
        if (me.questionsAnswered >= me.getPageData().configuration.beforeGiveUp) {
            me.query('#giveUpBtn')[0].show();
        }

        // time spent
        me.query('#timeLabel')[0].setHtml('<span class="spin-time">' + me.secondsToTime(0) + '</span>');
        me.currentQuestion.timeSpent = me.currentQuestion.time - me.timeLeft;

        // store question order
        me.answerOrder.push({
            c: me.getCurrentPie(),
            q: me.currentQuestion._i
        });

        // set guess/correctness
        for (var i = distractors.length - 1; i >= 0; i--) {
            var distractor = distractors[i],
                option = me.currentQuestion.option[i];
            if (distractor && option) {
                if (distractor.getChecked()) {
                    guessString += distractor.config.letter;
                    option.guessed = true;
                } else {
                    option.guessed = false;
                }
                distractor.hide();
            }
        };

        me.currentQuestion.guessString = guessString;
        if (guessString != '' && me.currentQuestion.answerString.search(guessString) >= 0) {
            me.currentQuestion.blnCorrect = true;
            me.currentPoints += pageData.configuration.points;
        } else {
            me.currentQuestion.blnCorrect = false;
        }

        // Set Score
        me.query('#scoreLabel')[0].setHtml('<span class="spin-score-label">Score</span> <span class="spin-score-count">' + me.currentPoints + ' of ' + (pageData.configuration.questions * pageData.configuration.points) + '</span>');

        // test complete
        // ask limited questions
        if (me.questionsAnswered >= pageData.configuration.questions) {
            me.allCategoriesComplete = true;
            me.onReview();
            return;
        }
        return;
        // Ask every question
        /*var allCategoriesComplete = true;
        for (var i = categories.length - 1; i >= 0; i--) {
            var category = categories[i],
                questions = category.question,
                allQuestionsComplete = true;
            for (var j = questions.length - 1; j >= 0; j--) {
                var question = questions[j];
                if (!question.answered) {
                    allQuestionsComplete = false;
                    break;
                }
            };
            category.complete = allQuestionsComplete;
            if (!allQuestionsComplete) {
                allCategoriesComplete = false;
                break;
            }
        };
        me.allCategoriesComplete = allCategoriesComplete;
        if (allCategoriesComplete) {
            me.onReview();
        }*/

    },

    onShowFeedBack: function() {
        var me = this,
            pageData = me.getPageData();
        if (!me.feedbackPopup) {
            me.feedbackPopup = Ext.create('Player.page.components.TextImagePopup');

            var closeBtn = me.feedbackPopup.query('#closeBtn')[0];
            closeBtn.setText(pageData.btn.continue_btn);
            closeBtn.on('tap', me.onFeedbackContinue, me);
            me.feedbackPopup.query('#titleBar')[0].setTitle(pageData.text.feedback_title);

            Ext.getCmp('main').add(me.feedbackPopup);
        }

        me.feedbackPopup.setPageData({
            pType: 'Image',
            imageFile: me.currentQuestion.image,
            imageWidth: 40,
            pText: me.currentQuestion.feedback_text,
            imgPos: 'left'
        });

        me.feedbackPopup.show();
    },

    onFeedbackContinue: function() {
        var me = this;
        if (!me.allCategoriesComplete) {
            me.query('#spinButton')[0].enable();
            me.setActiveItem(0);
        }
        me.feedbackPopup.hide();
    },

    onGiveUp: function() {
        var me = this,
            pageData = me.getPageData();
        Ext.Msg.confirm(pageData.givePopup.titleInst, pageData.givePopup['#text'], function(response) {
            if (response == 'yes') {
                me.onReview();
            }
        }, me);
    },

    onReview: function() {
        var me = this,
            pageData = me.getPageData(),
            categories = pageData.category,
            reviewList = me.query('#reviewList')[0],
            maxScore = (pageData.configuration.questions * pageData.configuration.points),
            scormResponses = [],
            scormCorrectResponses = [],
            reviewData = [];

        clearInterval(me.timer);

        me.query('#scoreLabel')[0].setHtml('<span class="spin-score-label">' + pageData.text.final_score + '</span> <span class="spin-score-count">' + me.currentPoints + ' of ' + maxScore + '</span>');
        me.query('#timeLabel')[0].hide();
        me.query('#helpBtn')[0].hide();

        var questionCounter = 1;
        for (var i = 0, ln = me.answerOrder.length; i < ln; i++) {
            var questionPath = me.answerOrder[i],
                question = categories[questionPath.c].question[questionPath.q];

            reviewData.push({
                questionNum: questionCounter++,
                totalQuestions: me.questionsAnswered,
                questionText: question.text['#text'],
                options: question.option,
                feedback: question.feedback_text['#text'],
                timeSpent: me.secondsToTime(question.timeSpent)
            });
            // record scorm questions
            if (pageData.trackInteraction) {
                try {
                    for (var j = 0, ln = question.option.length; j < ln; j++) {
                        var tempResponse = question.option[j];
                        if (tempResponse.correct) {
                            scormCorrectResponses.push(SCORM.CreateResponseIdentifier(tempResponse.letter, tempResponse['#text']));
                        }
                        if (tempResponse.guessed) {
                            scormResponses.push(SCORM.CreateResponseIdentifier(tempResponse.letterguessString, tempResponse['#text']));
                        }
                    }
                    var success = SCORM.RecordMultipleChoiceInteraction(question.id, scormResponses, question.blnCorrect, scormCorrectResponses, question.text['#text'], 1, questionData.timeSpent, question.id);
                } catch (e) {}
            }
        };

        // set and show data
        me.query('#reviewList')[0].getStore().setData(reviewData);
        me.setActiveItem(2);

        // mark complete if pass option???
        this.fireEvent('page-complete');

        // SCORM score
        if (pageData.recordScore) {
            try {
                var success = SCORM.SetScore((me.currentPoints / maxScore), maxScore, 0);
            } catch (e) {}
        }
    },

    reset: function() {
        var me = this,
            pageData = me.getPageData(),
            categories = pageData.category;

        clearInterval(me.timer);

        me.query('#giveUpBtn')[0].hide();
        me.query('#submitAnswerBtn')[0].disable();
        me.currentPie = 0;
        me.highlightWedge(true);
        me.questionsAnswered = 0;
        me.currentPoints = 0;
        me.answerOrder = [];
        me.setActiveItem(0);
        me.allCategoriesComplete = false;
        me.query('#spinButton')[0].enable();
        me.query('#scoreLabel')[0].setHtml('<span class="spin-score-label">Score</span> <span class="spin-score-count">0 of ' + (pageData.configuration.questions * pageData.configuration.points) + '</span>');
        me.query('#timeLabel')[0].show();
        me.query('#helpBtn')[0].show();
        me.query('#timeLabel')[0].setHtml('<span class="spin-time">' + me.secondsToTime(0) + '</span>');
        for (var i = categories.length - 1; i >= 0; i--) {
            var category = categories[i],
                questions = category.question;
            for (var j = questions.length - 1; j >= 0; j--) {
                var question = questions[j];
                question.answered = false;
            };
        };
    },

    resize: function() {
        var me = this,
            mp = Ext.getCmp('mainPages'),
            vlpContainer = me.query('#wheelScreen')[0],
            mpWidth = mp.element.dom.clientWidth,
            mpHeight = mp.element.dom.clientHeight - 90,
            bWidth = 600,
            bHeight = 600,
            scaleX = 1,
            scaleY = 1,
            scale = 1.0;

        scaleX = mpWidth / bWidth;
        scaleY = mpHeight / bHeight;

        scale = (scaleX < scaleY) ? scaleX : scaleY;
        if (scale > 1) {
            scale = 1.0;
        }

        vlpContainer.element.dom.style.setProperty('-webkit-transform', 'scale(' + scale + ')');
        vlpContainer.element.dom.style.setProperty('-webkit-transform-origin', '0 0');
    },
    start: function() {
        var me = this;
        me.callParent(arguments);

        me.onShowInstructions();
    },
    close: function() {
        var me = this;
        me.reset();
        // close popups
        if (me.feedbackPopup) {
            me.feedbackPopup.hide();
        }
        me.query('#questionAudio')[0].pause();
        me.instructionsPopup.query('#instructionsAudio')[0].pause();
        me.instructionsPopup.hide();
    },

    initialize: function() {
        this.callParent(arguments);
        var me = this,
            distractors = me.query('.radiofield');
        for (var i = distractors.length - 1; i >= 0; i--) {
            var distractor = distractors[i];
            distractor.element.on({
                tap: function(e) {
                    var me = this;
                    if (this.getDisabled()) {
                        return;
                    }
                    me.setChecked(true);
                    me.fireEvent('check', me, e);
                },
                scope: distractor
            });
        };
    }
});