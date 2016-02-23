Ext.define('Player.page.components.TextImage', {
  extend: 'Player.page.components.BaseTextImage',

  xtype: 'textimage',

  /*
  layout: 'auto',
  */
  layout: {
    type: 'vbox',
    align: 'stretch',
    pack: 'center'
  },

  initialize: function() {
    var me = this;
    me.callParent(arguments);
    me.element.on('tap', me.imageTapHandler, me);
    //me.on('painted', me.onPainted, me);
    me.on('resize', me.onResize, me);
  },

  createPopup: function(cfg) {
    var me = this,
      imagePopup = me.imagePopup;
    if (!imagePopup) {
      imagePopup = Ext.create('Player.view.main.ImagePopup', {
        itemId: 'imagePopup',
        imageFile: cfg.imageFile,
        captionhead: cfg.captionhead,
        captiontext: cfg.captiontext
      });
      me.imagePopup = Ext.Viewport.add(imagePopup);
      return me.imagePopup;
    }
    return imagePopup;
  },

  repositionZoomImage: function(img) {
    var me = this,
      zoo = me.el.dom.querySelector('.imageicon'),
      imBounds = img.getBoundingClientRect(),
      zooBounds;
    if (zoo) {
      zoo.hidden = false;
      zooBounds = zoo.getBoundingClientRect();
      var left = (imBounds.width + img.offsetLeft - zooBounds.width);
      var top = (imBounds.height + img.offsetTop - zooBounds.height);
      zoo.setAttribute("style", "position: absolute; left:" + left + "px;top:" + top + "px; width: 24px; height: 24px; background: rgba(100, 100, 100, .8);");
      if (zoo.classList.contains('zoom') && imBounds.width > img.naturalWidth && imBounds.height > img.naturalHeight) {
        zoo.style.display = 'none';
      }
    }
  },
  
  onResize: function() {
    this.onImageResize();
  }
});