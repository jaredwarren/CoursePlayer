Ext.define('Player.page.questions.review.HOIMAGE', {
  extend: 'Player.page.questions.review.MC',
  xtype: 'reviewHOIMAGE',

  getDistractor: function(distractor, response) {
    var me = this;
    return {
      xtype: me.distractorType,
      html: response + '<div class="imagecontainer centerimage" style="display: flex;">' + distractor.letter + ': <img src="' + distractor.filepath + '" id="img_' + distractor.letter + '" alt="' + distractor.alt + '" class="img_jpg" style="max-height: 75px; max-width: 75px;"><div id="zoom_' + distractor.letter + '" class="imageicon zoom" style="left:456px;top:129px"></div></div>',
      styleHtmlContent: true,
      correct: distractor.correct,
      name: distractor.letter,
      listeners: {
        /* change: {
          fn: me.onSelect,
          scope: me
        },
        click: {
          fn: me.onElementTap,
          element: 'el'
        },
        imagetap: {
          fn: me.imageTapHandler,
          scope: me
        },*/
        render: {
          fn: me.repositionZoomImage,
          scope: me
        }
      }
    };
  },

  repositionZoomImage: function(element, eOpts) {
    try {
      var me = this,
        id = element.name,
        zoomId = 'zoom_' + id,
        imId = 'img_' + id,
        zoo = document.getElementById(zoomId),
        im = document.getElementById(imId);
      if (im.complete) {
        zoo.setAttribute("style", "left:" + (im.width + im.offsetLeft - zoo.clientWidth) + "px;top:" + (im.height + im.offsetTop - zoo.clientHeight + 1) + "px");
        // force redraw hack
        me.add({
          xtype: 'component'
        });
      } else {
        setTimeout(function() {
          me.repositionZoomImage.call(me, element);
        }, 300);
      }
    } catch (e) {
      console.warn("TODO:");
    }
  }
});