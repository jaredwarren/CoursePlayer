Ext.define('Player.view.main.AudioBar', {
  extend: 'Ext.Panel',
  xtype: 'audiobar',
  requires: [
    'Player.view.main.ProgressBar',
    'Player.page.components.AudioComponent'
  ],

  height: 70,
  style: 'background-image:-webkit-gradient(linear, 0% 0%, 0% 100%, from(#D9DADB), to(#95979a))',
  layout: {
    align: 'center',
    pack: 'center',
    type: 'hbox'
  },
  listeners: [{
    fn: 'onPanelInitialize',
    event: 'initialize'
  }],
  config: {
    mediaPath: undefined,
    autoPlayMedia: false
  },

  constructor: function(cfg) {
    var me = this;
    cfg = cfg || {};

    me.callParent([Ext.apply({
      items: [{
        xtype: 'progressbar',
        docked: 'top',
        height: 8,
        itemId: 'progressBar',
        showText: 0
      }, {
        xtype: 'button',
        cls: 'audio-btn replay-btn',
        height: 40,
        width: 40,
        itemId: 'replayBtn',
        ui: 'action',
        iconCls: 'pictos pictos-rewind',
        iconAlign: 'center',
        listeners: {
          tap: me.onReplayTap,
          scope: me
        }
      }, {
        xtype: 'spacer',
        width: 10
      }, {
        xtype: 'button',
        cls: 'audio-btn play-btn',
        height: 50,
        width: 50,
        itemId: 'playBtn',
        ui: 'action',
        iconCls: 'pictos pictos-play',
        iconAlign: 'center'
      }, {
        xtype: 'audiocomponent',
        hidden: true,
        itemId: 'audioComp',
        preload: 'none',
        enableControls: false,
        listeners: {
          abort: me.eventHandler,
          canplay: me.onCanPlay,
          canplaythrough: me.onCanPlayThrough,
          canshowcurrentframe: me.eventHandler,
          dataunavailable: me.eventHandler,
          durationchange: me.eventHandler,
          emptied: me.eventHandler,
          empty: me.eventHandler,
          ended: me.onEnded,
          error: me.onError,
          loadeddata: me.eventHandler,
          loadedmetadata: me.onLoadedMetadata,
          loadstart: me.onLoadStart,
          mozaudioavailable: me.eventHandler,
          pause: me.onPause,
          play: me.onPlay,
          playing: me.onPlaying,
          progress: me.eventHandler,
          ratechange: me.eventHandler,
          seeked: me.eventHandler,
          seeking: me.eventHandler,
          suspend: me.eventHandler,
          timeupdate: me.onTimeUpdate,
          volumechange: me.eventHandler,
          waiting: me.eventHandler,
          scope: me
        }
      }]
    }, cfg)]);
  },

  initialize: function() {
    var me = this;
    me.callParent(arguments);

    me.queryById('progressBar').updateValue(0);


    me.queryById('playBtn').el.dom.addEventListener("click", function(e) {
      me.onPlayTap.call(me, e);
    }, true);

    //me.queryById('playBtn').on('tap', me.onPlayTap, me);
    //me.queryById('replayBtn').on('tap', me.onReplayTap, me);

    //audioDom.preload = "none";
    //audioDom.hidden = "true";
  },

  updateMediaPath: function(mediaPath) {
    var me = this;

    me.setMasked({
      xtype: 'loadmask',
      message: Lang.Loading,
      indicator: false
    });

    if (mediaPath) {
      mediaPath = mediaPath.replace('https:', 'http:');
      me.queryById('audioComp').setUrl(mediaPath);
    }
  },


  play: function() {
    this.stopAllAudio();
    var audioComp = this.queryById('audioComp');
    audioComp.play();
  },

  start: function(autoplay) {
    var me = this;
    // TODO: check if loaded...
    /*me.setMasked({
      xtype: 'loadmask',
      message: Lang.Loading,
      indicator: false
    });*/
    me.stopAllAudio();
    /*if (autoplay) {
      me.queryById('audioComp').play();
    }*/
  },
  pause: function() {
    var audioComp = this.queryById('audioComp');
    audioComp.pause();
  },


  onPlayTap: function() {
    var me = this,
      audioComp = me.queryById('audioComp');
    me.setMasked({
      xtype: 'loadmask',
      message: Lang.Loading,
      indicator: false
    });
    audioComp.toggle();
  },

  stopAllAudio: function() {
    var audio = document.getElementsByTagName('audio');
    for (var i = audio.length - 1; i >= 0; i--) {
      audio[i].pause();
    };
  },

  onTimeUpdate: function(media, time, eOpts) {
    if (media && media.xtype == "audiocomponent") {
      var me = this,
        currentTime = media.getCurrentTime();
      me.queryById('progressBar').setValue(currentTime);
    }
  },

  onReplayTap: function() {
    var me = this;
    me.queryById('audioComp').setCurrentTime(0);
  },

  onLoadedMetadata: function(e, f, g) {
    var me = this,
      progressBar = me.queryById('progressBar');
    if (progressBar) {
      progressBar.setMaxValue(e.target.duration);
    }
  },

  onLoaded: function() {
    this.setMasked(false);
  },

  onCanPlay: function() {
    this.setMasked(false);
  },

  onCanPlayThrough: function() {},

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
      me.setMasked({
        xtype: 'loadmask',
        message: message,
        indicator: false
      });
    } catch (e) {}
    alert(message);
  },

  eventHandler: function(e) {
    /*if (e.type != 'timeupdate' && e.type != 'progress') {
      console.log("~~~~~~~~~~~~e:" + e.type);
    }*/
  },

  onLoadStart: function(e) {
    var me = this;
    me.setMasked(false);
  },

  onPause: function(e) {
    var me = this;
    me.setMasked(false);
    me.queryById('playBtn').setIconCls("pictos pictos-play");
  },

  onPlay: function(e) {
    var me = this;
    //me.setMasked(false);
  },

  onPlaying: function(e) {
    var me = this;
    me.setMasked(false);
    me.queryById('playBtn').setIconCls("pictos pictos-pause");
  },
  makeToast: function(message) {
    var me = this;
    var toast = Ext.toast({
      message: message,
      bottom: 40,
      right: 5
    });
    toast.setModal(false);
  }

});