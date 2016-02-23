Ext.define('Player.view.main.ImagePopup', {
  extend: 'Ext.Panel',
  xtype: 'imagepopup',

  centered: true,
  hidden: true,
  maxHeight: '90%',
  maxWidth: '90%',

  minHeight: 100,
  minWidth: 100,

  hideOnMaskTap: true,
  layout: {
    type: 'fit'
  },

  // modal seems to be borken 
  //modal: true,
  scrollable: 'both',
  cls: [
    'imagepopup'
  ],
  hideAnimation: 'popOut',
  showAnimation: 'popIn',
  items: [{
    xtype: 'panel',
    docked: 'bottom',
    height: 60,
    html: '',
    itemId: 'captiontext',
    styleHtmlContent: true,
    ui: 'light',
    scrollable: 'vertical'
  }, {
    xtype: 'container',
    docked: 'top',
    height: 0,
    cls: 'close-imagepopup',
    zIndex: 100,
    items: [{
      xtype: 'button',
      height: 34,
      itemId: 'closeImagePopBtn',
      ui: 'plain',
      width: 34,
      right: -20,
      top: -20,
      iconCls: 'pictos pictos-delete'
    }]
  }],
  listeners: {
    'show': 'onPanelShow'
  },
  config: {
    captionhead: '',
    captiontext: '',
    imageFile: ''
  },

  initialize: function() {
    var me = this;
    me.callParent(arguments);
    me.queryById('closeImagePopBtn').on('tap', me.onClose, me);
    me.on('painted', me.onPainted, me);
  },


  onPanelShow: function(component, options) {
    // modal seems to be borken 
    this.setModal(true);
  },

  updateCaptionhead: function(caption) {
    this._updateCaptionHtml();
  },

  updateCaptiontext: function(caption) {
    this._updateCaptionHtml();
  },

  _updateCaptionHtml: function() {
    var cap = this.getComponent('captiontext'),
      captionhead = this.getCaptionhead(),
      captiontext = this.getCaptiontext(),
      captionHtml = '';

    if (captionhead) {
      captionHtml += '<span class="captionhead">' + captionhead + '</span><br/>';
    }
    if (captiontext) {
      captionHtml += '<span class="captiontext">' + captiontext + '</span>';
    }

    if (captionHtml) {
      cap.setHtml(captionHtml);
      cap.show();
    } else {
      cap.hide();
    }
  },

  updateImageFile: function(imagePath) {
    var me = this;
    // wait till image is load; should show loading animation....
    var oldImg = this.el.dom.querySelector('img');
    if (oldImg) {
      oldImg.style.display = 'none';
    }
    var newImg = new Image();
    newImg.src = imagePath;
    newImg.onload = function(event) {
      me.onImageComplete(event.target);
      me.setHtml('<img src="' + imagePath + '"/>');
    };
  },

  onImageComplete: function(img) {
    var me = this,
      captionHeight;
    //if (me.rendered && me.isVisible()) {
    if (me.rendered) {
      captionHeight = me.queryById('captiontext').getHeight();
      me.setSize(Math.min(img.naturalWidth + 30, (window.innerWidth - 30) * .9), Math.min(img.naturalHeight + captionHeight + 30, (window.innerHeight - captionHeight - 30) * .9));
    }
  },

  onPainted: function() {
    var me = this,
      scroller = this.getScrollable(),
      img = this.el.dom.querySelector('img');
    if (img && scroller) {
      scroller.refresh(false, {
        size: {
          x: img.naturalHeight,
          y: img.naturalWidth
        },
        elementSize: {
          x: img.naturalHeight,
          y: img.naturalWidth
        }
      });
    }
  },

  onClose: function() {
    this.hide();
  },
  onResize: function() {
    var me = this;
    me.center();
  }
});