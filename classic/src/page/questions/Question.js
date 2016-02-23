Ext.define('Player.page.questions.Question', {
  extend: 'Player.page.questions.BaseQuestion',

  xtype: 'question',

  requires: [
    'Ext.window.Toast'
  ],

  // fixes layout run failed problem
  layout: "anchor",
  anchor: "100% 100%",

  /*
  Instructions
  */
  makeToast: function(toastObj) {
    var me = this;
    var toast = Ext.toast({
      title: toastObj.title,
      html: toastObj.message,
      timeout: toastObj.timeout,
      closable: toastObj.closable,
      align: toastObj.align,
      paddingY: 60,
      paddingX: 5
    });
    me._toasts.push(toast);
  },

  /*
  Utility Functions
  */
  getValues: function(asString, dirtyOnly, includeEmptyText, useDataValues, isSubmitting) {
    var values = {},
      fields = this.query(this.distractorType),
      fLen = fields.length,
      isArray = Ext.isArray,
      field, data, val, bucket, name, f;

    for (f = 0; f < fLen; f++) {
      field = fields[f];
      if (!dirtyOnly || field.isDirty()) {
        data = field[useDataValues ? 'getModelData' : 'getSubmitData'](includeEmptyText, isSubmitting);

        if (Ext.isObject(data)) {
          for (name in data) {
            if (data.hasOwnProperty(name)) {
              val = data[name];

              if (includeEmptyText && val === '') {
                val = field.emptyText || '';
              }

              if (!field.isRadio) {
                if (values.hasOwnProperty(name)) {
                  bucket = values[name];

                  if (!isArray(bucket)) {
                    bucket = values[name] = [bucket];
                  }

                  if (isArray(val)) {
                    values[name] = bucket.concat(val);
                  } else {
                    bucket.push(val);
                  }
                } else {
                  values[name] = val;
                }
              } else {
                values[name] = values[name] || val;
              }
            }
          }
        }
      }
    }

    if (asString) {
      values = Ext.Object.toQueryString(values);
    }
    return values;
  }
});