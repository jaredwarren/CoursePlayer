Ext.define('Player.page.questions.Question', {
  extend: 'Player.page.questions.BaseQuestion',

  xtype: 'question',

  requires: [
    'Ext.Toast'
  ],

  layout: {
    align: 'center',
    type: 'vbox'
  },
  

  /*
  Instructions
  */
  makeToast: function(toastObj) {
    var me = this;
    /*
    console.info("MakeToast:", toastObj.message, me._toasts);
    Ext.Array.each(me._toasts, function(toast, index, items) {
      toast.hide(false);
    });
    */
    Ext.defer(function() {
      var toast = Ext.toast({
        //title: toastObj.title,
        message: toastObj.message,
        timeout: toastObj.timeout,
        bottom: 40,
        right: 5,
        hideAnimation: {
          type: 'slideOut',
          direction: 'down',
          duration: 400
        },
        showAnimation: {
          type: 'slideIn',
          direction: 'up',
          duration: 400
        }
        //timeout: 99999999999999
        //closable: true,
        //align: 'br'
      });
      toast.setModal(false);
      me._toasts.push(toast);
    }, 100);

  },

  /*
  Utility Functions
  */
  getValues: function(enabled, all) {
    var fields = this.query(this.distractorType),
      values = {},
      isArray = Ext.isArray,
      field, value, addValue, bucket, name, ln, i;

    addValue = function(field, name) {
      if (!all && (!name || name === 'null') || field.isFile) {
        return;
      }
      if (field.isCheckbox) {
        value = field.getSubmitValue();
      } else {
        value = field.getValue();
      }
      if (!Ext.isEmpty(value) && !(enabled && field.getDisabled())) {
        if (field.isRadio) {
          if (field.isChecked()) {
            values[name] = value;
          }
        } else {
          bucket = values[name];
          if (!Ext.isEmpty(bucket)) {
            if (!isArray(bucket)) {
              bucket = values[name] = [
                bucket
              ];
            }
            if (isArray(value)) {
              bucket = values[name] = bucket.concat(value);
            } else {
              bucket.push(value);
            }
          } else {
            values[name] = value;
          }
        }
      }
    };

    for (var i = fields.length - 1; i >= 0; i--) {
      field = fields[i];
      name = field.getName();
      if (isArray(field)) {
        ln = field.length;
        for (i = 0; i < ln; i++) {
          addValue(field[i], name);
        }
      } else {
        addValue(field, name);
      }
    };

    return values;
  }
})