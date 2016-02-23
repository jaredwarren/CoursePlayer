Ext.define('Player.page.ImageMouseover', {
  extend: 'Player.page.Page',
  xtype: 'ImageMouseover',

  requires: [
    'Player.page.components.TextImage',
    'Player.page.TitleLoadMask'
  ],

  _loadedImage: {},

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
        me._loadedImage[value] = false;
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

    var tpl = new Ext.XTemplate(
      '<center style="height: 160px">',
      '<tpl for=".">',
      '<div class="imagemouseover-wrap" style="display: inline-block; ">',
      '<img src="{url}" style="max-width: 80px; max-height: 80px; margin: 40px 8px;"/>',
      '</div>',
      '</tpl>',
      '</center>',
      '<div class="x-clear"></div>'
    );

    me.callParent([Ext.apply({
      layout: 'border',
      scrollable: false,
      items: [{
        xtype: 'dataview',
        region: 'north',
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
        tpl: tpl,
        overClass: 'imagemouseover-over',
        itemSelector: 'div.imagemouseover-wrap img',
        autoHeight: true,
        emptyText: 'No images to display',
        inline: {
          wrap: false
        },
        width: '100%',
        height: 160,
        store: {
          fields: ['caption', 'text', 'url'],
          data: images
        },
        listeners: {
          select: me.onSeletImage,
          itemmouseenter: me.onMouseover,
          itemmouseleave: me.onMouseleave,
          render: me.onRenderHandler,
          scope: me
        }
      }, {
        xtype: 'panel',
        itemId: 'detailWrapper',
        width: '90%',
        height: '90%',
        hidden: false,
        region: 'center',
        layout: {
          type: 'vbox',
          align: 'center',
          pack: 'start'
        }
      }]
    }, cfg)]);
  },


  onRenderHandler: function(distractor, eOpts) {
    var me = this,
      imgs = distractor.el.dom.querySelectorAll('img');
    if (imgs && imgs.length > 0) {
      Ext.Array.each(imgs, function(img) {
        if (img.complete) {
          me.onImageComplete(img);
        } else {
          img.addEventListener("load", function() {
            me.onImageComplete(img);
          }, false);
          img.addEventListener("error", function(event) {
            me.onImageError(img);
          }, false);
        }

      });
    }
  },
  onResize: function() {
    var me = this,
      imgs = me.el.dom.querySelectorAll('img');
    if (imgs && imgs.length > 0) {
      Ext.Array.each(imgs, function(img) {
        if (img.complete) {
          me.onImageComplete(img);
        } else {
          img.addEventListener("load", function() {
            me.onImageComplete(img);
          }, false);
          img.addEventListener("error", function(event) {
            me.onImageError(img);
          }, false);
        }

      });
    }
  },

  onImageError: function(img) {
    var me = this,
      newImg = document.createElement('div');
    newImg.innerHTML = 'Error loading image';
    newImg.style.setProperty('width', '200px');
    img.parentElement.appendChild(newImg);
    img.hidden = true;
    me.onImageComplete(img);
  },

  onImageComplete: function(img) {
    var me = this,
      allComplete = true;
    // check to see if all are complete
    me._loadedImage[img.src] = img;
    Ext.Object.each(me._loadedImage, function(src, image, myself) {
      if (!image) {
        allComplete = false;
        return false;
      }
    });
    if (allComplete) {
      me.setLoadingMask1(false);
    }
  },

  setLoadingMask1: function(message) {
    var me = this,
      maskObject = false;
    if (message === false) {
      if (me.imageMask) {
        me.imageMask.hide();
      }
    } else {
      if (!me.imageMask) {
        me.imageMask = new Ext.LoadMask({
          msg: message,
          target: me.queryById('stepsList')
        });
      } else {
        me.imageMask.msg = message;
      }
      if (!me.imageMask.isVisible()) {
        me.imageMask.show();
      }
    }
  },

  onMouseover: function(dataview, record, item, index, e, eOpts) {
    var me = this;
    me.setLoadingMask(record.data.caption, '(Click the image to enlarge and learn more.)');
    item.classList.add('imagemouseover-over');
  },

  onMouseleave: function(dataview, record, item, index, e, eOpts) {
    var me = this;
    me.setLoadingMask(false);
    item.classList.remove('imagemouseover-over');
  },

  onSeletImage: function(list, record) {
    var me = this,
      detailWrapper = me.queryById('detailWrapper');

    detailWrapper.removeAll();
    detailWrapper.add({
      margin: '10 0 0 0',
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

  setLoadingMask: function(title, message) {
    var me = this,
      maskObject = false;
    if (title === false) {
      if (me.pageMask) {
        me.pageMask.hide();
      }
    } else {
      if (!me.pageMask) {
        me.pageMask = new Player.page.TitleLoadMask({
          msg: message,
          title: title,
          //msgWrapCls: 'false',
          target: me.queryById('detailWrapper')
        });
      } else {
        me.pageMask.msg = message;
        me.pageMask.title = title;
      }
      if (!me.pageMask.isVisible()) {
        me.pageMask.show();
      }
    }
  },

  start: function() {
    var me = this;
    me.callParent(arguments);
    me.setLoadingMask1('Loading...');
    me.setLoadingMask(me.getTitle(), "Explore by placing your mouse over each image...then click to learn more.");
  }
});