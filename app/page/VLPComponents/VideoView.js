Ext.define('Player.page.VLPComponents.VideoView', {
  extend: 'Player.page.VLPComponents.ObjectView',
  xtype: 'vlpvideoview',

  requires: [
    'Player.page.components.VideoComponent'
  ],

  cls: ['video-view', 'object-view'],

  config: {
    autoPlayMedia: undefined
  },

  constructor: function(cfg) {
    var me = this;
    cfg = cfg || {};


    var src =  cfg.data.mediaPath;
    if (!src) {
      src = cfg.data.videoPath;
    }
    if (!src || src.match(/\.flv$/)) {
      src = cfg.data.mobileMediaPath;
    }
    if (!src) {
      src = cfg.data.videoPath;
    }

    me.callParent([Ext.apply({
      autoPlayMedia: cfg.data.autoPlayMedia,
      items: {
        xtype: 'videocomponent',
        itemId: 'videoPlayer',
        preload: 'none',
        posterUrl: 'resources/images/video_play.png',
        enableControls: false,
        url: src
      }
    }, cfg)]);
  },
  start: function(){
    var me = this;
    if(me.getAutoPlayMedia()){
      me.queryById('videoPlayer').play();
    }
  }
});