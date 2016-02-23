Ext.define('Player.page.VLPComponents.SwfView', {
  extend: 'Player.page.VLPComponents.ObjectView',
  xtype: 'vlpswfview',
  cls: ['swf-view', 'object-view'],
  config: {
  },
  constructor: function(cfg) {
    var me = this,
      items = [];
    cfg = cfg || {};

    console.warn("TODO: make swf component");
    items.push({
      xtype: 'container',
      html: "SWF not supported",
      style: 'background-color: lightGrey',
      width: '100%'
    });

    me.callParent([Ext.apply({
      items: items
    }, cfg)]);
  }
});