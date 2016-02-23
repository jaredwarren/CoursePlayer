Ext.define('Player.page.questions.review.HOIMAGE', {
  extend: 'Player.page.questions.review.MC',
  xtype: 'reviewHOIMAGE',
  _loadedImage: {},

  getDistractor: function(distractor, response) {
    var me = this,
      alt = distractor['alt'] || '';

    if (!alt) {
      longText = (distractor['filepath'] + '').replace(/(<([^>]+)>)/ig, "");
    } else {
      longText = alt;
    }

    me.createPopup();

    me._loadedImage[distractor.filepath] = false;

    return {
      xtype: me.distractorType,
      html: response + '<div class="imagecontainer centerimage" style="display: flex;">' + distractor.letter + ': <div class="imagecontainer centerimage" style="position: relative; width: 40%;"><img src="' + distractor.filepath + '" id="img_' + distractor.letter + '" alt="' + alt + '" class="img_jpg" style="width:100%"/><div class="maskContainer x-mask-msg-text" style="width: 100px; text-align: center;">' + Lang.Loading + '</div><div id="zoom_' + distractor.letter + '" class="imageicon zoom pictos pictos-expand" style="position: absolute; left:456px; top:12900px;"></div></div>',
      styleHtmlContent: true,
      correct: distractor.correct,
      name: distractor.letter,
      listeners: {
        click: {
          fn: me.onElementTap,
          element: 'el',
          scope: me
        },
        render: {
          fn: me.onRenderHandler,
          scope: me
        }
      }
    };
  },
  onElementTap: function(event, target, eOpts) {
    var me = this;
    event.stopPropagation();
    event.preventDefault();
    if (target && target.classList.contains('zoom')) {
      me.showImagePopup(target.parentElement.querySelector('img'));
    } else if (target && target.nodeName == 'IMG') {
      me.showImagePopup(event.target);
    } else {
      var distractor = me.queryById(event.parentEvent.currentTarget.id);
      // reverse check
      if (distractor.checked) {
        distractor.checked = true;
      } else {
        distractor.checked = false;
      }
    }
    return false;
  },
  showImagePopup: function(image) {
    var me = this,
      imageFile = image.src;
    me.imagePopup.setData({
      showCaption: false,
      imgPos: 'center',
      imageFile: imageFile,
      imageURL: imageFile,
      captionhead: image.alt,
      imageWidth: '100%'
    });
    me.imagePopup.show();
  },

  onRenderHandler: function(distractor, eOpts) {
    var me = this,
      img = distractor.el.dom.querySelector('img'),
      zoom = distractor.el.dom.querySelector('.zoom'),
      maskContainer = distractor.el.dom.querySelector('.maskContainer');
    if (img) {
      if (img.complete) {
        me.onImageComplete(img, zoom, maskContainer);
      } else {
        img.addEventListener("load", function() {
          me.onImageComplete(img, zoom, maskContainer);
        }, false);
      }
    }
  },
  onImageComplete: function(img, zoom, maskContainer) {
    var me = this;
    me.repositionZoomImage(img, zoom);
    if (maskContainer) {
      maskContainer.hidden = true;
    }
  },

  repositionZoomImage: function(img, zoom) {
    var me = this;
    zoom.hidden = false;
    var zooBounds = zoom.getBoundingClientRect(),
      imBounds = img.getBoundingClientRect();
    var left = (imBounds.width + img.offsetLeft - zooBounds.width);
    var top = (imBounds.height + img.offsetTop - zooBounds.height);

    zoom.setAttribute("style", "position: absolute; left:" + left + "px;top:" + top + "px; width: 24px; height: 24px; background: rgba(100, 100, 100, .8);");

    // check to see if all are complete
    me._loadedImage[img.src] = img;
    var allComplete = true,
      totalHeight = 0;
    Ext.Object.each(me._loadedImage, function(src, image, myself) {
      if (!image) {
        allComplete = false;
        return false;
      }
      totalHeight += image.height;
    });
    // Stupid hack to fix size of container
    if (allComplete) {
      me.queryById('distractorContainer').setHeight(totalHeight + 80);
    }
  },

  createPopup: function(cfg) {
    var me = this,
      imagePopup = me.imagePopup;
    if (!imagePopup) {
      me.imagePopup = Ext.create('Player.view.main.ImagePopup', {
        showCaption: false
      });
      return me.imagePopup;
    }
    return imagePopup;
  }
});