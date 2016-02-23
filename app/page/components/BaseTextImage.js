Ext.define('Player.page.components.BaseTextImage', {
  extend: 'Ext.Panel',

  requires: [
    'Player.view.main.ImagePopup'
  ],

  config: {
    styleHtmlContent: true,
    showCaption: true,
    iconType: 'zoom',
    imageFile: '',
    pText: undefined,
    imageWidth: 40,
    imgPos: '',
    captiontext: '',
    captionhead: '',
    imageURL: ''
  },

  data: {
    showCaption: true,
    imgPos: 'left',
    imageFile: '',
    pText: '',
    iconType: 'zoom',
    iconCls: 'expand',
    captiontext: '',
    captionhead: '',
    loadingMsg: Lang.Loading,
    imageURL: '',
    target: ''
  },
  tpl: [
    '<tpl if="imgPos == \'left\' || imgPos == \'right\'">',
    '<div class="imagecontainer {imgPos}image" style="width:{imageWidth}; float: {imgPos}; position: relative;">',
    '<center class="maskContainer" style="width: 100%;"><div class="imageMask x-mask-msg-text" style="width: 100px; text-align: center;">{loadingMsg}</div></center>',
    '<tpl if="iconType != \'zoom\'">',
    '<a href="{imageURL}" target="{target}"><img src="{imageFile}" class="pageImage" style="width: 100%; height: 100%"/>',
    '<div class="imageicon pictos pictos-{iconCls} {iconType}" hidden style="width: 24px; height: 24px;"></div></a>',
    '</tpl>',
    '<tpl if="iconType == \'zoom\'">',
    '<img src="{imageFile}" class="pageImage" style="width: 100%; height: 100%"/>',
    '<div class="imageicon pictos pictos-{iconCls} {iconType}" hidden style="width: 24px; height: 24px;"></div>',
    '</tpl>',
    '<tpl if="showCaption"><div><span class="captionhead">{captionhead}</span> <span class="captiontext">{captiontext}</span></div></tpl>',
    '</div>',
    '<div class="pageText">{pText}</div>',
    '</tpl>',

    '<tpl if="imgPos == \'center\'">',
    '<center class="imagecontainer bottomimage">',
    '<div class="maskContainer x-mask-msg-text" style="width: 100px; text-align: center;">{loadingMsg}</div>',
    '<tpl if="iconType != \'zoom\'">',
    '<a href="{imageURL}" target="{target}">',
    '<img src="{imageFile}" class="pageImage" style="width:{imageWidth};"/>',
    '<div class="imageicon pictos pictos-{iconCls} {iconType}" hidden style="width: 24px; height: 24px;"></div>',
    '</a>',
    '</tpl>',
    '<tpl if="iconType == \'zoom\'">',
    '<img src="{imageFile}" class="pageImage" style="width:{imageWidth};"/>',
    '<div class="imageicon pictos pictos-{iconCls} {iconType}" hidden style="width: 24px; height: 24px;"></div>',
    '</tpl>',
    '<tpl if="showCaption"><div><span class="captionhead">{captionhead}</span> <span class="captiontext">{captiontext}</span></div></tpl>',
    '</center>',
    '<div class="pageText">{pText}</div>',
    '</tpl>',

    '<tpl if="imgPos == \'bottom\'">',
    '<div class="pageText">{pText}</div>',
    '<center class="imagecontainer centerimage">',
    '<div class="maskContainer x-mask-msg-text" style="width: 100px; text-align: center;">{loadingMsg}</div>',
    '<tpl if="iconType != \'zoom\'">',
    '<a href="{imageURL}" target="{target}"><img src="{imageFile}" class="pageImage" style="width:{imageWidth};"/>',
    '<div class="imageicon pictos pictos-{iconCls} {iconType}" hidden style="width: 24px; height: 24px;"></div></a>',
    '</tpl>',
    '<tpl if="iconType == \'zoom\'">',
    '<img src="{imageFile}" class="pageImage" style="width:{imageWidth};"/>',
    '<div class="imageicon pictos pictos-{iconCls} {iconType}" hidden style="width: 24px; height: 24px;"></div>',
    '</tpl>',
    '<tpl if="showCaption"><div><span class="captionhead">{captionhead}</span> <span class="captiontext">{captiontext}</span></div></tpl>',
    '</center>',
    '</tpl>',

    '<tpl if="imgPos == \'none\'">',
    '<div class="pageText">{pText}</div>',
    '</tpl>'
  ],

  constructor: function(cfg) {
    var me = this;
    cfg = cfg || {};

    // add popup
    if (cfg.iconType == 'zoom') {
      me.createPopup(cfg);
    }

    var imgPos = me.filterImgPos(cfg.imgPos);
    if (!cfg.imageFile) {
      imgPos = 'none';
    }

    me.callParent([Ext.apply({
      data: {
        showCaption: true,
        imgPos: imgPos,
        imageFile: cfg.imageFile,
        pText: me.filterPText(cfg.pText),
        iconCls: (cfg.iconType == 'zoom') ? 'expand' : 'attachment',
        iconType: cfg.iconType,
        target: (cfg.imageURL && cfg.imageURL.match(/^asfunction:/)) ? '' : '{target}',
        captiontext: cfg.captiontext,
        captionhead: cfg.captionhead,
        imageURL: cfg.imageURL,
        imageWidth: me.filterImageWidth(cfg.imageWidth)
      }
    }, cfg)]);
  },

  filterPText: function(pText) {
    if (pText && pText.hasOwnProperty('#text')) {
      return pText['#text'];
    } else {
      return pText;
    }
  },
  filterImgPos: function(imgPos) {
    var imageDirection = 'left';
    if (imgPos) {
      if (imgPos.search(/left/i) >= 0) {
        imageDirection = 'left';
      } else if (imgPos.search(/right/i) >= 0) {
        imageDirection = 'right';
      } else if (imgPos.search(/bottom/i) >= 0) {
        imageDirection = 'bottom';
      } else {
        imageDirection = 'center';
      }
    } else {
      imageDirection = 'left';
    }
    return imageDirection;
  },

  filterImageWidth: function(imageWidth) {
    if (!imageWidth) {
      imageWidth = 40;
    }
    var width = imageWidth;
    if (typeof imageWidth == 'number') {
      width = imageWidth + '%';
    } else if (imageWidth.match(/\d$/).length > 0) {
      width = imageWidth + '%';
    }
    return width;
  },

  imageTapHandler: function(e) {
    var me = this;
    var type = me.getIconType();
    if (type == 'zoom') {
      var imagePopup = me.imagePopup;
      if (imagePopup) {
        if (e && e.target) {
          if (e.target.classList.contains('zoom')) {
            imagePopup.show();
          } else if (e.target.nodeName == 'IMG') {
            if (e.target.naturalHeight > e.target.clientHeight || e.target.naturalWidth > e.target.clientWidth) {
              imagePopup.show();
            } else {
              console.log("too small");
            }
          }
        } else {
          console.log("not an iamge");
        }
      }
    } else if (type == 'link') {
      if (e && e.target && (e.target.nodeName == 'IMG' || e.target.classList.contains('link'))) {
        e.preventDefault();
        e.stopPropagation();
        e.target.onclick = function onclick(event) {
          return false;
        };
        me.fireEvent('link-tap', me, me.getImageURL());
      }
    } else {
      console.error("Invalid Type:", type);
    }
  },

  onImageResize: function() {
    var me = this,
      img = me.el.dom.querySelector('.pageImage');
    if (img) {
      if (img.complete) {
        me.onImageComplete(img);
      } else {
        img.addEventListener("load", function() {
          me.onImageComplete(img);
        }, false);
      }
    }
  },

  onImageComplete: function(img) {
    var me = this,
      maskContainer = me.el.dom.querySelector('.maskContainer');
    if (maskContainer) {
      maskContainer.hidden = true;
    }
    me.repositionZoomImage(img);
  },

  closeImagePopup: function() {
    if (this.imagePopup) {
      this.imagePopup.hide();
    }
  },
  deinitializePopup: function() {
    var me = this;
    if (me.imagePopup) {
      me.imagePopup.destroy();
      me.imagePopup = null;
    }
  }
});