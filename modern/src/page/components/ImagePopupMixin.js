Ext.define('Player.page.components.ImagePopupMixin', {
  extend: 'Ext.Base',

  mixinConfig: {
    id: 'imagepopupmixin'
  },

  //DEPRECATED!!!!!!!!!!

  requires: ['Player.view.main.ImagePopup'],

  config: {
    popupImageFile: '',
    captionhead: '',
    captiontext: '',
    imagePopupData: {},
    imagePopup: {
      xtype: 'imagepopup',
      hideAnimation: 'popOut',
      showAnimation: 'popIn'
    }
  },


  updatePopupImageFile: function(imageFile) {
    if(imageFile){
      
    }
    
  },

  updateCaptionhead: function(captionhead) {
    
  },
  updateCaptiontext: function(captiontext) {
    
  },

  updateImagePopupData: function(newPopupData, oldPopupData) {
    if (!newPopupData.pType) {
      newPopupData.pType = '';
      return;
    }
    var me = this,
      popupConfig = {},
      imageFile, capHead, capText;

    if (newPopupData.imageFile) {
      imageFile = newPopupData.imageFile;
    }

    if (imageFile) {
      popupConfig = Ext.Object.merge(popupConfig, {
        imageFile: imageFile
      });
    } else {
      popupConfig = Ext.Object.merge(popupConfig, {
        html: "No Image File"
      });
    }

    capHead = newPopupData.captionhead;
    capText = newPopupData.captiontext;
    if (capHead || capText) {
      popupConfig = Ext.Object.merge(popupConfig, {
        captionHead: capHead,
        captionText: capText
      });
    }

    me.imagePopup = Ext.create('Player.view.main.ImagePopup', popupConfig);
    me.isResized = false;

    ApplyMathJax(me.element.dom);
  },

  closeImagePopup: function() {
    this.imagePopup.hide();
  },

  showImagePopup: function() {
    var me = this;
    if (!me.isResized) {
      var newImg = new Image();
      newImg.src = me.getImagePopupData().imageFile;
      newImg.onload = function(event) {
        me.resizePopup(event.target);
      };
    }

    me.imagePopup.show();
    me.resizeScroller();
  },

  resizePopup: function(img) {
    var me = this,
      imgHeight = img.height,
      imgWidth = img.width,
      popWidth = 200,
      popHeight = 400,
      captionHeight = 0,
      imagePopup = me.imagePopup;

    if (imgWidth < 200) {
      imgWidth = 200;
    }

    if (imgWidth > me.element.dom.clientWidth * 0.9) {
      popWidth = me.element.dom.clientWidth * 0.9;
    } else {
      popWidth = imgWidth + 10;
    }

    if (imgHeight < 200) {
      imgHeight = 200;
    }
    if (imgHeight > me.element.dom.clientHeight * 0.9) {
      popHeight = me.element.dom.clientHeight * 0.9;
    } else {
      if (imagePopup.getCaptionText() || imagePopup.getCaptionHead()) {
        captionHeight = 60;
      }
      popHeight = imgHeight + 10 + captionHeight;
    }
    imagePopup.setWidth(popWidth);
    imagePopup.setHeight(popHeight);
  },
  resizeScroller: function() {
    var me = this,
      scb = me.imagePopup.getScrollable(),
      imageSize = scb.getScroller().getSize(),
      containerSize = scb.getScroller().getContainerSize(),
      ind = scb.getIndicators();

    if (imageSize.x > containerSize.x) {
      ind.x.show();
    }
    if (imageSize.y > containerSize.y) {
      ind.y.show();
    }
  },

  initializePopup: function() {
    var me = this;
    //I have to add to main so it will show up and won't scroll the page or carousel
    if (!me.imagePopup) {
      me.updateImagePopupData(me.getImagePopupData());
    }
    Ext.getCmp('main').add(me.imagePopup);
  },
  deinitializePopup: function() {
    var me = this;
    Ext.getCmp('main').remove(me.imagePopup);
    me.imagePopup.destroy();
    me.imagePopup = null;
  }
});