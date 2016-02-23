Ext.define('Player.page.questions.EmailPopup', {
  extend: 'Ext.Panel',
  xtype: 'emailpopup',

  centered: true,
  hidden: true,
  maxHeight: '90%',
  maxWidth: '90%',

  minHeight: 300,
  minWidth: 300,

  // /fullscreen: true,
  hideOnMaskTap: true,
  layout: {
    type: 'fit'
  },

  hideAnimation: 'popOut',
  showAnimation: 'popIn',
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
      modal: true,
      items: [{
        xtype: 'formpanel',
        itemId: 'emailForm',
        name: 'emailForm',
        margin: '4 4 4 4',
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
          label: Lang.emailpopup.Name,
          validator: function(val) {
            val = val || '';
            // make sure there are atleast 2 letters
            var tn = val.replace(/[^A-z]/, '');
            return (tn.length > 1) ? true : Lang.emailpopup.email_name_error;
          },
          validate: function() {
            var me = this,
              isValid = me.validator(me.getValue());
            return (isValid === true);
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
          label: Lang.emailpopup.Email,
          validator: function(val) {
            val = val || '';
            var x = /^(")?(?:[^\."])(?:(?:[\.])?(?:[\w\-!#$%&'*+\/=?\^_`{|}~]))*\1@(\w[\-\w]*\.){1,5}([A-Za-z]){2,6}$/;
            return x.test(val);
          },
          validate: function() {
            var me = this,
              isValid = me.validator(me.getValue());
            return (isValid === true);
          },
          listeners: {
            keyup: {
              fn: me.onInputChange,
              scope: me
            }
          }
        }, {
          xtype: 'button',
          itemId: 'okbtn',
          width: 100,
          margin: '10 10 10 10',
          ui: 'action',
          text: Lang.emailpopup.OK,
          disabled: true,
          listeners: {
            tap: me.onSubmit,
            scope: me
          }
        }]
      }]
    }, cfg)]);
  },

  onInputChange: function() {
    var me = this;
    me.queryById('okbtn').setDisabled(!me.isValid());
  },

  isValid: function() {
    var me = this,
      fields = me.queryById('emailForm').getFields(),
      invalid = [];

    Ext.suspendLayouts();

    Ext.Object.each(fields, function(name, field, myself) {
      if (!field.validate()) {
        invalid.push(field);
      }
    });

    Ext.resumeLayouts(true);
    return invalid.length < 1;
  },

  onSubmit: function() {
    var me = this;
    if (me.isValid()) {
      me.queryById('emailForm').setDisabled(true);
      me.queryById('okbtn').setDisabled(true);
      me.fireEvent('submit', me, me.queryById('emailForm').getValues());
    }
  },
  close: function(){
    this.hide();
  },
  show: function(){
    var me = this;
    if (me.isValid()) {
      me.queryById('emailForm').setDisabled(false);
      me.queryById('okbtn').setDisabled(false);
    }
    me.callParent(arguments);
  }
});