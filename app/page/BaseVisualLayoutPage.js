Ext.define('Player.page.BaseVisualLayoutPage', {
  extend: 'Player.page.Page',
  xtype: 'visuallayoutpage',
  requires: [
    'Player.page.VLPComponents.AudioView',
    'Player.page.VLPComponents.ImageView',
    'Player.page.VLPComponents.NoteView',
    'Player.page.VLPComponents.ObjectView',
    'Player.page.VLPComponents.TextView',
    'Player.page.VLPComponents.VideoView',
    'Player.view.main.AudioBar'
  ],
  scrollable: false,
  width: '100%',
  config: {
    pageItems: [],
    settings: {
      boundsWidth: 100,
      boundsHeight: 100
    }
  },

  layout: "border",

  constructor: function(cfg) {
    var me = this,
      rawItems = (cfg.pageItems && cfg.pageItems.item) ? cfg.pageItems.item : [],
      items = [],
      vlpItems = [];
    cfg = cfg || {};

    // for some reason when there is only one item it doesn't get put onto an array. probably a problem in Mobilize
    if (Object.prototype.toString.call(rawItems) != '[object Array]') {
      rawItems = [rawItems];
    }

    rawItems = Ext.Array.sort(rawItems, function(a, b) {
      if (a.level < b.level) return -1;
      if (a.level > b.level) return 1;
      return 0;
    });

    Ext.Array.each(rawItems, function(itemData, index, rawItems) {
      var oType = itemData.oType;
      if (oType == 'BackgroundAudio') {
        items.push({
          xtype: 'audiobar',
          itemId: 'audio',
          region: 'south',
          docked: 'bottom',
          width: '100%',
          mediaPath: itemData.data.mediaPath,
          autoPlayMedia: itemData.data.autoPlayMedia
        });
        return true;
      }

      itemData.xtype = 'vlp' + oType.toLowerCase() + 'view';
      vlpItems.push(itemData);
    });

    // TODO: make default width and height page width and height
    items.unshift({
      xtype: 'container',
      itemId: 'vlpContainer',
      width: (cfg.settings && cfg.settings.boundsWidth) ? cfg.settings.boundsWidth : 100,
      height: (cfg.settings && cfg.settings.boundsHeight) ? cfg.settings.boundsHeight : 100,
      items: vlpItems
    });
    me.callParent([Ext.apply({
      items: items
    }, cfg)]);
  },

  resizeCanvas: function(size) {
    var me = this,
      settings = me.getSettings(),
      mp = Ext.getCmp('mainPages'),
      vlpContainer = me.queryById('vlpContainer'),
      mpBounds = mp.el.dom.getBoundingClientRect(),
      bWidth = window.innerWidth,
      bHeight = window.innerHeight,
      scaleX = 1,
      scaleY = 1,
      scale = 1.0;

    if (settings) {
      bWidth = settings.boundsWidth;
      bHeight = settings.boundsHeight;
    }

    scaleX = mpBounds.width / bWidth;
    scaleY = mpBounds.height / bHeight;

    vlpContainer.setWidth(bWidth);
    vlpContainer.setHeight(bHeight);

    scale = (scaleX < scaleY) ? scaleX : scaleY;
    if (scale > 1) {
      scale = 1.0;
    }
    vlpContainer.el.dom.style.setProperty('-webkit-transform', 'scale(' + scale + ')');
    vlpContainer.el.dom.style.setProperty('transform', 'scale(' + scale + ')');
    vlpContainer.el.dom.style.setProperty('-webkit-transform-origin', '0 0');
    vlpContainer.el.dom.style.setProperty('transform-origin', '0 0');
  },

  hideVideo: function(e) {
    var me = this;
    Ext.Array.each(me.el.dom.querySelectorAll('video'), function(video, index, items) {
      video.pause();
    });
    Ext.Array.each(me.el.dom.querySelectorAll('audio'), function(audio, index, items) {
      audio.pause();
    });
  },
  showVideo: function(e) {
    this.queryById('videoContainer').showVideo();
  },
  onOrientationChange: function() {
    alert("TODO:onOrientationChange");
    return false;
    this.resize(this.getPageData());
  },
  start: function(){
    var me = this;
    me.callParent(arguments);

    Ext.Array.each(me.query('vlpobjectview'), function(vlpItem, index, items) {
      vlpItem.start();
    });
    var audiobar = me.queryById('audio');
    if(audiobar && audiobar.getAutoPlayMedia()){
      audiobar.play();
    }
  },
  close: function() {
    this.hideVideo();
  }
});