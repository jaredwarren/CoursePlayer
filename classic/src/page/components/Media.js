Ext.define('Player.page.components.Media', {
  extend: 'Ext.Component',
  xtype: 'media',
  config: {
    /**
     * @cfg {String} url
     * Location of the media to play.
     * @accessor
     */
    url: '',

    /**
     * @cfg {Boolean} enableControls
     * Set this to `false` to turn off the native media controls.
     * Defaults to `false` when you are on Android, as it doesn't support controls.
     * @accessor
     */
    enableControls: Ext.os.is.Android ? false : true,

    /**
     * @cfg {Boolean} autoResume
     * Will automatically start playing the media when the container is activated.
     * @accessor
     */
    autoResume: false,

    /**
     * @cfg {Boolean} autoPause
     * Will automatically pause the media when the container is deactivated.
     * @accessor
     */
    autoPause: true,

    /**
     * @cfg {Boolean} preload
     * Will begin preloading the media immediately.
     * @accessor
     */
    preload: true,

    /**
     * @cfg {Boolean} loop
     * Will loop the media forever.
     * @accessor
     */
    loop: false,

    /**
     * @cfg {Ext.Element} media
     * A reference to the underlying audio/video element.
     * @accessor
     */
    media: null,

    /**
     * @cfg {Number} volume
     * The volume of the media from 0.0 to 1.0.
     * @accessor
     */
    volume: 1,

    /**
     * @cfg {Boolean} muted
     * Whether or not the media is muted. This will also set the volume to zero.
     * @accessor
     */
    muted: false
  },

  constructor: function(cfg) {
    var me = this;
    cfg = cfg || {};
    this.mediaEvents = {};

    cfg.media.controls = cfg.enableControls ? 'controls' : false;

    if(cfg.loop){
      cfg.media.loop = cfg.loop;
    }
    cfg.media.src = cfg.url;

    //cfg.html = Ext.DomHelper.createHtml(cfg.media);
    //this.media = Ext.DomHelper.createDom(cfg.media);

    me.callParent([Ext.apply({
      html: Ext.DomHelper.createHtml(cfg.media)
    }, cfg)]);


    //this.media = Ext.DomHelper.append(this.protoEl, this.media);
  },

  onRender: function(view) {
    var me = this;
    me.callParent(arguments);
    
    me.media = view.query('[reference="media"]')[0];

    me.on({
      scope: me,
      show: me.onActivate,
      hide: me.onDeactivate
    });

    /*me.addMediaListener({
      canplay: 'onCanPlay',
      play: 'onPlay',
      pause: 'onPause',
      ended: 'onEnd',
      volumechange: 'onVolumeChange',
      timeupdate: 'onTimeUpdate'
    });*/
  },

  addMediaListener: function(event, fn) {
    var me = this,
      media = me.media,
      bind = Ext.Function.bind;

    Ext.Object.each(event, function(e, fn) {
      fn = bind(me[fn], me);
      me.mediaEvents[e] = fn;
      media.addEventListener(e, fn);
    });
  },

  onPlay: function() {
    this.fireEvent('play', this);
  },

  onPlaying: function() {
    this.fireEvent('play', this);
  },

  onCanPlay: function() {
    this.fireEvent('canplay', this);
  },

  onPause: function() {
    this.fireEvent('pause', this, this.getCurrentTime());
  },

  onEnd: function() {
    this.fireEvent('ended', this, this.getCurrentTime());
  },

  onVolumeChange: function() {
    this.fireEvent('volumechange', this, this.media.volume);
  },

  onTimeUpdate: function() {
    this.fireEvent('timeupdate', this, this.getCurrentTime());
  },

  /**
   * Returns if the media is currently playing.
   * @return {Boolean} playing `true` if the media is playing.
   */
  isPlaying: function() {
    return !Boolean(this.media.paused);
  },

  /**
   * @private
   */
  onActivate: function() {
    var me = this;

    if (me.getAutoResume() && !me.isPlaying()) {
      me.play();
    }
  },

  /**
   * @private
   */
  onDeactivate: function() {
    var me = this;

    if (me.getAutoPause() && me.isPlaying()) {
      me.pause();
    }
  },

  /**
   * Sets the URL of the media element. If the media element already exists, it is update the src attribute of the
   * element. If it is currently playing, it will start the new video.
   */
  updateUrl: function(newUrl) {
    return;
    var dom = this.media;

    //when changing the src, we must call load:
    //http://developer.apple.com/library/safari/#documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/ControllingMediaWithJavaScript/ControllingMediaWithJavaScript.html

    dom.src = newUrl;

    if ('load' in dom) {
      dom.load();
    }

    if (this.isPlaying()) {
      this.play();
    }
  },

  /**
   * Updates the controls of the video element.
   */
  updateEnableControls: function(enableControls) {
    //this.media.dom.controls = enableControls ? 'controls' : false;
  },

  /**
   * Updates the loop setting of the media element.
   */
  updateLoop: function(loop) {
    if(this.rendered){
      this.media.dom.loop = loop ? 'loop' : false;
    }
  },

  /**
   * Starts or resumes media playback.
   */
  play: function() {
    var dom = this.media;

    if ('play' in dom) {
      dom.play();
      Ext.defer(function() {
        dom.play();
      }, 10);
    }
  },

  /**
   * Pauses media playback.
   */
  pause: function() {
    var dom = this.media;

    if ('pause' in dom) {
      dom.pause();
    }
  },

  /**
   * Toggles the media playback state.
   */
  toggle: function() {
    if (this.isPlaying()) {
      this.pause();
    } else {
      this.play();
    }
  },

  /**
   * Stops media playback and returns to the beginning.
   */
  stop: function() {
    var me = this;

    me.setCurrentTime(0);
    me.fireEvent('stop', me);
    me.pause();
  },

  /**
   * @private
   */
  updateVolume: function(volume) {
    //this.media.dom.volume = volume;
  },

  /**
   * @private
   */
  updateMuted: function(muted) {
    //this.fireEvent('mutedchange', this, muted);

    //this.media.dom.muted = muted;
  },

  /**
   * Returns the current time of the media, in seconds.
   * @return {Number}
   */
  getCurrentTime: function() {
    return this.media.currentTime;
  },

  /*
   * Set the current time of the media.
   * @param {Number} time The time, in seconds.
   * @return {Number}
   */
  setCurrentTime: function(time) {
    this.media.currentTime = time;

    return time;
  },

  /**
   * Returns the duration of the media, in seconds.
   * @return {Number}
   */
  getDuration: function() {
    return this.media.duration;
  },

  destroy: function() {
    var me = this,
      dom = me.media,
      mediaEvents = me.mediaEvents;

    Ext.Object.each(mediaEvents, function(event, fn) {
      dom.removeEventListener(event, fn);
    });

    me.callParent();
  }
});