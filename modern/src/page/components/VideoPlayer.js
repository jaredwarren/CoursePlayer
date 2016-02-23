Ext.define('Player.page.components.VideoPlayer', {
  extend: 'Player.page.components.BaseVideoPlayer',

  xtype: 'videoplayer',

  requires: [
    'Player.page.components.VideoComponent'
  ],

  constructor: function(cfg) {
    var me = this;
    cfg = cfg || {};

    me.callParent([Ext.apply({
      nativeControls: true
    }, cfg)]);
  },

  _oldWidth: undefined,
  _oldHeight: undefined,
  initialize: function() {
    var me = this;
    me.callParent(arguments);
    me.on('resize', function(element, eOpts) {
      if(me.videoLoaded){
        me.resizeVideo(element, eOpts.width, eOpts.height, me._oldWidth, me._oldHeight, eOpts);
      }
      me._oldWidth = eOpts.width;
      me._oldHeight = eOpts.height;
    }, me);
  },

  setLoadingMask: function(message) {
    var me = this;
    if (message === false) {
      me.setMasked(false);
    } else {
      me.setMasked({
        xtype: 'loadmask',
        message: message
      });
    }
  },
  /*
  Other Stuff

  I had to hide and show the video this way because if the video was on the previous page, 
  you could still tap on it through the toc. iOS puts video on top of everything
  */
  hideVideo: function(e) {
    var me = this,
      videoPlayer = me.query('video')[0];
    // force pause all video elements
    Ext.Array.each(me.el.dom.querySelectorAll('video'), function(video, index, items) {
      video.pause();
    });
    if (me.videoType == 'local') {
      if (videoPlayer) {
        videoPlayer.pause();
        videoPlayer.media.setTop(-2000);
        videoPlayer.ghost.show();
      }
    }
  },
  showVideo: function(e) {
    var me = this,
      videoPlayer = me.query('video')[0];
    if (me.videoType == 'local') {
      if (videoPlayer) {
        videoPlayer.media.setTop(0);
        videoPlayer.ghost.hide();
        videoPlayer.media.show();
      }
    }
  }
});