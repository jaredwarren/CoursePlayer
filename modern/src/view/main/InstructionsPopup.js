Ext.define('Player.view.main.InstructionsPopup', {
  extend: 'Ext.form.Panel',
  xtype: 'instructionspopup',

  requires: [
    'Player.view.main.HelpPanelModel'
  ],


  closeAction: 'hide',
  centered: true,

  centered: true,
  modal: true,
  hidden: true,
  height: 450,
  width: '90%',
  height: '90%',
  hidden: true,

  cfg: {
    autoPlayMedia: true
  },


  constructor: function(cfg) {
    var me = this,
      items = cfg.items || [];
    cfg = cfg || {};

    var iconType = (!cfg.imageURL) ? 'zoom' : 'link';

    items.unshift({
      xtype: 'textimage',
      cls: 'page-content',
      itemId: 'textImage',
      pText: cfg.pText,
      imageFile: cfg.imageFile,
      iconType: cfg.iconType || iconType,
      imgPos: cfg.imgPos,
      captionhead: cfg.captionhead,
      captiontext: cfg.captiontext,
      imageURL: cfg.imageURL,
      imageWidth: cfg.imageWidth
    });

    items.push({
      xtype: 'toolbar',
      docked: 'bottom',
      items: [{
        xtype: 'container',
        flex: 1
      }, {
        xtype: 'button',
        ui: 'action',
        itemId: 'startButton',
        hidden: cfg.hideActionButton,
        text: cfg.startButtonText,
        listeners: {
          tap: me.onClose,
          scope: me
        }
      }]
    });


    if ( !! cfg.mediaPath) {
      items.push({
        xtype: 'audiobar',
        itemId: 'audio',
        docked: 'bottom',
        width: '100%',
        mediaPath: cfg.mediaPath,
        autoPlayMedia: cfg.autoPlayMedia,
        listeners: {
          'audio-ended': me.onAudioEnded,
          scope: me
        }
      });
    }


    me.callParent([Ext.apply({
      closable: cfg.closable,
      hideOnMaskTap: cfg.closable,
      items: items
    }, cfg)]);
  },
  onClose: function() {
    var me = this;
    var audio = me.queryById('audio');
    if (audio) {
      audio.pause();
    }
    me.fireEvent('start-activity');
    me.hide();
  },
  onAudioEnded: function() {
    // do nothing, unless I want to suto start.
  },

  show: function() {
    var me = this;
    me.callParent(arguments);
    var audio = me.queryById('audio');
    if (audio) {
      audio.start(me.config.autoPlayMedia);
    }
  }
});