Ext.define('Player.page.questions.Instructions', {
    extend: 'Ext.Panel',
    alias: 'widget.instructions',

    config: {
        xtype: 'panel',
        bottom: 0,
        left: 0,
        right: 0,
        height: 48,
        hidden: true,
        itemId: 'instructions',
        cls: 'instructions',
        checkAnswer: false,
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        width: '100%',
        bubbleEvents: ['closeinstructions', 'checkanswerevt'],
        showAnimation: {
            type: 'slideIn',
            duration: 400,
            direction: 'up'
        },
        items: [{
            xtype: 'button',
            docked: 'right',
            itemId: 'closeInstructions',
            cls: 'closeinstructions',
            autoEvent: 'closeinstructions',
            ui: 'plain',
            iconMask: true,
            iconCls: 'delete'
        },{
            xtype: 'button',
            docked: 'right',
            itemId: 'checkAnswerBtn',
            autoEvent: 'checkanswer',
            hidden: true,
            height: 36,
            width: 48,
            ui: 'checkanswer',
            iconMask: true,
            iconCls: 'check2'
        }]
    },

    initialize: function() {
        var me = this;
        me.callParent(arguments);
        me.query('#closeInstructions')[0].on('tap', me.onClose, me);
        me.query('#checkAnswerBtn')[0].on('tap', me.onCheckAnswer, me);
    },
    onClose: function() {
        var me = this;
        me.hide();
        me.fireAction('closeinstructions', [me]);
    },
    onCheckAnswer: function(e){
        this.fireEvent('checkanswerevt', this);
    },
    updateCheckAnswer: function(value){
        this.query('#closeInstructions')[0].setHidden(value);
        this.query('#checkAnswerBtn')[0].setHidden(!value);
    }

});
