Ext.define('Player.page.components.InstructionsMixin', {
  extend: 'Ext.Base',
  mixinConfig: {
    id: 'instructionsmixin'
  },
  /*
  requires: [
    'Player.page.components.TextImage'
  ],
  */
  config: {
    instructionText: undefined,
    mobileInstructionText: undefined
  },


  _iText: '',
  updateInstructionText: function(instructionText) {
    if (!this._iText) {
      if (instructionText.hasOwnProperty('#text')) {
        this._iText = instructionText['#text'];
      } else {
        this._iText = instructionText;
      }
    }
  },
  updateMobileInstructionText: function(mobileInstructionText) {
    if (mobileInstructionText.hasOwnProperty('#text')) {
      this._iText = mobileInstructionText['#text'];
    } else {
      this._iText = mobileInstructionText;
    }
  },


  initializeInstructions: function() {
    var me = this;
    me.instructionsPopup = Ext.create('Ext.Panel', {
      xtype: 'container',
      itemId: 'popupInstructions',
      centered: true,
      modal: true,
      hidden: true,
      border: '1px solid black',
      hideAnimation: 'popOut',
      showAnimation: 'popIn',
      hideOnMaskTap: true,
      width: 300,
      height: 300,
      scrollable: 'vertical',
      layout: {
        align: 'center',
        pack: 'start',
        type: 'vbox'
      },
      cls: 'spin-instructions-popup',
      items: [{
        xtype: 'titlebar',
        docked: 'top',
        title: this.getConfig().title
      }, {
        xtype: 'container',
        html: this._iText
      }, {
        xtype: 'container',
        docked: 'bottom',
        layout: {
          align: 'center',
          pack: 'end',
          type: 'hbox'
        },
        items: [{
          xtype: 'button',
          margin: '6 6 6 6', // this was 6 6 0 6, but cupertino button was on the bottom
          text: 'Continue',
          itemId: 'continueBtn',
          ui: 'action',
          handler: function() {
            this.up('#popupInstructions').hide()
          }
        }]
      }]
    });
    Ext.Viewport.add(me.instructionsPopup);
  },

  showInstructions: function() {
    var me = this;
    if (!me.instructionsPopup) {
      me.initializeInstructions();
    }
    me.instructionsPopup.show();
  },



  /**
   * @private
   */
  updatePType: function(pType) {
    if (pType.search("Link") >= 0) {
      this.getComponent('textImage').setIconType('link');
    } else {
      this.getComponent('textImage').setIconType('zoom');
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