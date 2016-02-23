Ext.define('Player.view.phone.UpperToolBarPhone', {
  extend: 'Player.view.main.UpperToolBar',
  xtype: 'uppertoolbarphone',

  style: 'box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);',

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

  cls: 'upperToolBar',

  items: [{
    xtype: 'panel',
    layout: {
      type: 'vbox'
    },
    maxWidth: 220,
    items: [{
      xtype: 'container',
      layout: {
        type: 'vbox'
      },
      items: [{
        xtype: 'label',
        itemId: 'courseTitle',
        bind: {
          html: '{coursetitle}',
          cls: '{courseclass}'
        }
      }, {
        xtype: 'label',
        cls: [
          'topictitle'
        ],
        itemId: 'topicTitle',
        bind: {
          html: '{_topictitle}',
          hidden: '{!_topictitle}'
        }
      }]
    }]
  }, {
    xtype: 'spacer'
  }, {
    xtype: 'button',
    id: 'helpBtn',
    itemId: 'helpBtn',
    cls: 'helpBtn',
    ui: 'round',
    //iconCls: 'pictos pictos-question',
    text: '?',
    height: 36,
    width: 36,
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
    ui: 'round',
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