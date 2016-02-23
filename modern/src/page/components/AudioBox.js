Ext.define('Player.page.components.AudioBox', {
  extend: 'Ext.Panel',
  xtype: 'audiobox',

  requires: [
    'Ext.Audio',
    'Player.page.components.AudioComponent'
  ],

  layout: {
    align: 'center',
    pack: 'center',
    type: 'hbox'
  },
  cls: 'audiobox',
  config: {
    mediaPath: undefined,
    autoPlayMedia: false
  },
  //flex: 1,
  width: '100%',

  constructor: function(cfg) {
    var me = this,
      items = cfg.items || [];

    items.push({
      xtype: 'audio',
      hidden: true,
      itemId: 'audioComp',
      preload: 'none',
      url: cfg.mediaPath,
      enableControls: false,
      listeners: {
        ended: me.onEnded,
        error: me.onError,
        loadstart: me.onLoadStart,
        timeupdate: me.onTimeUpdate,
        pause: me.onPause,
        play: me.onPlay,
        playing: me.onPlaying,
        scope: me
      }
    });

    items.unshift({
      xtype: 'button',
      cls: 'play-btn',
      height: 50,
      width: 50,
      itemId: 'playBtn',
      iconCls: 'pictos pictos-play',
      margin: '4 36 4 4',
      disabled: !cfg.mediaPath,
      iconAlign: 'center'
    });

    me.callParent([Ext.apply({
      items: items
    }, cfg)]);
  },

  initialize: function() {
    var me = this;
    me.callParent(arguments);

    me.queryById('playBtn').el.dom.addEventListener("click", function(e) {
      me.onPlayTap.call(me, e);
    }, true);
  },

  play: function() {
    this.stopAllAudio();
    var audioComp = this.getComponent('audioComp');
    audioComp.play();
  },
  pause: function() {
    var audioComp = this.getComponent('audioComp');
    audioComp.pause();
  },


  onPlayTap: function() {
    var audioComp = this.getComponent('audioComp');
    console.log('tapa');
    audioComp.toggle();
  },

  stopAllAudio: function() {
    var audio = document.getElementsByTagName('audio');
    for (var i = audio.length - 1; i >= 0; i--) {
      audio[i].pause();
    };
  },

  onTimeUpdate: function(media, eOpts) {
    var me = this,
      currentTime = media.getCurrentTime(),
      totalTime = media.getDuration(),
      progress = (currentTime / totalTime) * 100;
  },

  onReplayTap: function() {
    var me = this;
    me.getComponent('audioComp').setCurrentTime(0);
  },

  onLoaded: function() {
    this.getComponent('playBtn').enable();
  },

  onEnded: function(e) {
    this.fireEvent('audio-ended');
  },

  onError: function(e) {
    var me = this,
      message = Lang.audiobox.Audio_Error0;

    try {
      switch (e.target.error.code) {
        case 1:
          message = Lang.audiobox.Audio_Error1;
          break;
        case 2:
          message = Lang.audiobox.Audio_Error2;
          break;
        case 3:
          message = Lang.audiobox.Audio_Error3;
          break;
        case 4:
          message = Lang.audiobox.Audio_Error4;
          break;
      }
      me.getComponent('playBtn').disable();
    } catch (e) {}
  },

  onLoadStart: function(e) {
    var me = this;

    me.getComponent('playBtn').enable();
  },

  onPause: function(e) {
    var me = this;
    me.queryById('playBtn').setIconCls("pictos pictos-play");
  },

  onPlay: function(e) {
    var me = this;
    me.queryById('playBtn').setIconCls("pictos pictos-pause");
    me.fireEvent('play', {
      target: e.media.dom
    });
  },

  onPlaying: function(e) {
    var me = this;
    me.getComponent('playBtn').enable();
  }
});