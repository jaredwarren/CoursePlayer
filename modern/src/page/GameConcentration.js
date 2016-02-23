Ext.define('Player.page.GameConcentration', {
    extend: 'Player.page.Page',

    alias: ['widget.GameConcentration'],

    config: {
        layout: {
            type: 'fit'
        },
        styleHtmlContent: true,
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },

        //scrollable: false,
        cls: 'concentration',
        recordId: '',
        items: [
            // Task Title
            {
                xtype: 'container',
                itemId: 'gTitle',
                docked: 'top',
                hidden: true,
                html: 'Task Title........'
            },
            // Score
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
                    iconCls: 'refresh',
                    itemId: 'resetBtn',
                    ui: 'plain'
                }, {
                    xtype: 'button',
                    iconCls: 'help',
                    itemId: 'helpBtn',
                    ui: 'plain'
                }, {
                    xtype: 'container',
                    itemId: 'scoreLabel',
                    html: '<span class="spin-score-label">Attempts: 0</span> <span class="spin-score-count">Correct: 0</span>'
                }]
            },
            // main Content
            {
                xtype: 'dataview',
                itemId: 'matchList',
                cls: 'matchlist',
                mode: 'MULTI',
                allowDeselect: false,
                itemTpl: '{letter}',
                inline: {
                    wrap: true
                },
                scrollable: {
                    direction: 'vertical',
                    directionLock: true
                },
                scrollable: false,
                width: '100%',
                height: '100%'
            }
        ],
        listeners: [{
            fn: 'onSelectMatch',
            event: 'select',
            delegate: '#matchList'
        }, {
            fn: 'onShowInstructions',
            event: 'tap',
            delegate: '#helpBtn'
        }, {
            fn: 'reset',
            event: 'tap',
            delegate: '#resetBtn'
        }],
        pageData: {}
    },

    updatePageData: function(newPageData, oldPageData) {
        var me = this,
            matchList = me.query('#matchList')[0],
            maxMatches = 0,
            matchData = [],
            imageWidth, imageHeight,
            alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        // background Image
        if (!newPageData.imageFile) {
            newPageData.imageFile = g_styleRoot + 'resources/images/concentration/default.jpg';
        }

        matchList.setStyle({
            'background': "url('" + newPageData.imageFile + "')",
            'background-repeat': 'no-repeat',
            'background-position': 'center'
        });

        // match data
        Ext.Object.each(newPageData, function(key, value) {
            var matches = key.match(/match([0-9]+)([A-z])/),
                matchNumber,
                matchLetter;
            if (matches && matches.length > 1) {
                matchNumber = matches[1];
                matchLetter = matches[2];
            } else {
                return;
            }
            maxMatches++;
            matchData.push({
                matchNumber: matchNumber,
                matchLetter: matchLetter,
                correct: false,
                selected: false,
                key: key,
                text: value
            });

        });

        // even out 
        if (matchData.length % 2 != 0) {
            matchData.pop();
        }

        // randomize
        matchData = me.randomizeArray(matchData);
        // add letter
        for (var i = matchData.length - 1; i >= 0; i--) {
            matchData[i].letter = alphabet.charAt(i);
        };

        me.maxMatches = matchData.length;
        // add blank
        me.rows = Math.ceil(Math.sqrt(matchData.length));
        me.columns = Math.round(Math.sqrt(matchData.length));

        for (var i = 0, ln = ((me.rows * me.columns) - matchData.length); i < ln; i++) {
            matchData.push({
                matchNumber: i,
                letter: '-',
                correct: true,
                selected: false,
                matchLetter: '-'
            });
        };

        matchList.setData(matchData);

        me.successfulMatches = 0;
        me.attempts = 0;
    },

    onSelectMatch: function(matchList, record) {
        var me = this,
            selections = matchList.getSelection(),
            matchNumber = 0,
            correctMatch = true;

        if (record.get('correct')) {
            // deselect record
            matchList.deselect(record);
            return false;
        }
        if (selections.length > 2) {
            return false;
        }

        record.set('selected', true);

        if (selections.length == 2) {
            matchNumber = selections[0].get('matchNumber');
            for (var i = selections.length - 1; i >= 0; i--) {
                var selection = selections[i];
                if (selection.get('matchNumber') != matchNumber) {
                    correctMatch = false;
                }
            };
            if (correctMatch) {
                Ext.Msg.alert('Correct', 'That is a match', function() {
                    me.clearSelection(true);
                });
                me.successfulMatches++;
            } else {
                Ext.Msg.alert('Sorry', 'That is not a match', function() {
                    Ext.defer(function() {
                        me.clearSelection(false);
                    }, 600);
                });
            }
            me.attempts++;
            me.setScore();
        }
    },

    clearSelection: function(correctMatch) {
        var me = this,
            matchList = me.query('#matchList')[0],
            selections = matchList.getSelection();

        for (var i = selections.length - 1; i >= 0; i--) {
            var selection = selections[i];
            selection.set('correct', correctMatch);
            selection.set('selected', false);
        };
        matchList.deselectAll();
        if (correctMatch) {
            if (matchList.getStore().findExact('correct', false) < 0) {
                Ext.defer(function() {
                    Ext.Msg.alert('Success!', 'Tap the reset button to play again.', Ext.emptyFn);
                }, 100);
            }
        }
    },

    onOrientationChange: function(newOrientation) {
        var me = this;
        me.resize();
    },

    resize: function() {
        var me = this,
            pageData = me.getPageData(),
            matchList = me.query('#matchList')[0],
            listWidth = matchList.element.getWidth(),
            listHeight = matchList.element.getHeight(),
            itemWidth = Math.floor(listWidth / me.columns) - 0,
            itemHeight = Math.floor(listHeight / me.rows) - 0;

        if (!pageData.iSizeW) {
            pageData.iSizeW = listWidth;
        }
        if (!pageData.iSizeH) {
            pageData.iSizeH = listHeight;
        }
        matchList.setStyle({
            'background-size': pageData.iSizeW + 'px ' + pageData.iSizeH + 'px'
        });

        var cls = (Ext.os.is.Phone) ? 'selected isphone' : 'selected tablet'
        matchList.setItemTpl([
            '<tpl if="correct">',
            '<div class="correct" style="line-heightX: ' + itemHeight + 'px; width:' + itemWidth + 'px; height:' + itemHeight + 'px; max-height:' + itemHeight + 'px">&nbsp;</div>',
            '</tpl>',
            '<tpl if="selected && !correct">',
            '<div class="' + cls + '" style="line-heightX: ' + itemHeight + 'px; width:' + itemWidth + 'px; height:' + itemHeight + 'px; max-height:' + itemHeight + 'px">{text}</div>',
            '</tpl>',
            '<tpl if="!selected && !correct">',
            '<div class="not-selected" style="line-heightX: ' + itemHeight + 'px; width:' + itemWidth + 'px; height:' + itemHeight + 'px">{letter}</div>',
            '</tpl>'

        ]);
        matchList.refresh();
    },

    reset: function() {
        var me = this,
            matchList = me.query('#matchList')[0];
        matchList.getStore().each(function(record, index, total) {
            record.set('correct', (record.get('letter') == '-'));
            record.set('selected', false);
        });
        matchList.deselectAll();

        me.successfulMatches = 0;
        me.attempts = 0;

        me.setScore();

    },

    setScore: function() {
        var me = this;
        me.query('#scoreLabel')[0].setHtml('<span class="spin-score-label">Attempts:' + me.attempts + '</span> <span class="spin-score-count">Correct:' + me.successfulMatches + '</span>');
    },

    onShowInstructions: function() {
        var me = this,
            pageData = me.getPageData(),
            title = '';
        if (pageData.gTitle && pageData.gTitle['#text']) {
            title = pageData.gTitle['#text'];
        }

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
                    hidden: !(title),
                    title: title
                }, {
                    xtype: 'container',
                    html: pageData.pInstr['#text']
                }, {
                    xtype: 'container',
                    docked: 'bottom',
                    layout: {
                        align: 'center',
                        pack: 'center',
                        type: 'hbox'
                    },
                    items: [{
                        xtype: 'button',
                        text: 'Start',
                        itemId: 'continueBtn',
                        ui: 'action'
                    }]
                }]
            });
            me.instructionsPopup.query('#continueBtn')[0].on('tap', me.onInstructionContinue, me);
            Ext.getCmp('main').add(me.instructionsPopup);
        }
        me.instructionsPopup.show();
    },
    onInstructionContinue: function() {
        var me = this;
        me.instructionsPopup.hide();
    },

    randomizeArray: function(array) {
        var currentIndex = array.length,
            temporaryValue, randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    },
    start: function() {
        var me = this;
        me.callParent(arguments);
        me.onShowInstructions();

        // call page complet here or when game is done???
        this.fireEvent('page-complete');
    },
    close: function() {
        var me = this;
        me.reset();
        me.instructionsPopup.hide();
    },

    initialize: function() {
        var me = this;
        me.callParent(arguments);
        me.on('painted', me.resize, me);
    }
});