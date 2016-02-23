Ext.define('Player.page.Survey', {
    extend: 'Player.page.Page',

    xtype: 'Survey',

    requires: ['Player.page.components.TextArea',
        'Player.page.components.SurveyRadio',
        'Player.page.components.FormPopup',
        'Player.page.components.AudioBox'
    ],

    config: {
        cls: 'survey',
        layout: {
            pack: 'start',
            type: 'vbox',
            align: 'stretch'
        },
        styleHtmlContent: true,
        scrollable: false,
        height: '100%',
        recordId: '',
        items: [{
            xtype: 'formpanel',
            itemId: 'questionForm',
            cls: 'form-panel',
            flex: '1',
            scrollable: {
                direction: 'vertical',
                directionLock: true
            },
            items: [{
                xtype: 'container',
                html: 'Page Title',
                itemId: 'pageTitle',
                cls: 'page-title',
                width: '100%'
            }, {
                xtype: 'container',
                html: 'Lorem ipsum dolor sit amet',
                cls: 'page-content',
                itemId: 'pageText'
            }, {
                xtype: 'fieldset',
                itemId: 'questionFields',
                cls: 'question-fields'
            }],
            maxWidth: Ext.os.is.Phone ? 300 : null
        }, {
            xtype: 'container',
            docked: 'bottom',
            layout: {
                type: 'hbox',
                pack: 'end'
            },
            items: [{
                xtype: 'button',
                itemId: 'submitBtn',
                text: 'Submit',
                cls: 'checkanswer',
                margin: '10 10 10 10',
                disabled: true,
                ui: 'checkanswer'
            }]
        }],
        pageData: {},
        listeners: [{
            fn: 'onSubmit',
            event: 'tap',
            delegate: '#submitBtn'
        }, {
            fn: 'onSelect',
            event: 'select',
            delegate: '.surveyradio'
        }, {
            fn: 'onSelect',
            event: 'select',
            delegate: '.scrolltextarea'
        }]
    },

    updatePageData: function(newPageData, oldPageData) {
        var me = this,
            questions = newPageData.ask,
            questionFields = me.query('#questionFields')[0];

        // Set Title
        me.query('#pageTitle')[0].setHtml(newPageData.course.introTitle);

        // Set Text
        me.query('#pageText')[0].setHtml(newPageData.course['#text']);

        for (var i = 0, ln = questions.length; i < ln; i++) {
            var question = questions[i];
            if (!question.active) {
                continue;
            }

            questionFields.add({
                xtype: 'container',
                cls: 'question-text',
                html: question.question
            });

            switch (question.type) {
                case 'text':
                    questionFields.add({
                        xtype: 'scrolltextarea',
                        questionId: 'question' + i,
                        name: 'question' + i,
                        cls: ['question-field', 'text'],
                        placeHolder: 'Type Response Here',
                        answered: false,
                        height: 120
                    });
                    break;
                case 'cb':
                    questionFields.add({
                        xtype: 'surveyradio',
                        questionId: 'question' + i,
                        cls: ['question-field', 'radio'],
                        width: '100%',
                        columns: newPageData.col
                    });
                    break;
            }
        };
        var submitBtn = me.query('#submitBtn')[0];
        submitBtn.setText(newPageData.btn.submit);

        ApplyMathJax(me.element.dom);
    },

    onSelect: function(event, value, eOpts) {
        var me = this,
            unanswered = me.query('[answered=false]');

        me.query('#submitBtn')[0].setDisabled(unanswered.length !== 0);
    },

    onSubmit: function() {
        var me = this
        pageData = me.getPageData();

        if (pageData.popup.requirepersonalinfo) {
            me.onShowFeedBack();
        } else {
            me.onSubmitFeedback();
        }
    },

    onShowInstructions: function() {
        var me = this,
            pageData = me.getPageData(),
            audio = me.query('#audio')[0];
        if (!me.instructionsPopup) {
            me.instructionsPopup = Ext.create('Ext.Panel', {

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
                cls: 'survey-instructions-popup',
                items: [{
                    xtype: 'titlebar',
                    docked: 'top',
                    cls: (Ext.os.is.Phone) ? 'isphone' : 'tablet',
                    title: pageData.intro.introTitle
                }, {
                    xtype: 'container',
                    html: pageData.intro['#text']
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
                        itemId: 'instructionsAudio',
                        margin: '10 10 10 10'
                    }, {
                        xtype: 'button',
                        text: pageData.btn.start,
                        itemId: 'continueBtn',
                        ui: 'action'
                    }]
                }]
            });
            me.instructionsPopup.query('#continueBtn')[0].on('tap', me.onInstructionContinue, me);

            Ext.getCmp('main').add(me.instructionsPopup);
        }
        me.instructionsPopup.query('#instructionsAudio')[0].setMediaPath(pageData.audioPath.replace('https:', 'http:'));
        me.instructionsPopup.show();
    },
    onInstructionContinue: function() {
        this.instructionsPopup.query('#instructionsAudio')[0].pause();
        this.instructionsPopup.hide();
    },

    onShowFeedBack: function() {
        var me = this,
            pageData = me.getPageData();
        if (!me.feedbackPopup) {
            me.feedbackPopup = Ext.create('Player.page.components.FormPopup', {
                hideOnMaskTap: true,
                cls: 'feedbackPopup',
                formItems: [{
                    xtype: 'textfield',
                    name: 'name',
                    cls: 'survey-form',
                    required: pageData.popup.namerequired,
                    label: 'Name'
                }, {
                    xtype: 'emailfield',
                    name: 'email',
                    cls: 'survey-form',
                    required: pageData.popup.emailrequired,
                    label: 'Email'
                }, {
                    xtype: 'textfield',
                    name: 'optional',
                    cls: 'survey-form',
                    required: pageData.popup.optionfieldrequired,
                    label: pageData.popup.optionfieldlabel
                }]
            });

            me.feedbackPopup.on('submitform', me.onSubmitFeedback, me);

            me.feedbackPopup.query('#submitBtn')[0].setText(pageData.btn.submit);

            me.feedbackPopup.query('#titleBar')[0].setTitle(pageData.course.introTitle);
            me.feedbackPopup.query('#instructions')[0].setHtml(pageData.popup['#text']);

            Ext.getCmp('main').add(me.feedbackPopup);
        }

        me.feedbackPopup.show();
    },
    onSubmitFeedback: function(event, values) {
        var me = this,
            pageData = me.getPageData(),
            lmsStudentName,
            cr = "<br/>",
            questions = pageData.ask,
            resultValues = me.query('#questionForm')[0].getValues(),
            emailBody = '',
            emailFrom = 'survey@litmosauthor.com',
            date = new Date();

        if (me.feedbackPopup) {
            me.feedbackPopup.hide();
        }
        // Get name from lms
        if (pageData.popup.retrieveLMSname) {
            try {
                lmsStudentName = SCORM.GetStudentName();
            } catch (e) {}
        }

        if (pageData.popup.requirepersonalinfo) {
            emailFrom = values.email;
            emailBody += "Survey data submitted by: " + lmsStudentName + " " + values.name + " " + emailFrom + " " + values.optional + cr;
        }

        for (var i = 0, ln = questions.length; i < ln; i++) {
            var question = questions[i],
                response = resultValues['question' + i];
            if (!question.active) {
                continue;
            }

            emailBody += 'QUESTION ' + (i + 1) + ":" + cr;
            emailBody += question.question + cr + cr;
            emailBody += "ANSWER:" + cr;
            emailBody += response + cr + cr;
            emailBody += "--------------------------------------" + cr;
        }
        emailBody += "Date Completed: " + date.toLocaleDateString();

        me.sendResponse(emailFrom, pageData.configuration.email, pageData.configuration.emailSubject, emailBody);
    },

    sendResponse: function(from, to, subject, body) {
        var me = this,
            pageData = me.getPageData(),
            url = 'https://demo.litmosauthor.com/email/sendEmail.php',
            nowDate = new Date(),
            compDate = (nowDate.getMonth() + 1) + "/" + nowDate.getDate() + "/" + nowDate.getFullYear(),
            idag = "4/5/20106-7-0910/10/2011" + compDate + "3/4/0911/12/20091-1-12";

        if (pageData.configuration.url) {
            url = pageData.configuration.url;
        }

        Ext.Ajax.setUseDefaultXhrHeader(false);
        var result = Ext.Ajax.request({
            url: url,
            method: 'POST',
            disableCaching: false,
            useDefaultXhrHeader: false,
            timeout: 45000,
            headers: {
                "Content-Type": "text/plain"
            },
            params: {
                'email-from': from,
                'email-to': to,
                'email-subject': subject,
                'email-body': body,
                'idag': idag
            },
            success: function(response) {
                var responseObj;
                try {
                    responseObj = JSON.parse(response.responseText);
                } catch (e) {
                    console.error("Email, invalid response:" + response.responseText);
                    Ext.Msg.alert("Could Not Send Email", "Please try again later");
                }
                if (responseObj && responseObj.success) {
                    // successful send
                    me.disableSruvey();
                    Ext.Msg.alert("Email Sent", "Thank you. Your response has been received.");
                } else {
                    if (responseObj && responseObj.message) {
                        Ext.Msg.alert("Could Not Send Email", responseObj.message);
                    } else {
                        Ext.Msg.alert("Could Not Send Email", "Please try again later");
                        console.error("Email didn't send:" + response.responseText);
                    }
                }
            },
            failure: function(response) {
                Ext.Msg.alert("Failed to send email", "Please try again later");
            }
        });
    },

    disableSruvey: function() {
        var me = this,
            questionFields = me.query('#questionFields')[0];

        questionFields.items.each(function(item) {
            item.disable();
        }, me);
        me.query('#submitBtn')[0].setDisabled(true);
    },
    enableSurvey: function() {
        var me = this,
            questionFields = me.query('#questionFields')[0];

        questionFields.items.each(function(item) {
            item.enable();
        }, me);
        me.query('#submitBtn')[0].setDisabled(true);
    },

    start: function() {
        var me = this;
        me.callParent(arguments);
        me.onShowInstructions();
        me.enableSurvey();
    },
    close: function() {
        var me = this;
        me.onInstructionContinue();
        if (me.feedbackPopup) {
            me.feedbackPopup.hide();
        }
    },
    initialize: function() {
        this.callParent(arguments);
    }
});