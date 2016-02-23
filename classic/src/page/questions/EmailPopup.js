Ext.define('Player.page.questions.EmailPopup', {
  extend: 'Ext.window.Window',

  xtype: 'emailpopup',

  closable: true,

  closeAction: 'hide',
  centered: true,

  scrollable: 'vertical',
  cls: 'emailpopup',

  height: 450,
  width: 450,
  hidden: true,
  hideOnMaskTap: true,
  layout: {
    type: 'fit'
  },
  modal: true,

  title: Lang.emailpopup.Email_Title,

  config: {
    printMessage: undefined
  },

  constructor: function(cfg) {
    var me = this,
      directions = Lang.emailpopup.Email_Directions;
    cfg = cfg || {};

    if (cfg.printMessage) {
      if (cfg.printMessage.hasOwnProperty('#text')) {
        directions = cfg.printMessage['#text'];
      } else {
        directions = cfg.printMessage;
      }
    }

    me.callParent([Ext.apply({
      items: [{
        xtype: 'form',
        itemId: 'emailForm',
        items: [{
          xtype: 'label',
          html: directions
        }, {
          xtype: 'textfield',
          name: 'name',
          itemId: 'nameInput',
          allowBlank: false,
          enableKeyEvents: true,
          labelCls: 'email-label',
          fieldLabel: Lang.emailpopup.Name,
          validator: function(val) {
            // make sure there are atleast 2 letters
            var tn = val.replace(/[^A-z]/, '');
            return (tn.length > 1) ? true : Lang.emailpopup.email_name_error;
          },
          listeners: {
            keyup: {
              fn: me.onInputChange,
              scope: me
            }
          }
        }, {
          xtype: 'textfield',
          vtype: 'email',
          name: 'email',
          itemId: 'emailInput',
          allowBlank: false,
          enableKeyEvents: true,
          labelCls: 'email-label',
          fieldLabel: Lang.emailpopup.Email,
          listeners: {
            keyup: {
              fn: me.onInputChange,
              scope: me
            }
          }
        }, {
          xtype: 'button',
          itemId: 'okbtn',
          text: Lang.emailpopup.OK,
          disabled: true,
          listeners: {
            click: me.onSubmit,
            scope: me
          }
        }]
      }]
    }, cfg)]);
  },

  onInputChange: function() {
    var me = this;
    me.queryById('okbtn').setDisabled(!me.queryById('emailForm').isValid());
  },

  onSubmit: function() {
    var me = this,
      form = me.queryById('emailForm');

    if (form.isValid()) {
      me.fireEvent('submit', me, form.getValues());
    }
  }
});