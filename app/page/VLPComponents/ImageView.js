Ext.define('Player.page.VLPComponents.ImageView', {
  extend: 'Player.page.VLPComponents.ObjectView',
  xtype: 'vlpimageview',

  cls: ['image-view', 'object-view'],

  config: {
    imageFile: ''
  },

  layout: 'fit',

  constructor: function(cfg) {
    var me = this;
    cfg = cfg || {};

    // convert alpha to opacity
    cfg.data.opacity = (cfg.data.alpha / 100);

    me.callParent([Ext.apply({
      style: {
        'background-image': 'url('+cfg.data.imageFile+')',
        'background-repeat': 'no-repeat',
        'background-size': '100% 100%',
        'opacity': (cfg.data.alpha / 100)
      }
    }, cfg)]);
  }
});