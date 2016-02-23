Ext.define('Player.page.components.VideoControls', {
  extend: 'Ext.container.Container',

  xtype: 'videocontrols',

  requires: [
    'Ext.slider.Single',
    'Ext.toolbar.Toolbar',
    'Ext.button.Button',
    'Ext.toolbar.TextItem',
    'Ext.toolbar.Fill'
  ],

  layout: {
    type: 'vbox',
    align: 'center',
    pack: 'center'
  },
  scrollable: false,

  height: 94,
  width: 600,


  config: {
    time: 0,
    maxTime: 0,
    enableFullscreen: false,
    enableCaption: false
  },


  constructor: function(cfg) {
    var me = this;
    cfg = cfg || {};

    me.callParent([Ext.apply({
      items: [{
        xtype: 'slider',
        itemId: 'timeSlider',
        width: '100%',
        disabled: true,
        decimalPrecision: 2,
        value: 0,
        maxValue: 100,
        listeners: {
          changecomplete: me.onScrubberChange,
          scope: me
        }
      }, {
        xtype: 'toolbar',
        width: '100%',
        items: [{
          xtype: 'button',
          itemId: 'playBtn',
          disabled: true,
          iconCls: 'pictos pictos-play',
          listeners: {
            click: me.onPlayClick,
            scope: me
          }
        }, {
          xtype: 'toolbar',
          //layout: 'hbox',
          //width: 120,
          items: [{
            xtype: 'button',
            itemId: 'volumeBtn',
            iconCls: 'pictos pictos-volume',
            enableToggle: true,
            listeners: {
              click: me.onVolumeClick,
              scope: me
            }
          }, {
            xtype: 'slider',
            itemId: 'volumeSlider',
            hidden: true,
            width: 50,
            //opacity: 0,
            value: 6,
            listeners: {
              change: me.onVolumeChange,
              scope: me
            }
          }],
          listeners: {
            mouseenter: {
              fn: me.onVolumeEnter,
              element: 'el',
              scope: me
            },
            mouseleave: {
              fn: me.onVolumeLeave,
              element: 'el',
              scope: me
            }
          }
        }, {
          xtype: 'tbtext',
          itemId: 'timeText',
          html: '00:00:00/00:00:00'
        }, {
          xtype: 'tbfill'
        }, {
          xtype: 'button',
          itemId: 'ccBtn',
          hidden: cfg.enableCaption,
          text: 'CC',
          enableToggle: true,
          listeners: {
            click: me.onCaptionClick,
            scope: me
          }
        }, {
          xtype: 'button',
          itemId: 'fullScreenBtn',
          iconCls: 'pictos pictos-expand'
        }]
      }]
    }, cfg)]);
  },
  onVolumeEnter: function() {
    var me = this,
      volumeSlider = me.queryById('volumeSlider');
    volumeSlider.show();
    /*Ext.create('Ext.fx.Animator', {
      target: this.queryById('volumeSlider'),
      duration: 1000, // 10 seconds
      keyframes: {
        0: {
          opacity: 0,
          width: 0
        },
        100: {
          opacity: 1,
          width: 50
        }
      }
    });*/
  },
  onVolumeLeave: function() {
    var me = this,
      volumeSlider = me.queryById('volumeSlider');
    if (!volumeSlider.dragging) {
      volumeSlider.hide();
    }
    /*Ext.create('Ext.fx.Animator', {
      target: this.queryById('volumeSlider'),
      duration: 1000, // 10 seconds
      keyframes: {
        0: {
          opacity: 1,
          width: 50
        },
        100: {
          opacity: 0,
          width: 0
        }
      }
    });*/
  },

  onRender: function() {
    var me = this;
    me.callParent(arguments);
  },


  canPlay: function(canPlay) {
    var me = this;
    me.queryById('playBtn').setDisabled(!canPlay);
    me.queryById('timeSlider').setDisabled(!canPlay);
    me.queryById('timeText').setHtml(me.toHHMMSS(0) + "/" + me.toHHMMSS(me.getMaxTime()));
  },

  _video: undefined,
  setVideo: function(videoEl) {
    var me = this;
    me._video = videoEl;

    // add full screen directly to button dom because of security
    me.queryById('fullScreenBtn').el.dom.addEventListener("click", function(e) {
      me.onFullscreenClick.call(me, e);
    }, true);
  },

  updateMaxTime: function(maxTime) {
    if (this.rendered) {
      this.queryById('timeSlider').setMaxValue(maxTime);
    }
  },

  updateTime: function(time) {
    var me = this;
    if (me.rendered) {
      var timeSlider = me.queryById('timeSlider');
      if (!timeSlider.dragging) {
        timeSlider.setValue(time);
      }
      me.queryById('timeText').setHtml(me.toHHMMSS(time) + "/" + me.toHHMMSS(me.getMaxTime()));
    }
  },

  onPlay: function() {
    this.queryById('playBtn').setIconCls('pictos pictos-pause');
  },
  onPause: function() {
    this.queryById('playBtn').setIconCls('pictos pictos-play');
  },

  /*
  Relay Events
  */
  onPlayClick: function(button, e, eOpts) {
    this.fireEvent('playclick', button, e, eOpts);
  },
  onScrubberChange: function(slider, newValue, thumb, eOpts) {
    this.fireEvent('scrubberchange', slider, newValue, thumb, eOpts);
  },
  _previousVolume: 0,
  onVolumeClick: function(button, e, eOpts) {
    var me = this,
      volumeSlider = me.queryById('volumeSlider');
    if (button.pressed) {
      me._previousVolume = volumeSlider.getValue();
      volumeSlider.setValue(0);
    } else {
      volumeSlider.setValue(me._previousVolume);
    }
  },
  onVolumeChange: function(slider, newValue, thumb, eOpts) {
    var me = this,
      volumeBtn = me.queryById('volumeBtn');
    if (newValue > 0) {
      volumeBtn.setPressed(false);
      me._previousVolume = newValue;
      volumeBtn.setIconCls('pictos pictos-volume');
    }
    else{
      volumeBtn.setIconCls('pictos pictos-volume_mute');
    }
    this.fireEvent('volumechange', slider, newValue, thumb, eOpts);
  },
  onFullscreenClick: function(button, e, eOpts) {
    var me = this,
      button = me.queryById('fullScreenBtn');
    me.beginFullScreen(button, e, eOpts);
  },
  beginFullScreen: function(button, e, eOpts) {
    var me = this,
      videoElement = me._video;
    if (videoElement.requestFullscreen) {
      videoElement.requestFullscreen();
    } else if (videoElement.mozRequestFullScreen) {
      videoElement.mozRequestFullScreen();
    } else if (videoElement.webkitRequestFullscreen) {
      videoElement.webkitRequestFullscreen();
    } else if (videoElement.msRequestFullscreen) {
      videoElement.msRequestFullscreen();
    } else {
      alert("Fullscreen not supported");
      console.warn("Fullscreen not supported");
    }
  },
  // Whack fullscreen
  exitFullscreen: function() {
    var me = this;
    // don't do anything for now...
    return;
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  },

  onFullscreenchange: function(e, eOpts) {
    var me = this;
    console.info("VideoControls::onFullscreenchange", window.innerHeight != screen.height);
    if( window.innerHeight != screen.height) {
      me.exitFullscreen();
    }
  },

  onCaptionClick: function(button, e, eOpts) {
    this.fireEvent('captionclick', button, e, eOpts);
  },

  /*
  utilities
  */
  toHHMMSS: function(seconds) {
    var sec_num = parseInt(seconds, 10);
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    // 0 pad string
    var time = '';
    // Hours: only show if greater than 0
    if (hours < 10 && hours > 0) {
      time += "0" + hours + ":";
    } else if (hours <= 0) {
      time += '';
    } else {
      time += hours + ":";
    }
    // Minutes: always show, event if 0
    if (minutes < 10) {
      time += "0" + minutes + ":";
    } else {
      time += minutes + ":";
    }
    // Seconds: alwasys show, even if 0
    if (seconds < 10) {
      time += "0" + seconds;
    } else {
      time += seconds;
    }
    return time;
  }
});