  /**
   *   DEPRECATED!!!
   */
  Ext.define('Player.page.components.TextImageMixin', {
    extend: 'Ext.Base',
    mixinConfig: {
      id: 'textimagemixin'
    },
    requires: [
      'Player.page.components.TextImage'
    ],
    config: {
      pText: undefined,
      imageFile: undefined,
      imgPos: 'left',
      imageWidth: '40',
      captiontext: undefined,
      captionhead: undefined,
      imageURL: undefined,
      mediaPath: undefined,
      autoPlayMedia: false
    },

    _hasImage: false,
    updatePType: function(pType) {
      console.error("DEPRECATED: use TextPage", pType);
      if (pType.search("Link") >= 0) {
        this.getComponent('textImage').setIconType('link');
      } else {
        this.getComponent('textImage').setIconType('zoom');
        this._hasImage = ( !! imageFile);
      }
    },
    /**
     * @private
     */
    updatePText: function(pText) {
      this.getComponent('textImage').setPText(pText);
    },
    /**
     * @private
     */
    updateImageFile: function(imageFile) {
      this.getComponent('textImage').setImageFile(imageFile);
    },
    /**
     * @private
     */
    updateImageURL: function(imageURL) {
      this.getComponent('textImage').setImageURL(imageURL);
    },
    /**
     * @private
     */
    updateImgPos: function(imgPos) {
      this.getComponent('textImage').setImgPos(imgPos);
    },
    /**
     * @private
     */
    updateCaptionhead: function(captionhead) {
      this.getComponent('textImage').setCaptionhead(captionhead);
    },
    /**
     * @private
     */
    updateCaptiontext: function(captiontext) {
      this.getComponent('textImage').setCaptiontext(captiontext);
    },
    /**
     * @private
     */
    updateImageWidth: function(imageWidth) {
      this.getComponent('textImage').setImageWidth(imageWidth);
    },

    close: function() {
      var me = this;
      if (this._hasImage) {
        me.closeImagePopup();
        me.deinitializePopup();
      }
    },
    nextHandler: function() {
      if (this._hasImage) {
        this.closeImagePopup();
      }
      return true;
    },
    previousHandler: function() {
      if (this._hasImage) {
        this.closeImagePopup();
      }
      return true;
    },



    /**
     *
     */
    closeImagePopup: function() {
      this.getComponent('textImage').closeImagePopup();
    },
    /**
     *
     */
    deinitializePopup: function() {
      this.getComponent('textImage').deinitializePopup();
    }


  });