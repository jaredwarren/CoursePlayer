Ext.define('Player.page.questions.HOIMAGE', {
  extend: 'Player.page.questions.MC',

  xtype: 'HOIMAGE',

  requires: [
    'Player.page.components.TextImage',
    'Player.view.main.ImagePopup'
  ],

  _loadedImage: {},
  config: {
    feedback: {
      "initPrompt": {
        "#text": Lang.questions.HOIMAGE.initPrompt
      }
    }
  },

  getDistractor: function(distractor) {
    var me = this,
      longText = '',
      alt = distractor['alt'] || '';
    // check for file
    if (!distractor['filepath']) {
      return false;
    }

    if (!alt) {
      longText = (distractor['filepath'] + '').replace(/(<([^>]+)>)/ig, "");
    } else {
      longText = alt;
    }

    me.createPopup();

    me._loadedImage[distractor.filepath] = false;

    return {
      xtype: me.distractorType,
      inputValue: distractor.letter,
      name: me.getDistractorName(distractor.letter),
      boxLabel: '<div class="imagecontainer centerimage" style="position: relative; width: 40%;"><img src="' + distractor.filepath + '" id="img_' + distractor.letter + '" alt="' + alt + '" class="img_jpg" style="width:100%"/><div class="maskContainer x-mask-msg-text" style="width: 100px; text-align: center;">' + Lang.Loading + '</div><div id="zoom_' + distractor.letter + '" class="imageicon zoom pictos pictos-expand" style="position: absolute; left:456px; top:12900px;"></div></div>',
      labelAlign: 'right',
      imageFile: distractor.filepath,
      letter: distractor.letter,
      correct: distractor.correct,
      iFeedback: distractor.iFeedback || '',
      longText: longText,
      raw: distractor,
      listeners: {
        change: {
          fn: me.onSelect,
          scope: me
        },
        doubletap: {
          fn: me.onElementDoubleTap,
          element: 'el',
          scope: me
        },
        click: {
          fn: me.onElementTap,
          element: 'el',
          scope: me
        },
        imagetap: {
          fn: me.imageTapHandler,
          scope: me
        },
        render: {
          fn: me.onRenderHandler,
          scope: me
        }
      }
    };
  },

  onElementDoubleTap: function(event, target, eOpts) {
    var me = this;
    if (target && target.nodeName == 'IMG') {
      event.stopPropagation();
      me.showImagePopup(event.target);
      return false;
    }
  },
  onElementTap: function(event, target, eOpts) {
    var me = this;
    event.stopPropagation();
    event.preventDefault();
    if (target && target.classList.contains('zoom')) {
      me.showImagePopup(target.parentElement.querySelector('img'));
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

  onResize: function() {
    this.onImageResize();
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
        img.addEventListener("error", function(e, f, g, h) {
          me.onImageError(img, zoom, maskContainer);
        }, false);
      }
    }
  },

  onImageError: function(img, zoom, maskContainer) {
    var me = this,
      newImg = document.createElement('div');
    newImg.innerHTML = 'Error loading image';
    newImg.style.setProperty('width', '200px');
    me._loadedImage[img.src] = img;
    img.parentElement.appendChild(newImg);
    img.hidden = true;
    me.repositionZoomImage(img, zoom);
    zoom.hidden = true;
    if (maskContainer) {
      maskContainer.hidden = true;
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
    if (allComplete && me.isVisible()) {
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