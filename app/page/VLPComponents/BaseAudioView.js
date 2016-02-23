Ext.define('Player.page.VLPComponents.BaseAudioView', {
  extend: 'Player.page.VLPComponents.ObjectView',


  cls: ['audio-view', 'object-view'],

  layout: 'fit',

  config: {
    audioIcon: 'resources/images/defaultAudio.png',
    autoPlay: undefined,
    mediaPath: ''
  },

  constructor: function(cfg) {
    var me = this,
      items = [],
      style = {
        //'background-image': 'url(\'resources/images/video_play.png\')',
        'background-size': '48px 48px',
        'background-repeat': 'no-repeat',
        'background-position': 'center',
        'color': 'black',
        'text-shadow': '2px 2px white',
        // for some f'n reason If I remove the border the whole component hieight is set to 1px
        'border': '1px solid transparent',
        'cursor': 'pointer',
        'font-size': cfg.rawHeight + 'px',
        'line-height': cfg.rawHeight + 'px'
      },
      cls = me.cls || [];
    cfg = cfg || {};

    if (cfg.data.audioIcon) {
      style = {
        'background-image': 'url(\'' + cfg.data.audioIcon + '\')',
        'background-size': '100% 100%',
        'background-repeat': 'no-repeat',
        'background-position': 'center',
        'background-color': 'transparent',
        // for some f'n reason If I remove the border the whole component hieight is set to 1px
        'border': '1px solid transparent',
        'cursor': 'pointer'
      };
    } else {
      cls.push('pictos', 'pictos-play');
    }

    me.callParent([Ext.apply({
      cls: cls,
      audioIcon: cfg.data.audioIcon,
      autoPlay: cfg.data.autoPlay,
      style: style,
      items: [{
        xtype: 'container',
        itemId: 'playBtn'
      }, {
        xtype: 'audiocomponent',
        hidden: true,
        itemId: 'audioComp',
        preload: 'none',
        bottom: 0,
        right: 0,
        left: 0,
        url: cfg.data.mediaPath,
        enableControls: false,
        listeners: {
          ended: me.onEnded,
          error: me.onError,
          loadstart: me.onLoadStart,
          pause: me.onPause,
          timeupdate: me.onTimeupdate,
          play: me.onPlay,
          playing: me.onPlaying,
          scope: me
        }
      }]
    }, cfg)]);
  },

  play: function() {
    var audioComp = this.queryById('audioComp');
    audioComp.play();
  },
  pause: function() {
    var audioComp = this.queryById('audioComp');
    audioComp.pause();
  },
  onPlayTap: function() {
    var me = this,
      audioComp = me.queryById('audioComp');
    me.setLoadingMask(Lang.Loading);
    audioComp.toggle();
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
    me.setLoadingMask(false);
  },

  // I have to do this crap because I can't figure out why playing event isn't firing for modern
  _updatePlayed: true,
  onPause: function(e) {
    var me = this;
    me._updatePlayed = true;
    me.setLoadingMask(false);
    if (!me.getAudioIcon()) {
      me.setCls('pictos pictos-play');
    }
  },

  onTimeupdate: function() {
    if (this._updatePlayed) {
      this.onPlaying();
    }
  },
  onPlay: function(e) {
    var me = this;
    me.setLoadingMask(Lang.Loading);
  },

  onPlaying: function(e) {
    var me = this;
    me._updatePlayed = false;
    if (!me.getAudioIcon()) {
      me.setCls('pictos pictos-pause');
    }
    me.setLoadingMask(false);
  }
});