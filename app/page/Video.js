Ext.define('Player.page.Video', {
  extend: 'Player.page.Page',
  xtype: 'Video',

  requires: [
    'Player.page.components.VideoPlayer',
    'Player.page.components.TextImage'
  ],

  /*layout: {
    type: 'vbox',
    align: 'stretch',
    pack: 'start'
  },*/
  layout: 'auto',

  styleHtmlContent: true,
  cls: 'page-content',
  scrollable: {
    direction: 'vertical',
    directionLock: true
  },

  constructor: function(cfg) {
    var me = this,
      items = cfg.items || [];
    cfg = cfg || {};

    var src = cfg.mediaPath;
    if (!src) {
      src = cfg.videoPath;
    }
    if (!src || src.match(/\.flv$/)) {
      src = cfg.mobileMediaPath;
    }
    if (!src) {
      src = cfg.videoPath;
    }
    var videoStyle = {
      width: '100%'
    };
    if (cfg.pText && cfg.pText.hasOwnProperty('#text')) {
      switch (cfg.mediaPos) {
        case 'left':
          videoStyle = {
            float: 'left',
            width: '50%'
          };
          break;
        case 'right':
          videoStyle = {
            float: 'right',
            width: '50%'
          };
          break;
        case 'center':
        default:
          videoStyle = {
            width: '100%'
          };
          break;
      }
    }
    else{
      cfg.mediaPos = 'center';
    }
    // ignore mediaPos on mobile
    if (Ext.manifest.toolkit == 'modern') {
      cfg.mediaPos = 'center';
      videoStyle = {
        width: '100%'
      };
    }

    items.push({
      xtype: 'videoplayer',
      itemId: 'videoContainer',
      style: videoStyle,
      mediaPos: cfg.mediaPos,
      url: src,
      autoPlay: cfg.autoPlayMedia,
      listeners: {
        complete: me.onVideoComplete,
        scope: me
      }
    });

    var layout = 'auto';

    if (cfg.hasOwnProperty('pText')) {
      items.push({
        xtype: 'textimage',
        style: {
          width: 'auto'
        },
        pText: cfg.pText
      });
    } else {
      layout = {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
      };
      videoStyle = {
        width: '100%'
      };
    }

    me.callParent([Ext.apply({
      layout: layout,
      items: items
    }, cfg)]);
  },

  onVideoComplete: function(e) {
    this.fireEvent('page-complete', this);
  },
  hideVideo: function(e) {
    this.queryById('videoContainer').hideVideo();
  },
  showVideo: function(e) {
    this.queryById('videoContainer').showVideo();
  },
  start: function() {
    var me = this;
    me.showVideo();
    me.queryById('videoContainer').start();
  },
  close: function() {
    this.hideVideo();
  },
  // For some stupid reason this stupid hack doesn't work with this page
  hideScroller: function() {
    // DO NOTHING
  }
});