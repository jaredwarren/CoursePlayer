Ext.define('Player.view.phone.UpperToolBarPhone', {
  extend: 'Player.view.main.UpperToolBar',
  xtype: 'uppertoolbarphone',

  ui: 'light',
  cls: 'upperToolBar',

  hideAnimation: {
    type: 'slideOut',
    direction: 'up',
    duration: 400
  },
  showAnimation: {
    type: 'slideIn',
    direction: 'down',
    duration: 400
  },
  items: [{
    xtype: 'panel',
    layout: {
      type: 'vbox'
    },
    maxWidth: 220,

    items: [{
      xtype: 'label',
      maxWidth: 220,
      itemId: 'courseTitle',
      bind: {
        html: '{coursetitle}',
        cls: '{courseclass}'
      }
    }, {
      xtype: 'label',
      maxWidth: 220,
      cls: [
        'topictitle'
      ],
      itemId: 'topicTitle',
      bind: {
        html: '{_topictitle}',
        hidden: '{!_topictitle}'
      }
    }]
  }, {
    xtype: 'spacer'
  }, {
    xtype: 'button',
    id: 'helpBtn',
    itemId: 'helpBtn',
    ui: 'plain',
    iconCls: 'pictos pictos-question',
    action: 'showHelp',
    bind: {
      hidden: '{!showHelp}'
    }
  }, {
    xtype: 'button',
    cls: 'closeBtn',
    itemId: 'closeBtn',
    height: 36,
    width: 36,
    ui: 'plain',
    iconCls: 'pictos pictos-delete',
    bind: {
      hidden: '{!showClose}'
    }
  }, {
    xtype: 'container',
    centered: true,
    cls: [
      'upperToolbarIcon'
    ],
    height: 47,
    hidden: true,
    itemId: 'upperToolbarIcon',
    width: '100%',
    zIndex: 9
  }]

});