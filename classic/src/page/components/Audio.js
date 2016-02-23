Ext.define('Player.page.components.Audio', {
  extend: 'Player.page.components.Media',
  xtype: 'audio',

  config: {
    cls: Ext.baseCSSPrefix + 'audio'
  },

  onActivate: function() {
    var me = this;

    me.callParent();

    if (Ext.os.is.Phone) {
      me.element.show();
    }
  },

  onDeactivate: function() {
    var me = this;

    me.callParent();

    if (Ext.os.is.Phone) {
      me.element.hide();
    }
  },
  _mediaEvents: [
    "abort",
    "canplay",
    "canplaythrough",
    "cuechange",
    "durationchange",
    "emptied",
    "empty",
    "ended",
    "error",
    "loadeddata",
    "loadedmetadata",
    "loadstart",
    "pause",
    "play",
    "playing",
    "progress",
    "ratechange",
    "seeked",
    "seeking",
    "stalled",
    "suspend",
    "timeupdate",
    "volumechange",
    "waiting"
  ],

  onRender: function() {
    var me = this,
      mediaDom;
    me.callParent(arguments);
    mediaDom = me.media;
    me.audio = me.media;
    me.supported = (mediaDom && mediaDom.tagName.toLowerCase() == 'audio');
    if (me.supported) {
      Ext.Array.each(me._mediaEvents, function(name, index, mediaEvents) {
        mediaDom.addEventListener(name, function(e) {
          me.fireEvent(e.type, e);
        }, true);
      });
    }
  },

  constructor: function(cfg) {
    var me = this;
    cfg = cfg || {};

    me.callParent([Ext.apply({
      media: {
        reference: 'media',
        preload: 'auto',
        tag: 'audio',
        cls: Ext.baseCSSPrefix + 'component'
      }
    }, cfg)]);
  }


});