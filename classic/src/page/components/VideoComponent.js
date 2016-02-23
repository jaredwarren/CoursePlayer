Ext.define('Player.page.components.VideoComponent', {
  extend: 'Ext.panel.Panel',

  xtype: 'videocomponent',
  layout: 'fit',
  
  bodyStyle: 'background-color:#000;color:#fff',

  config: {
    url: undefined,
    autoPlay: false,
    controls: true,
    posterUrl: false,
    start: false,
    loopstart: false,
    loopend: false,
    loop: false,

    currentTime: undefined,
    volume: undefined
  },

  constructor: function(cfg) {
    var me = this,
      mediaCfg = {};
    cfg = cfg || {};

    mediaCfg.tag = 'video';

    // add tags
    Ext.Object.each(me.config, function(key, value) {
      value = (typeof cfg[key] != 'undefined') ? cfg[key] : value;
      if (value !== false) {
        mediaCfg[key] = value;
      }
    });

    mediaCfg.children = [];

    if(cfg.url){
      // handle multiple sources
      var src = cfg.url;
      if (!Ext.isArray(src)) {
        src = [src];
      }
      // create test video element to test we can play types
      var testVideo = document.createElement('video');
      // add sources
      Ext.Array.each(src, function(srcObj, index) {
        if (typeof srcObj !== 'string') {
          srcObj.tag = 'source';
          if (!srcObj.type) {
            srcObj.type = me._getVideoType(srcObj.src);
          }
        } else {
          srcObj = srcObj.replace(/https?:/, window.location.protocol);
          srcObj = {
            tag: 'source',
            src: srcObj,
            type: me._getVideoType(srcObj)
          };
        }
        if ( !! srcObj.src && testVideo.canPlayType(srcObj.type)) {
          mediaCfg.children.push(srcObj);
        }
      });
      // do I need the source as an attribute anymore???
      mediaCfg.src = mediaCfg.url;
      delete mediaCfg.url;

      if (cfg.tracks) {
        var tracks = cfg.tracks;
        if (!Ext.isArray(tracks)) {
          tracks = [tracks];
        }
        Ext.Array.each(tracks, function(track, index) {
          if (Ext.isObject(track)) {
            track.tag = 'track';
            // validate track
            if (track.kind.match(/captions|chapters|descriptions|metadata|subtitles/)) {
              if (track.kind == 'subtitles' && !track.srclang) {
                return;
              }
              mediaCfg.children.push(track);
            }
          }
        });
      }
      // {
      //   default: true,
      //   src: 'subtitles_en.vtt',
      //   kind: 'subtitles',
      //   srclang: 'en', // required if kind="subtitles"
      //   label: 'English'
      // }
      // kinds:
      //  captions
      //  chapters
      //  descriptions
      //  metadata
      //  subtitles

      // force style
      mediaCfg.style = "width:100%;height:100%";
      html = Ext.DomHelper.createHtml(mediaCfg);
    }
    else{
      html = Lang.videoplayer.no_video_found;
    }
    

    me.callParent([Ext.apply({
      html: html
    }, cfg)]);
  },

  _getVideoType: function(src) {
    var ext = src.split('.').pop();
    switch (ext) {
      case 'mp4':
        return 'video/mp4';
      case 'ogg':
        return 'video/ogg';
      case 'webm':
        return 'video/webm';
      default:
        console.warn("Unsupported media type:(" + ext + "):", src);
        return null;
    }
  },

  /*
  Accessors
  */
  getState: function() {
    if (this.video.paused) {
      return 'paused';
    } else {
      return 'playing';
    }
  },

  /*Action */
  play: function() {
    this.video.play();
  },
  pause: function() {
    this.video.pause();
  },

  toggle: function() {
    if (this.video.paused) {
      this.video.play();
    } else {
      this.video.pause();
    }
  },


  updateCurrentTime: function(currentTime) {
    var me = this;
    if (me.rendered) {
      me.video.currentTime = currentTime;
    }
  },

  updateVolume: function(volume) {
    var me = this;
    if (me.rendered) {
      me.video.volume = volume / 100;
    }
  },


  /*
  Other Stuff
  */
  mediaEvents: [
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
    "waiting",
    // Full Screen Events
    "fullscreenchange",
    "webkitfullscreenchange",
    "mozfullscreenchange",
    "MSFullscreenChange",
    // unofficial events
    "canshowcurrentframe",
    "dataunavailable",
    "mozaudioavailable"
  ],
  afterRender: function() {
    var me = this,
      videoDom = me.body.query('video')[0];
    me.callParent(arguments);

    me.video = videoDom;
    me.supported = (videoDom && videoDom.tagName.toLowerCase() == 'video');
    if (me.supported) {
      Ext.Array.each(me.mediaEvents, function(name, index, mediaEvents) {
        videoDom.addEventListener(name, function(e) {
          me.fireEvent(e.type, e);
        }, true);
      });
    }
  },

  onDestroy: function() {
    var me = this,
      videoDom = me.video;
    if (me.supported && videoDom) {
      if (videoDom && videoDom.pause) {
        videoDom.pause();
      }
      //video.remove();
      me.video = null;
    }
    me.callParent(arguments);
  }
});