Ext.define('Player.page.BaseTextPage', {
  extend: 'Player.page.Page',

  requires: [
    'Player.page.components.TextImage'
  ],

  config: {
    pText: undefined,
    imageFile: undefined,
    imgPos: 'left',
    imageWidth: '40',
    captiontext: undefined,
    captionhead: undefined,
    imageURL: undefined,
    mediaPath: undefined,
    autoPlayMedia: false
  },

  constructor: function(cfg) {
    var me = this,
      items = cfg.items || [];
    cfg = cfg || {};

    var iconType = (!cfg.imageURL) ? 'zoom' : 'link';

    items.unshift({
      xtype: 'textimage',
      cls: 'page-content',
      itemId: 'textImage',
      region: 'center',
      pText: cfg.pText,
      imageFile: cfg.imageFile,
      iconType: cfg.iconType || iconType,
      imgPos: cfg.imgPos,
      captionhead: cfg.captionhead,
      captiontext: cfg.captiontext,
      imageURL: cfg.imageURL,
      imageWidth: cfg.imageWidth
    });

    if ( !! cfg.mediaPath) {
      items.push({
        xtype: 'audiobar',
        itemId: 'audio',
        region: 'south',
        docked: 'bottom',
        width: '100%',
        mediaPath: cfg.mediaPath,
        autoPlayMedia: cfg.autoPlayMedia,
        listeners: {
          'audio-ended': me.onAudioEnded,
          scope: me
        }
      });
    }

    me.callParent([Ext.apply({
      items: items
    }, cfg)]);
  },

  start: function() {
    var me = this;
    var audio = me.queryById('audio');
    if (audio) {
      audio.start(me.getAutoPlayMedia());
    } else {
      // don't call parent aka fire page-complete if audio
      me.callParent(arguments);
    }
    //me.queryById('textImage').onImageResize();
  },

  onAudioEnded: function(){
    var me = this;
    me.fireEvent('page-complete', me);
  },

  close: function() {
    var me = this;
    me.closeImagePopup();
    me.deinitializePopup();
  },

  nextHandler: function() {
    this.closeImagePopup();
    return true;
  },

  previousHandler: function() {
    if (this._hasImage) {
      this.closeImagePopup();
    }
    return true;
  },

  /**
   *
   */
  closeImagePopup: function() {
    this.getComponent('textImage').closeImagePopup();
    var audio = this.getComponent('audio');
    if (audio) {
      audio.pause();
    }
  },

  /**
   *
   */
  deinitializePopup: function() {
    this.getComponent('textImage').deinitializePopup();
  }
});