Ext.define('Player.view.main.ProgressBar', {
  extend: 'Ext.Container',
  xtype: 'progressbar',

  config: {
    style: 'background-color:#666',
    layout: {
      type: 'fit'
    },
    maxValue: 100,
    value: 0,
    showText: 1,
    items: [{
      xtype: 'container',
      itemId: 'fillElement',
      style: 'background-color:#00B1EA',
      width: '10%'
    }, {
      xtype: 'container',
      centered: true,
      html: '--%',
      itemId: 'textElement'
    }]
  },

  updateValue: function(value) {
    var me = this,
      maxValue = me.getMaxValue();

    if (value < 0) {
      value = 0;
    } else if (value > maxValue) {
      value = maxValue;
    }
    me.getComponent('textElement').setHtml(value + '%');
    me.updateProgress(value);
  },

  updateProgress: function(value) {
    var me = this;
    value = (value * 100) / me.getMaxValue();
    me.getComponent('fillElement').setWidth(value + '%');
  },

  updateShowText: function(value) {
    var me = this;
    if (value) {
      me.getComponent('textElement').show();
    } else {
      me.getComponent('textElement').hide();
    }
  }

});