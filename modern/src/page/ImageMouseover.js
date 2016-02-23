Ext.define('Player.page.ImageMouseover', {
  extend: 'Player.page.Page',
  xtype: 'ImageMouseover',

  requires: [
    'Player.page.components.TextImage'
  ],

  config: {
    pageTitle: undefined
  },

  constructor: function(cfg) {
    var me = this,
      treeSteps = [];
    cfg = cfg || {};

    var images = [];
    Ext.Object.each(cfg, function(key, value, myself) {
      // URL      
      var imageUrl = key.match(/image(\d+?)$/);
      if (imageUrl) {
        var index = parseInt(imageUrl[1], 10) - 1;
        var imageObject = images[index];
        if (!imageObject) {
          imageObject = {
            step: index + 1
          };
          images[index] = imageObject;
        }
        imageObject.url = value;
      }
      // Caption
      var imageCaption = key.match(/image(\d+?)caption$/);
      if (imageCaption) {
        var index = parseInt(imageCaption[1], 10) - 1;
        var imageObject = images[index];
        if (!imageObject) {
          imageObject = {
            step: index + 1
          };
          images[index] = imageObject;
        }
        imageObject.caption = value;
      }
      // text
      var imageText = key.match(/image(\d+?)text$/);
      if (imageText) {
        if (value && value.hasOwnProperty('#text')) {
          var index = parseInt(imageText[1], 10) - 1;
          var imageObject = images[index];
          if (!imageObject) {
            imageObject = {
              step: index + 1
            };
            images[index] = imageObject;
          }
          imageObject.text = value['#text'];
        }
      }
    });

    // remove title, because it, for some reson, is below a docked: 'top' tiem
    var title = cfg.title;
    delete cfg.title;

    me.callParent([Ext.apply({
      scrollable: false,
      header: false,
      pageTitle: title,
      items: [{
        xtype: 'panelheader',
        docked: 'top',
        title: title
      }, {
        xtype: 'dataview',
        itemId: 'stepsList',
        docked: 'top',
        layout: {
          type: 'hbox',
          align: 'center',
          pack: 'center'
        },
        style: 'background-color: darkgrey',
        scrollable: {
          direction: 'horizontal',
          directionLock: true
        },
        itemTpl: '<img src="{url}" style="max-width: 80px; max-height: 80px; margin: 8px;"/>',
        overClass: 'imagemouseover-over',
        itemSelector: 'div.imagemouseover-wrap img',
        autoHeight: true,
        emptyText: 'No images to display',
        inline: {
          wrap: false
        },
        width: '100%',
        height: 100,
        store: {
          fields: ['caption', 'text', 'url'],
          data: images
        },
        listeners: {
          select: me.onSeletImage,
          scope: me
        }
      }, {
        xtype: 'panel',
        itemId: 'detailWrapper',
        width: '90%',
        height: '90%',
        hidden: false,
        layout: {
          type: 'vbox',
          align: 'center',
          pack: 'start'
        }
      }]
    }, cfg)]);
  },

  initialize: function() {
    var me = this;
    me.callParent(arguments);
    me.setHeader(false);
  },

  onSeletImage: function(list, record) {
    var me = this,
      detailWrapper = me.queryById('detailWrapper');

    detailWrapper.removeAll();
    detailWrapper.add({
      padding: '10 0 0 0',
      width: '90%',
      hidden: false,
      region: 'center',
      xtype: 'textimage',
      cls: 'page-content',
      itemId: 'textImage',
      imgPos: 'center',
      iconType: 'zoom',
      pText: record.data.text,
      captionhead: record.data.caption,
      imageFile: record.data.url
    });
    me.setLoadingMask(false);
  },

  setLoadingMask: function(message) {
    var me = this,
      detailWrapper = me.queryById('detailWrapper');
    if (message === false) {
      detailWrapper.setMasked(false);
    } else {
      detailWrapper.setMasked({
        xtype: 'loadmask',
        message: me.getPageTitle() + '<br/>' + message,
        indicator: false
      });
    }
  },

  start: function() {
    var me = this;
    me.callParent(arguments);
    me.setLoadingMask("Explore by placing your mouse over each image...then click to learn more.");
  }
});