Ext.define('Player.page.Page', {
  extend: 'Player.page.BasePage',

  xtype: 'page',

  layout: {
    type: 'vbox',
    align: 'stretch',
    pack: 'start'
  },

  constructor: function(cfg) {
    var me = this;
    cfg = cfg || {};
    if (!cfg.items) {
      cfg.items = [];
    }

    me.callParent([cfg]);
  },

  start: function() {
    var me = this;
    me.callParent(arguments);
  }
});