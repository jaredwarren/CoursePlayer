Ext.define('Player.page.components.BaseVideoPlayer', {
  extend: 'Ext.Panel',

  layout: {
    align: 'center',
    pack: 'center',
    type: 'vbox'
  },

  config: {
    src: undefined,
    autoPlay: false,
    videoWidth: undefined,
    videoHeight: undefined,
    poster: undefined,
    mediaPos: undefined
  },

  videoLoaded: false,

  constructor: function(cfg) {
    var me = this,
      items = cfg.items || [];
    cfg = cfg || {};

    var videoConfig = me.createVideoComponent(cfg);
    items.push(videoConfig);

    if (!cfg.nativeControls && videoConfig.videoType == 'local') {
      items.push({
        xtype: 'videocontrols',
        itemId: 'videoControls',
        enableCaption: !(videoConfig.tracks && videoConfig.tracks.length > 0),
        enableFullscreen: me.fullScreenAvailable(),
        listeners: {
          scrubberchange: me.onScrubberChange,
          playclick: me.onPlayClick,
          volumechange: me.onVolumeChange,
          captionclick: me.onCaptionClick,
          scope: me
        }
      });
    }

    me.callParent([Ext.apply({
      items: [{
        xtype: 'panel',
        region: 'center',
        itemId: 'videoContainer',
        items: items
      }, {
        xtype: 'panel',
        region: 'south',
        itemId: 'videoState',
        hidden: true,
        html: Lang.videoplayer.Loading
      }]
    }, cfg)]);
  },

  createVideoComponent: function(cfg) {
    var me = this,
      srcUrl = cfg.url;
    if (Ext.isArray(srcUrl)) {
      srcUrl = srcUrl[0];
      if (Ext.isObject(srcUrl)) {
        srcUrl = srcUrl.url;
      }
    }

    if (!srcUrl || srcUrl.length == 0) {
      return {
        xtype: 'component',
        html: Lang.videoplayer.No_Source
      };
    }

    // assume 4/6 aspect ratio for now
    var pagesRect = Ext.getCmp('mainPages').el.dom.getBoundingClientRect(),
      videoWidth = cfg.videoWidth || pagesRect.width,
      videoHeight = cfg.videoHeight || pagesRect.width * (2 / 3),
      videoType = 'local',
      videoComponent = {
        xtype: 'component'
      };

    // Make sure video isn't too tall
    if (videoHeight > pagesRect.height) {
      videoHeight = pagesRect.height * .9;
      videoWidth = pagesRect.height * (3 / 2);
    }
    // try to convert rtmp to m3u8.  I think I only need to do this for mobile, but for now do it for everything.
    if (srcUrl.match(/rtmp:\/\//)) {
      var matches = srcUrl.match(/rtmp:\/\/(.+\.influxis\.com\/).+:(.+)/);
      if (matches && matches.length > 2) {
        srcUrl = 'http://' + matches[1] + 'hls-vod' + matches[2] + '.m3u8';
      }
      var matches = srcUrl.match(/rtmp:\/\/(draco\.streamingwizard\.com\/).+:(.+)/);
      if (matches && matches.length > 2) {
        //http://draco.streamingwizard.com/wizard/_definst_/mp4:demo/sample.mp4/playlist.m3u8
        srcUrl = 'http://' + matches[1] + 'wizard/_definst_/mp4:' + matches[2] + '/playlist.m3u8';
      }
    }

    if (srcUrl.search(/^https?:\/\/youtu\.be\//) === 0 || srcUrl.search(/^https?:\/\/www.youtube.com\//) === 0 || srcUrl.search(/^https?:\/\/vimeo.com\//) === 0) {
      videoType = 'youtube';
      var tempSrc;
      if (srcUrl.search(/https:\/\//)) {
        tempSrc = 'https://'
      }
      // Convert url to embeded ifram html.
      if (srcUrl.search(/www\.youtube\.com\/watch/) >= 0) {
        videoId = srcUrl.match(/[\\?&]v=([^&#]*)/)[0].substring(3);
        tempSrc += "www.youtube.com/embed/" + videoId;
        srcUrl = tempSrc;
      } else if (srcUrl.search(/youtu.be/) >= 0) {
        videoId = srcUrl.split('/')[3];
        tempSrc += "www.youtube.com/embed/" + videoId;
        srcUrl = tempSrc;
      }
      videoComponent.html = '<center id="video-' + me.id + '"><iframe width="' + videoWidth + '" height="' + videoHeight + '" src="' + srcUrl + '" frameborder="0" allowfullscreen></iframe></center>';
    } else if (srcUrl.search(/^https?:\/\/bcove\.me\//) === 0 || srcUrl.search(/^https?:\/\/link.brightcove.com\//) === 0 || srcUrl.search(/^https?:\/\/www.brightcove.com\//) === 0) {
      videoType = 'brightcove';
      videoComponent.html = '<center id="video-' + me.id + '"><iframe width="' + videoWidth + '" height="' + videoHeight + '" src="' + srcUrl + '" frameborder="0" allowfullscreen></iframe></center>';
    } else if (srcUrl.search(/^https?:\/\/player\.vimeo\.com\//) === 0) {
      videoType = 'vimeo';
      videoComponent.html = '<center id="video-' + me.id + '"><iframe src="' + srcUrl + '" width="' + videoWidth + '" height="' + videoHeight + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></center>';
    } else if (srcUrl.search(/draco\.streamingwizard\.com/) >= 0) {
      videoType = 'draco';
      videoComponent.html = '<center id="video-' + me.id + '"><iframe width="' + videoWidth + '" height="' + videoHeight + '" src="' + srcUrl + '" frameborder="0" allowfullscreen></iframe></center>';
    } else {
      if (srcUrl.search(/influxis/) >= 0) {
        cfg.url = srcUrl;
      }
      videoType = 'local';
      videoComponent = {
        xtype: 'videocomponent',
        height: videoHeight,
        width: videoWidth,
        itemId: 'videoPlayer',
        posterUrl: cfg.poster || 'resources/images/video_play.png',
        url: cfg.url,
        controls: cfg.nativeControls || false,
        loop: cfg.loop || false,
        preload: cfg.preload || 'none',
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
          fullscreenchange: me.onFullscreenchange,
          webkitfullscreenchange: me.onFullscreenchange,
          mozfullscreenchange: me.onFullscreenchange,
          MSFullscreenChange: me.onFullscreenchange,
          scope: me
        }
      }
    }
    videoComponent.videoType = cfg.videoType || videoType;
    me.videoType = videoComponent.videoType;
    return videoComponent;
  },

  onResize: function(sender, width, height, oldWidth, oldHeight, eOpts) {},

  resizeVideo: function() {
    var me = this,
      videoEl = me.getVideoEl();

    if (videoEl) {
      var videoPlayer = me.queryById('videoPlayer'),
        aspect = videoEl.videoHeight / videoEl.videoWidth,
        mp = Ext.getCmp('mainPages'),
        pagesRect,
        mediaPos = me.getMediaPos();

      if (mp.bodyElement) {
        pagesRect = mp.bodyElement.el.dom.getBoundingClientRect()
      }
      if (mp.body) {
        pagesRect = mp.el.dom.getBoundingClientRect()
      }

      // if text and video, use page content size, not mainPages
      if (mediaPos == 'left' || mediaPos == 'right') {
        pagesRect = me.el.dom.getBoundingClientRect();
      } else {

      }


      var videoWidth = me.getVideoWidth() || pagesRect.width * .9,
        videoHeight = me.getVideoHeight() || videoWidth * aspect;

      // if width or height is 0 use default
      if (videoWidth <= 100 || videoHeight <= 100) {
        videoWidth = pagesRect.width;
        videoHeight = pagesRect.width * (2 / 3);
      }

      // make sure video isn't too tall
      var videoControls = me.queryById('videoControls');
      var maxHeight = pagesRect.height;
      if (videoControls && (mediaPos != 'left' && mediaPos != 'right')) {
        maxHeight = maxHeight - videoControls.el.dom.getBoundingClientRect().height;
      }

      if (videoHeight > maxHeight) {
        videoHeight = (maxHeight * .9);
        videoWidth = videoHeight * (1 / aspect);
      }

      /*
      videoWidth = videoEl.videoWidth;
      videoHeight = videoEl.videoHeight;
      */
      videoPlayer.setWidth(videoWidth);
      videoPlayer.setHeight(videoHeight);
      // set control size
      var videoControls = me.queryById('videoControls');
      if (videoControls) {
        videoControls.setWidth(videoWidth);
      }
    }
  },

  /*
  Accessors
  */
  getState: function() {
    var me = this,
      videoPlayer = me.queryById('videoPlayer');
    if (videoPlayer) {
      return videoPlayer.getState();
    }
    return "unknown";
  },

  getVideoEl: function() {
    var me = this,
      videoPlayer = me.queryById('videoPlayer');
    if (videoPlayer) {
      return videoPlayer.video;
    }
  },

  /*
  Action Items
  */
  onCanPlay: function() {
    var me = this,
      videoControls = me.queryById('videoControls');
    if (videoControls) {
      videoControls.canPlay(true);
      videoControls.setVideo(this.getVideoEl());
    }
    me.setLoadingMask(false);
    me.videoLoaded = true;
    me.resizeVideo();
  },
  onLoadStart: function(e) {
    var me = this,
      vs = me.queryById('videoState');

    //debugger;
    if (!me.getAutoPlay()) {
      me.setLoadingMask(false);
    } else {
      //me.setLoadingMask(Lang.videoplayer.Loading);
    }
    if (vs) {
      //vs.setHtml(Lang.videoplayer.Click_To_Play);
    }
    me.showVideo();
  },
  onCanPlayThrough: function() {
    var me = this;
    me.setLoadingMask(false);
    me.videoLoaded = true;
  },
  onPlay: function(e) {
    var me = this,
      vs = me.queryById('videoState');
    me.setLoadingMask(Lang.videoplayer.Loading);
    vs.setHtml("loading");
  },
  onPause: function(e) {
    var me = this,
      videoControls = me.queryById('videoControls');
    if (videoControls) {
      videoControls.onPause();
    }
  },
  onPlaying: function(e) {
    var me = this,
      vc = me.queryById('videoContainer'),
      videoControls = me.queryById('videoControls');
    if (videoControls) {
      videoControls.onPlay();
    }
    me.setLoadingMask(false);
  },
  onEnded: function(e) {
    var me = this;
    me.fireEvent('complete', me);
  },
  onErased: function(e) {
    //this.showVideo();
  },
  onError: function(e) {
    if (e.currentTarget.error == null) {
      return;
    }
    console.error("Video Error", e.currentTarget.error);
    var me = this,
      vc = me.queryById('videoContainer'),
      vs = me.queryById('videoState');
    me.setLoadingMask(false);
    if (vc) {}
    if (vs) {
      vs.setHtml(Lang.videoplayer.Video_Error);
    }
  },
  eventHandler: function(e) {
    /*if (e.type != 'timeupdate' && e.type != 'progress') {
      console.log("~~~~~~~~~~~~e:" + e.type);
    }*/
  },
  onLoadedMetadata: function(e, f, g) {
    var me = this,
      videoControls = me.queryById('videoControls');
    if (videoControls) {
      videoControls.setMaxTime(e.target.duration);
    }
  },
  onTimeUpdate: function(e) {
    var me = this,
      videoControls = me.queryById('videoControls');
    if (videoControls) {
      videoControls.setTime(e.target.currentTime);
    }
    me.fireEvent('timeupdate', e);
  },

  play: function() {
    var me = this,
      videoPlayer = me.queryById('videoPlayer');
    if (videoPlayer) {
      videoPlayer.play();
    }
  },
  pause: function() {
    var me = this,
      videoPlayer = me.queryById('videoPlayer');
    if (videoPlayer) {
      videoPlayer.pause();
    }
  },

  /*
  Controller Events
  */
  onPlayClick: function(button, e, eOpts) {
    var me = this,
      videoPlayer = me.queryById('videoPlayer');
    if (videoPlayer) {
      videoPlayer.toggle();
    }
  },

  onScrubberChange: function(slider, newValue, thumb, eOpts) {
    var me = this,
      videoPlayer = me.queryById('videoPlayer');
    if (videoPlayer) {
      videoPlayer.setCurrentTime(newValue);
    }
  },

  onVolumeChange: function(slider, newValue, thumb, eOpts) {
    var me = this,
      videoPlayer = me.queryById('videoPlayer');
    if (videoPlayer) {
      videoPlayer.setVolume(newValue);
    }
  },
  showControls: function() {
    var me = this,
      videoControls = me.queryById('videoControls');
    if (videoControls) {
      videoControls.show();
    }
  },
  hideControls: function() {
    var me = this,
      videoControls = me.queryById('videoControls');
    if (videoControls) {
      videoControls.hide();
    }
  },

  /*
  Full Screen 
  I can't get it to work because event must be based on user action
  */
  fullScreenAvailable: function() {
    return (window.requestFullscreen || window.mozRequestFullScreen || window.webkitRequestFullscreen || window.msRequestFullscreen);
  },

  onFullscreenchange: function(e, eOpts) {
    var me = this,
      videoControls = me.queryById('videoControls');
    if (videoControls) {
      videoControls.onFullscreenchange(e, eOpts);
    }
  },

  /*
  Cat
  */
  onCaptionClick: function(button, e, eOpts) {
    var me = this,
      videoPlayer = me.queryById('videoPlayer');
    if (videoPlayer) {
      videoPlayer.toggleCaption(button.pressed);
    }
  },

  /*
  Other Stuff

  These were here to fix a problem in the mobile/modern player, It's not necessary to hide the video on the desktop/classic
  */
  hideVideo: function(e) {
    var me = this;
    Ext.Array.each(me.el.dom.querySelectorAll('video'), function(video, index, items) {
      video.pause();
    });
  },
  showVideo: function(e) {
    var me = this;
    me.resizeVideo();
  },
  start: function() {
    var me = this,
      videoEl = me.getVideoEl();

    if (videoEl && videoEl.readyState <= 0) {
      me.setLoadingMask(Lang.Loading);
    }
    me.showVideo();
    if (me.autoPlay) {
      me.play();
    }
  }
});