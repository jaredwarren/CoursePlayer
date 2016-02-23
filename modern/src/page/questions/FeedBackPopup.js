Ext.define('Player.page.questions.FeedBackPopup', {
    extend: 'Ext.Panel',
    alias: 'widget.feedbackpopup',

    config: {
        centered: true,
        hidden: true,
        itemId: 'feedbackPopup',
        width: '90%',
        height: '50%',
        title: '',
        feedback: '',
        padding: '5 5 5 5',
        hideOnMaskTap: true,
        hideAnimation: 'popOut',
        showAnimation: 'popIn',
        modal: true,
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        items: [{
            xtype: 'titlebar',
            docked: 'top',
            itemId: 'titlebar',
            title: 'Correct',
            items: [{
                xtype: 'button',
                itemId: 'closeFeedback',
                autoEvent: 'closefeedback',
                ui: 'round',
                iconCls: 'delete',
                iconMask: true,
                align: 'right'
            }]
        }]
    },
    initialize: function() {
        this.callParent(arguments);
        this.query('#closeFeedback')[0].on('tap', this.onClose, this);
    },
    onClose: function(){
        this.hide();
        this.fireAction('close', [this]);
    },
    updateTitle: function(value){
        this.getComponent('titlebar').setTitle(value);
    },
    updateFeedback: function(value){
        this.setHtml(value);
    }
});
