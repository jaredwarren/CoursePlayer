Ext.define('Player.page.components.FormPopup', {
    extend: 'Ext.form.Panel',

    alias: ['widget.formpopup'],

    config: {
        itemId: 'popupInstructions',
        centered: true,
        modal: true,
        hidden: true,
        width: '90%',
        height: '90%',
        scrollable: 'vertical',
        cls: 'form-popup',
        items: [{
            xtype: 'titlebar',
            itemId: 'titleBar',
            docked: 'top',
            title: ''
        }, {
            xtype: 'container',
            html: '',
            cls: 'page-content',
            itemId: 'instructions'
        }, {
            xtype: 'container',
            docked: 'bottom',
            itemId: 'bottomBar',
            layout: {
                align: 'center',
                pack: 'center',
                type: 'hbox'
            },
            items: [{
                xtype: 'button',
                text: 'Submit',
                itemId: 'submitBtn',
                margin: '10 10 10 10',
                ui: 'action'
            }]
        }],
        listeners: [{
            fn: 'onSubmit',
            event: 'tap',
            delegate: '#submitBtn'
        }],
        formItems: []
    },

    updateFormItems: function(newFormItems, oldFormItems) {
        var me = this;
        me.add(newFormItems);
    },
    onSubmit: function(e) {
        if(e.stopEvent){
            e.stopEvent();
        }
        var me = this,
            values = me.getValues(),
            formIsValid = true;
        Ext.Object.each(values, function(key, value, myself) {
            if(me.query('[name="'+key+'"]')[0].getRequired()){
                if(value == ''){
                    formIsValid = false;
                }
            }
        });
        if(formIsValid){
            me.fireEvent('submitform', me, me.getValues());
        }
        else{
            Ext.Msg.alert("Form Incomplete", "Please fill in the required fields");
        }
    },

    onClose: function() {
        var me = this;
        me.hide();
    },

    initialize: function() {
        var me = this;
        me.callParent(arguments);

    }
});