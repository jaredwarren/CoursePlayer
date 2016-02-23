Ext.define('Player.view.main.WebPanel', {
    extend: 'Ext.Panel',
    xtype: 'webpanel',

    config: {
        centered: true,
        height: '100%',
        hidden: true,
        id: 'webPanel',
        hideAnimation: 'popOut',
        showAnimation: 'popIn',
        width: '100%',
        items: [{
            xtype: 'toolbar',
            docked: 'top',
            items: [{
                xtype: 'button',
                hidden: true,
                itemId: 'popOutWeb',
                iconCls: 'reply'
            }, {
                xtype: 'spacer'
            }, {
                xtype: 'button',
                handler: function(button, event) {
                    this.up('webpanel').hide();
                },
                itemId: 'closeWeb',
                ui: 'decline-round',
                iconAlign: 'center',
                iconCls: 'delete'
            }]
        }]
    }

});