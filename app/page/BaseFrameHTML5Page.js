Ext.define('Player.page.BaseFrameHTML5Page', {
  extend: 'Player.page.Page',

  layout: 'fit',
  scrollable: {
    direction: 'vertical',
    directionLock: true
  },

  constructor: function(cfg) {
    var me = this;
    cfg = cfg || {};

    me.callParent([Ext.apply({
      items: [{
        xtype: 'panel',
        layout: 'fit',
        itemId: 'pageHtml'
      }]
    }, cfg)]);
  },

  onIframeContentLoaded: function(e) {
    var me = this,
      width, height,
      iframe;

    iframe = document.getElementById('myiframeCnt' + me.id);

    if (iframe.contentDocument.height <= 150) {
      iframe.height = mp.el.getHeight();
    } else {
      iframe.height = iframe.contentDocument.height;
    }

    iframe.width = mp.el.getWidth();
  },
  onIframeLoaded: function(iframe) {
    var me = this;
    me.resize(iframe);
    me.addIframeListeners();
    me.setLoadingMask(false);
  },
  resize: function(iframe) {
    var me = this,
      mp = Ext.getCmp('mainPages'),
      mpWidth = mp.el.dom.clientWidth,
      mpHeight = mp.el.dom.clientHeight;
    iframe.width = mpWidth;
    iframe.height = mpHeight;
    try {
      var iframeBody = iframe.contentDocument.body;
      scaleX = mpWidth / iframeBody.scrollWidth,
      scaleY = mpHeight / iframeBody.scrollHeight,
      scale = 1.0;
      scale = (scaleX < scaleY) ? scaleX : scaleY;
      if (scale > 1) {
        scale = 1.0;
      }
      iframeBody.style.setProperty('-webkit-transform', 'scale(' + scale + ')');
      iframeBody.style.setProperty('-webkit-transform-origin', '0 0');
    } catch (e) {
      console.error("scale Error:" + e);
    }
  },
  onOrientationChange: function() {
    var me = this;
    iframe = document.getElementById('myiframeCnt' + me.id);
    if (iframe) {
      console.log("onOrientationChange...");
      me.resize(iframe);
    }
  },
  setIframeHeight: function(iframe, height) {
    iframe.height = iframe.contentDocument.height;
    var h1 = iframe.contentDocument.body.clientHeight;
    var h2 = iframe.contentDocument.height;
  },
  setPageHtml: function() {
    var me = this,
      mp = Ext.getCmp('mainPages'),
      width, height,
      random = Math.round(Math.random() * 1000),
      iframe,
      pData = me.config;

    me.setLoadingMask(Lang.Loading);

    width = (pData.width) ? pData.width : mp.el.getWidth();
    height = (pData.height) ? pData.height : mp.el.getHeight();

    iframe = document.createElement('iframe');
    if (Ext.os.is.Phone && pData.phoneHtml) {
      iframe.setAttribute("src", pData.phoneHtml + '?r=' + random);
    } else {
      iframe.setAttribute("src", pData.tabletHtml + '?r=' + random);
    }

    iframe.setAttribute("id", 'myiframeCnt' + me.id);
    iframe.setAttribute("style", "background-color:white;");
    iframe.setAttribute("frameborder", 0);

    iframe.onload = function() {
      me.onIframeLoaded.call(me, iframe);
    };

    var bodyEl = me.getBodyEl();
    while (bodyEl.firstChild) {
      bodyEl.removeChild(bodyEl.firstChild);
    }
    bodyEl.appendChild(iframe);
  },
  addIframeListeners: function() {},

  start: function() {
    var me = this;
    me.callParent(arguments);

    me.setPageHtml();
  },
  close: function() {
    var me = this;
    Ext.Array.each(me.query('video'), function(video, index, items) {
      video.pause();
      video.media.setTop(-2000);
      video.ghost.show();
    });
    Ext.Array.each(me.query('audio'), function(audio, index, items) {
      audio.pause();
    });
  }
});