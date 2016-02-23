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
  items: [{
    xtype: 'panel',
    layout: {
      type: 'vbox'
    },
    maxWidth: 220,

    items: [{
      xtype: 'label',
      maxWidth: 220,
      cls: [
        'coursetitle'
      ],
      html: 'Course Title',
      itemId: 'courseTitle'
    }, {
      xtype: 'label',
      maxWidth: 220,
      cls: [
        'topictitle'
      ],
      html: 'Topic Title',
      itemId: 'topicTitle'
    }]
  }, {
    xtype: 'spacer'
  }, {
    xtype: 'button',
    id: 'helpBtn',
    itemId: 'helpBtn',
    ui: 'action',
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
    ui: 'action',
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