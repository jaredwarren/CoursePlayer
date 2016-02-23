Ext.define('Player.view.main.HelpPanel', {
  extend: 'Ext.window.Window',
  xtype: 'helppanel',

  requires: [
    'Player.view.main.HelpPanelModel'
  ],

  closable: true,

  closeAction: 'hide',
  centered: true,

  reference: 'helpPanel',
  viewModel: {
    type: 'helppanel'
  },

  scrollable: 'vertical',

  height: 450,
  width: 450,
  hidden: true,
  id: 'helpPanel',
  hideOnMaskTap: true,
  layout: {
    type: 'vbox',
    align: 'stretch'
  },
  title: Lang.Help,
  modal: true,

  cls: [
    'helppanel'
  ],
  defaults: {
    margin: '5 6 5 6',
    layout: {
      type: 'hbox',
      align: 'center',
      pack: 'start'
    }
  },
  items: [{
    items: [{
      xtype: 'button',
      ui: 'default',
      iconCls: 'pictos pictos-question'
    }, {
      html: Lang.help.help,
      margin: '2 2 2 2'
    }],
    bind: {
      hidden: '{!showHelp}'
    }
  }, {
    items: [{
      xtype: 'button',
      text: Lang.Glossary,
      ui: 'default',
      iconCls: 'pictos pictos-table'
    }, {
      html: Lang.help.glossary,
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
      margin: '2 2 2 2'
    }],
    bind: {
      hidden: '{!showClose}'
    }
  }, {
    items: [{
      xtype: 'button',
      iconCls: 'pictos pictos-arrow_left',
      ui: 'default'
    }, {
      html: Lang.help.previous,
      margin: '2 2 2 2'
    }]
  }, {
    items: [{
      xtype: 'button',
      iconCls: 'pictos pictos-arrow_right',
      ui: 'default'
    }, {
      html: Lang.help.next,
      margin: '2 2 2 2'
    }]
  }, {
    items: [{
      xtype: 'button',
      iconCls: 'pictos pictos-chat',
      ui: 'default'
    }, {
      html: Lang.help.narration,
      margin: '2 2 2 2'
    }]
  }]
});