Ext.define('Player.page.CustomHTML5Page', {
  extend: 'Player.page.Page',

  width: '100%',
  scrollable: {
    direction: 'vertical',
    directionLock: true
  },

  config: {
    html5Text: undefined,
    sourceType: 'static'
  },

  constructor: function(cfg) {
    var me = this,
      html = '';
    cfg = cfg || {};

    html = me.filterPText(cfg.html5Text);
    if (!html) {
      html = me.filterPText(cfg.pText);
    }

    if(cfg.sourceType != 'static'){
      html = 'Wrong pType, should be FrameHTML5Page';
    }
    me.callParent([Ext.apply({
      items: [{
        xtype: 'container',
        itemId: 'pageText',
        styleHtmlContent: true,
        html: html
      }]
    }, cfg)]);
  },

  close: function() {
    var audio = this.el.query('audio'),
      video = this.el.query('video');
    for (var i = audio.length - 1; i >= 0; i--) {
      audio[i].pause();
    };
    for (var i = video.length - 1; i >= 0; i--) {
      video[i].pause();
    };
  },
  // For some stupid reason this stupid hack doesn't work with this page
  hideScroller: function() {
    // DO NOTHING
  }
});