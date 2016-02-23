Ext.define('Player.view.main.ImagePopup', {
  extend: 'Ext.window.Window',
  xtype: 'imagepopup',

  closable: true,
  closeAction: 'hide',
  centered: true,
  hidden: true,

  minHeight: 400,
  minWidth: 400,
  modal: true,
  scrollable: 'both',

  cls: [
    'imagepopup'
  ],
  tpl: [
    '<center class="wrapper">',
    '<img src="{imageFile}" class="pageImage"/>',
    '<tpl if="showCaption"><div><span class="captionhead">{captionhead}</span> <span class="captiontext">{captiontext}</span></div></tpl>',
    '</center>',
    '<div class="pageText">{pText}</div>'
  ],
  config: {
    captionhead: '',
    captiontext: '',
    imageFile: ''
  },

  constructor: function(cfg) {
    var me = this;
    cfg = cfg || {};

    me.callParent([Ext.apply({
      title: cfg.captionhead,
      data: {
        showCaption: true,
        imgPos: 'center',
        imageFile: cfg.imageFile,
        captiontext: cfg.captiontext,
        captionhead: cfg.captionhead,
        imageURL: cfg.imageFile,
        imageWidth: '100%'
      }
    }, cfg)]);
  },

  onClose: function() {
    this.hide();
  },

  onImageComplete: function(img) {
    var me = this,
      headerHeight = me.getHeader().el.dom.getBoundingClientRect().height,
      captionHeight = me.el.dom.querySelector('.pageText').getBoundingClientRect().height;
    me.setSize(Math.min(img.naturalWidth + 30, (window.innerWidth - 30) * .9), Math.min(img.naturalHeight + headerHeight + captionHeight + 30, (window.innerHeight - captionHeight - headerHeight - 30) * .9));
  },
  
  beforeShow: function() {
    var me = this;
    me.callParent(arguments);
    me.onImageResize();
  },

  afterRender: function() {
    var me = this;
    me.callParent(arguments);
    me.onImageResize();
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
  onResize: function() {
    var me = this;
    me.callParent(arguments);
    me.center();
  }
});