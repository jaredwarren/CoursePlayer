Ext.define('Player.page.questions.review.YN', {
    extend: 'Player.page.questions.review.ReviewQuestion',

    alias: ['widget.reviewYN'],

    config: {
        layout: {
            type: 'vbox'
        },
        questionRecord: {},
        questionNumber: 0,
        questionsToAsk: 0,
        blnCorrect: false,
        items: [{
            xtype: 'panel',
            html: 'Question 0 of 0 - Correct',
            itemId: 'questonNumberText'
        }, {
            xtype: 'panel',
            html: 'Question Text Goes here....',
            padding: '0 0 4 0',
            styleHtmlContent: true,
            cls: 'questionText',
            itemId: 'questionText'
        }, {
            xtype: 'panel',
            html: Lang.review.Your_Answers_Were
        }, {
            xtype: 'spacer',
            height: 10,
            itemId: 'distractorStart'
        },
        // Distractors go here....
        {
            xtype: 'spacer'
        }]
    },

    updateQuestionRecord: function(newRecord, oldRecord) {
        var me = this,
            distractorStartIndex = me.indexOf(me.getComponent('distractorStart')) + 1,
            distractorsList, correctResponse = [],
            newPageData = newRecord.raw,
            correctResponses = newRecord.data.correctResponse,
            responses = newRecord.data.response,
            response,
            alphabet = ['A', 'B'];
            //applied code
            if(correctResponses)
            {
            correctResponses = 'Yes';
            }
            else
            {
            correctResponses = 'No';
            }
            //applied code
//        me.callParent(arguments);
        // Add distractors
        distractorsList = [{
            "#text": 'Yes'
        }, {
            "#text": 'No'
        }];

        for (var i = 0, ln = distractorsList.length; i < ln; i++) {
            var distractorData = distractorsList[i];
            if (!distractorData) {
                continue;
            }
            letter = alphabet.shift();

            console.log("cr:"+correctResponses+", res:"+responses+", i:"+distractorData['#text']);
            
            if (correctResponses === responses && (distractorData['#text'] == correctResponses)) {
                response = '<div style="width:16px; color: green; float: left;">'+Lang.review.C+'</div>';
            } else if (distractorData['#text'] == responses) {
                response = '<div style="width:16px; color: red; float: left;">'+Lang.review.X+'</div>';
            } else {
                response = '<div style="width:16px; float: left;">'+Lang.review.N+'</div>';
            }

            var distractorCheckbox = Ext.create('Ext.Panel', {
                html: response + ' ' + letter + '. ' + distractorData['#text'],
                styleHtmlContent: false
            });

            distractorCheckbox = me.insert(distractorStartIndex++, distractorCheckbox);
        }

        if(!newRecord.data.blnCorrect){
            response = (correctResponses)?'Yes':'No';
            panel = Ext.create('Ext.Panel', {
                html: Lang.review.Correct_Answer+response,
                padding: '6 0 0 0'
            });
            me.add(panel);
        }
    },
    
    

    initialize: function() {
        var me = this;
        me.callParent(arguments);
    }
});
