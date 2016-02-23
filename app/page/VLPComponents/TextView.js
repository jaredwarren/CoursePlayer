Ext.define('Player.page.VLPComponents.TextView', {
  extend: 'Player.page.VLPComponents.ObjectView',
  xtype: 'vlptextview',

  cls: ['text-view', 'object-view'],
  scrollable: {
    direction: 'vertical',
    directionLock: true
  },
  layout: {
    type: 'hbox'
  },
  styleHtmlContent: true,

  config: {
    pText: undefined
  },

  constructor: function(cfg) {
    var me = this,
      items = [];
    cfg = cfg || {};

    items.push({
      xtype: 'container',
      itemId: 'pText',
      html: cfg.data.pText['#text'],
      styleHtmlContent: true,
      scrollable: {
        direction: 'vertical',
        directionLock: true
      },
      width: '100%'
    });

    me.callParent([Ext.apply({
      items: items
    }, cfg)]);
  }
});