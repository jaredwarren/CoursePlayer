Ext.define('Player.view.tablet.UpperToolBarTablet', {
  extend: 'Player.view.main.UpperToolBar',
  xtype: 'uppertoolbartablet',

  mixins: [
    'Ext.mixin.Responsive'
  ],
  ui: 'light',
  responsiveConfig: {
    'width > 768': {
      compact: false
    },
    'width <= 768': {
      compact: true
    }
  },
  cls: 'upperToolBar',

  compact: false,
  items: [{
    xtype: 'button',
    height: 30,
    hidden: true,
    itemId: 'tocBtn',
    ui: 'action',
    text: 'Table of Contents',
    handler: 'onShowToc',
    zIndex: 24
  }, {
    xtype: 'spacer',
    width: 10
  }, {
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
    zIndex: 24,
    action: 'showHelp',
    bind: {
      hidden: '{!showHelp}'
    }
  }, {
    xtype: 'button',
    cls: 'closeBtn',
    itemId: 'closeBtn',
    height: 36,
    ui: 'round',
    iconCls: 'pictos pictos-delete',
    zIndex: 24,
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
    zIndex: 14
  }],
  config: {
    compact: false
  },
  updateCompact: function(compact) {
    this.getComponent('tocBtn').setHidden(!compact);
  }
});