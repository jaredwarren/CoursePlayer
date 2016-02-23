Ext.define('Player.view.main.HelpPanelTablet', {
  extend: 'Ext.Panel',
  xtype: 'helppaneltablet',

  requires: [
    'Player.view.main.HelpPanelModel'
  ],

  viewModel: {
    type: 'helppanel'
  },


  height: 250,
  hidden: true,
  //id: 'helpPanel',
  reference: 'helpPanel',
  width: 250,
  hideOnMaskTap: true,
  modal: false,
  autoDestroy: false,
  layout: {
    type: 'vbox',
    align: 'start'
  },
  scrollable: {
    direction: 'vertical',
    directionLock: true
  },

  cls: [
    'helppanel'
  ],
  defaults: {
    margin: '5 6 5 6',
    width: 240,
    styleHtmlContent: true,
    layout: {
      type: 'hbox',
      align: 'center',
      pack: 'stretch'
    }
  },
  items: [{
    items: [{
      xtype: 'button',
      ui: 'action',
      iconCls: 'pictos pictos-question'
    }, {
      html: Lang.help.help,
      styleHtmlContent: true,
      flex: 1,
      margin: '2 2 2 2'
    }],
    bind: {
      hidden: '{!showHelp}'
    }
  }, {
    items: [{
      xtype: 'button',
      text: Lang.Glossary,
      ui: 'action',
      iconCls: 'pictos pictos-table'
    }, {
      html: Lang.help.glossary,
      styleHtmlContent: true,
      flex: 1,
      margin: '2 2 2 2'
    }],
    bind: {
      hidden: '{!showGlossary}'
    }
  }, {
    items: [{
      xtype: 'button',
      iconCls: 'pictos pictos-delete'
    }, {
      html: Lang.help.close,
      styleHtmlContent: true,
      flex: 1,
      margin: '2 2 2 2'
    }],
    bind: {
      hidden: '{!showClose}'
    }
  }, {
    items: [{
      xtype: 'button',
      iconCls: 'pictos pictos-arrow_left',
      ui: 'action'
    }, {
      html: Lang.help.previous,
      styleHtmlContent: true,
      flex: 1,
      margin: '2 2 2 2'
    }]
  }, {
    items: [{
      xtype: 'button',
      iconCls: 'pictos pictos-arrow_right',
      ui: 'action'
    }, {
      html: Lang.help.next,
      styleHtmlContent: true,
      flex: 1,
      margin: '2 2 2 2'
    }]
  }, {
    items: [{
      xtype: 'button',
      iconCls: 'pictos pictos-chat',
      ui: 'action'
    }, {
      html: Lang.help.narration,
      styleHtmlContent: true,
      flex: 1,
      margin: '2 2 2 2'
    }]
  }, {
    xtype: 'container',
    docked: 'top',
    height: 0,
    itemId: 'closeBtnHolder',
    hidden: true,
    items: [{
      xtype: 'panel',
      cls: [
        'close-imagepopup'
      ],
      docked: 'top',
      height: 46,
      right: -20,
      top: -20,
      width: 46,
      zIndex: 100,
      modal: false,
      items: [{
        xtype: 'button',
        height: 34,
        itemId: 'closeImagePopBtn',
        padding: '0 0 0 0',
        ui: 'plain',
        width: 34,
        autoEvent: 'closeimagepopup',
        iconAlign: 'center',
        iconCls: 'delete',
        iconMask: true
      }]
    }]
  }],

  initialize: function() {
    var me = this;
    me.callParent(arguments);

    me.query('#closeImagePopBtn')[0].on('tap', me.onClose, me);
    if (Ext.os.is.Phone) {
      me.query('#closeBtnHolder')[0].show();
    } else {
      me.setRight(0);
      me.setTop(50);
      me.setCentered(false);
    }
  },

  onClose: function() {
    this.hide();
    Player.app.fireEvent('hideTools');
  }
});