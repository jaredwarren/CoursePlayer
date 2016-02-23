Ext.define('Player.page.VLPComponents.ObjectView', {
  extend: 'Ext.Container',
  xtype: 'vlpobjectview',
  config: {
    name: "TextView3104",
    level: 1,
    a: 1,
    b: 0,
    c: 0,
    d: 1,
    tx: 0.1,
    ty: 0.1,
    xOffset: 0,
    yOffset: 0,
    rawWidth: 165,
    rawHeight: 314,
    objectData: {},
    alpha: 0
  },
  cls: ['object-view'],

  constructor: function(cfg) {
    var me = this,
      style = {};
    cfg = cfg || {}

    style = Ext.Object.merge({
      'z-index': cfg.level,
      'width': cfg.rawWidth + 'px',
      'height': cfg.rawHeight + 'px',
      'background-color': 'rgba(255, 255, 255, ' + ((cfg.alpha || 0) / 100) + ')',
      '-webkit-transform': 'matrix(' + cfg.a + ', ' + cfg.b + ', ' + cfg.c + ', ' + cfg.d + ', ' + cfg.tx + ', ' + cfg.ty + ')',
      '-webkit-transform-origin': '0% 0%',
      'transform': 'matrix(' + cfg.a + ', ' + cfg.b + ', ' + cfg.c + ', ' + cfg.d + ', ' + cfg.tx + ', ' + cfg.ty + ')',
      'transform-origin': '0% 0%',
      'position': 'absolute'
    }, cfg.style);

    delete cfg.style;

    delete cfg.maxHeight;
    delete cfg.maxWidth;
    delete cfg.minHeight;
    delete cfg.minWidth;

    me.callParent([Ext.apply({
      style: style,
      left: cfg.xOffset,
      top: cfg.yOffset
    }, cfg)]);
  },
  start: function(){}
});