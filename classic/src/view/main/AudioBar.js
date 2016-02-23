Ext.define('Player.view.main.AudioBar', {
  extend: 'Ext.Panel',
  xtype: 'audiobar',
  requires: [
    'Ext.slider.Single',
    'Player.page.components.Audio',
    'Player.view.main.MediaSingle'
  ],

  height: 90,
  layout: {
    align: 'center',
    pack: 'center',
    type: 'vbox'
  },
  scrollable: false,

  config: {
    mediaPath: undefined,
    autoPlayMedia: false
  },

  constructor: function(cfg) {
    var me = this;
    cfg = cfg || {};

    me.callParent([Ext.apply({
      items: [{
        xtype: 'mediaslider',
        itemId: 'progressSlider',
        minValue: 0,
        snapping: false,
        increment: 0,
        maxValue: 100,
        animate: {
          duration: 900,
          easing: 'linear'
        },
        //animate: false,
        width: '100%',
        listeners: {
          dragstart: me.onDragStart,
          dragend: me.onDragEnd,
          change: me.onProgressChange,
          scope: me
        },
        value: 0
      }, {
        xtype: 'container',
        layout: 'hbox',
        items: [{
          xtype: 'button',
          height: 40,
          width: 40,
          itemId: 'replayBtn',
          iconCls: 'pictos pictos-rewind',
          iconAlign: 'center',
          listeners: {
            click: me.onReplayTap,
            scope: me
          }
        }, {
          xtype: 'container',
          width: 10
        }, {
          xtype: 'button',
          iconCls: 'pictos pictos-play',
          height: 50,
          width: 50,
          itemId: 'playBtn',
          iconAlign: 'center',
          listeners: {
            click: me.onPlayTap,
            scope: me
          }
        }]
      }, {
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
          loadedmetadata: me.onLoadedMetadata,
          pause: me.onPause,
          play: me.onPlay,
          playing: me.onPlaying,
          scope: me
        }
      }]
    }, cfg)]);
  },

  play: function() {
    var me = this;
    me.stopAllAudio();
    var audioComp = this.queryById('audioComp');
    audioComp.play();
  },


  pause: function() {
    var audioComp = this.queryById('audioComp');
    audioComp.pause();
  },

  start: function(autoplay) {
    var me = this,
      audioComp = me.queryById('audioComp');
    if (audioComp.media.readyState <= 0) {
      me.setLoadingMask(Lang.Loading);
    }
    audioComp.media.currentTime = 0;
    me.stopAllAudio();
    if (autoplay) {
      me.queryById('audioComp').play();
    }
  },


  onPlayTap: function() {
    var audioComp = this.queryById('audioComp');
    audioComp.toggle();
  },

  stopAllAudio: function() {
    var audio = document.getElementsByTagName('audio');
    for (var i = audio.length - 1; i >= 0; i--) {
      audio[i].pause();
    };
  },


  onLoadedMetadata: function(e, f, g) {
    var me = this,
      progressSlider = me.queryById('progressSlider');
    if (progressSlider) {
      progressSlider.setMaxValue(e.target.duration);
    }
  },

  moving: false,
  onTimeUpdate: function(event, eOpts) {
    var me = this,
      media = event.target,
      currentTime = media.currentTime,
      totalTime = media.duration,
      progress = (currentTime / totalTime);

    if (!this.dragging && !this.moving) {
      me.queryById('progressSlider').setValue(media.currentTime);
    }
  },

  _start: 0,
  onProgressChange: function(slider, value, thumb, eOpts) {
    var me = this,
      audio = me.queryById('audioComp');
    me.moving = false;
    //where is event comming from?
    if (event.type == 'mousedown') {
      //debugger;
      audio.setCurrentTime(slider.getValue());
    }
  },

  dragging: false,
  onDragStart: function() {
    this.dragging = true;
  },
  onDragEnd: function(slider, e, eOpts) {
    var me = this,
      audio = me.queryById('audioComp');
    me.dragging = false;
    audio.setCurrentTime(slider.getValue());
  },


  onReplayTap: function() {
    var me = this;

    me.queryById('audioComp').setCurrentTime(0);
  },

  onLoaded: function() {
    this.setLoadingMask(false);
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
      me.setLoadingMask(message);
    } catch (e) {}
  },

  onLoadStart: function(e) {
    var me = this;
    if (!me.getAutoPlayMedia()) {
      me.setLoadingMask(false);
    }
  },



  onPause: function(e) {
    var me = this;
    me.queryById('playBtn').setIconCls("pictos pictos-play");
  },

  onPlay: function(e) {
    var me = this;
    me.setLoadingMask(Lang.Loading);
    me.queryById('playBtn').setIconCls("pictos pictos-pause");
  },

  onPlaying: function(e) {
    var me = this;
    me.setLoadingMask(false);
  },
  setLoadingMask: function(message) {
    var me = this,
      maskObject = false;
    if (message === false) {
      if (me.pageMask) {
        me.pageMask.hide();
      }
    } else {
      if (!me.pageMask) {
        me.pageMask = new Ext.LoadMask({
          msg: message,
          target: me
        });
      } else {
        me.pageMask.msg = message;
      }
      if (!me.pageMask.isVisible()) {
        me.pageMask.show();
      }
    }
  }

});