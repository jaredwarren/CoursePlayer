Ext.define('Player.view.main.InstructionsPopup', {
  extend: 'Ext.window.Window',
  xtype: 'instructionspopup',

  closeAction: 'hide',
  centered: true,
  modal: true,

  height: 450,
  width: 450,
  hidden: true,

  cfg: {
    autoPlayMedia: true
  },

  layout: 'border',

  constructor: function(cfg) {
    var me = this,
      items = cfg.items || [];
    cfg = cfg || {};

    var iconType = (!cfg.imageURL) ? 'zoom' : 'link';

    items.unshift({
      xtype: 'textimage',
      cls: 'page-content',
      itemId: 'textImage',
      region: 'center',
      pText: cfg.pText,
      imageFile: cfg.imageFile,
      iconType: cfg.iconType || iconType,
      imgPos: cfg.imgPos,
      captionhead: cfg.captionhead,
      captiontext: cfg.captiontext,
      imageURL: cfg.imageURL,
      imageWidth: cfg.imageWidth
    });

    if ( !! cfg.mediaPath) {
      items.push({
        xtype: 'audiobar',
        itemId: 'audio',
        region: 'south',
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
      items: items,
      bbar: [{
        xtype: 'tbspacer',
        flex: 1
      }, {
        xtype: 'button',
        ui: 'action',
        itemId: 'startButton',
        hidden: cfg.hideActionButton,
        text: cfg.startButtonText,
        listeners: {
          click: me.onClose,
          scope: me
        }
      }]
    }, cfg)]);
  },
  onClose: function() {
    var me = this;
    var audio = me.queryById('audio');
    if (audio) {
      audio.pause();
    }
    me.fireEvent('start-activity');
    me.close();
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