Ext.define('Player.view.tablet.LowerToolBarTablet', {
  extend: 'Player.view.main.LowerToolBar',

  xtype: 'lowertoolbartablet',

  requires: [
    'Player.view.tablet.LowerToolBarController'
  ],

  controller: 'lowertoolbartablet',

  ui: 'light',

  cls: 'lowerToolBar',

  hideAnimation: {
    type: 'slideOut',
    direction: 'down',
    duration: 400
  },
  showAnimation: {
    type: 'slideIn',
    direction: 'up',
    duration: 400
  },

  // must be in config so can be override
  items: [{
    xtype: 'button',
    id: 'previousPageBtn',
    cls: 'previous-btn',
    ui: 'action',
    action: 'previousPage',
    iconAlign: 'center',
    iconCls: 'pictos pictos-arrow_left'
  }, {
    xtype: 'spacer'
  }, {
    xtype: 'button',
    itemId: 'narrationBtn',
    disabled: true,
    ui: 'action',
    action: 'shownarration',
    iconCls: 'pictos pictos-chat',
    bind: {
      hidden: '{!narration}',
      disabled: '{narrationDisabled}'
    }
  }, {
    xtype: 'spacer',
    cls: 'line-spacer',
    height: 26
  }, {
    xtype: 'label',
    baseCls: 'x-title',
    cls: 'page-number',
    itemId: 'pageNumber',
    bind: {
      hidden: '{!pageNumbering}',
      html: "{pageNumber} of {totalPageNumber}"
    }
  }, {
    xtype: 'spacer',
    cls: 'line-spacer',
    height: 26
  }, {
    xtype: 'button',
    itemId: 'glossaryBtn',
    ui: 'action',
    iconCls: 'pictos pictos-table',
    action: 'showGlossary',
    bind: {
      hidden: '{!glossary}'
    }
  }, {
    xtype: 'spacer'
  }, {
    xtype: 'button',
    id: 'nextPageBtn',
    cls: 'next-btn',
    ui: 'action',
    action: 'nextPage',
    iconAlign: 'center',
    iconCls: 'pictos pictos-arrow_right'
    //iconCls: 'arrow_right'
  }]
});

