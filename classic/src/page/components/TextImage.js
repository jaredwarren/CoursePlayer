Ext.define('Player.page.components.TextImage', {
  extend: 'Player.page.components.BaseTextImage',

  xtype: 'textimage',

  // fixes layout run failed problem
  anchor: "100% 100%",
  scrollable: 'vertical',
  styleHtmlContent: true,

  onRender: function(e, f, g) {
    var me = this;
    me.callParent(arguments);

    me.el.on('click', me.imageTapHandler, me);
    ApplyMathJax(me.el.dom);
  },

  onResize: function() {
    var me = this;
    me.callParent(arguments);
    me.onImageResize();
  },

  onImageComplete: function(img) {
    var me = this;
    me.callParent(arguments);
  },

  repositionZoomImage: function(img) {
    var me = this,
      zoo = me.el.dom.querySelector('.imageicon'),
      imBounds = img.getBoundingClientRect(),
      zooBounds;
    if (zoo) {
      zoo.hidden = false;
      zooBounds = zoo.getBoundingClientRect();
      var left = (imBounds.width + imBounds.left - zooBounds.width);
      var top = (imBounds.height + imBounds.top - zooBounds.height) - 42;
      zoo.setAttribute("style", "position: fixed; left:" + left + "px;top:" + top + "px; width: 24px; height: 24px; background: rgba(100, 100, 100, .8);");
      if (zoo.classList.contains('zoom') && imBounds.width > img.naturalWidth && imBounds.height > img.naturalHeight) {
        zoo.style.display = 'none';
      }
    }
  },

  createPopup: function(cfg) {
    var me = this,
      imagePopup = me.imagePopup;
    if (!imagePopup) {
      me.imagePopup = Ext.create('Player.view.main.ImagePopup', {
        itemId: 'imagePopup',
        imageFile: cfg.imageFile,
        captionhead: cfg.captionhead,
        captiontext: cfg.captiontext
      });
      return me.imagePopup;
    }
    return imagePopup;
  }
});