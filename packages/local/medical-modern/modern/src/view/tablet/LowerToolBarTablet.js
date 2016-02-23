Ext.define('Player.view.tablet.LowerToolBarTablet', {
  extend: 'Player.view.main.LowerToolBar',

  xtype: 'lowertoolbartablet',

  requires: [
    'Player.view.tablet.LowerToolBarController'
  ],

  controller: 'lowertoolbartablet',

  ui: 'light',

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
    ui: 'previousPageBtn',
    width: 36,
    height: 36,
    action: 'previousPage',
    iconAlign: 'center',
    iconCls: 'pictos pictos-arrow_left'
  }, {
    xtype: 'spacer'
  }, {
    xtype: 'button',
    itemId: 'narrationBtn',
    disabled: true,
    ui: 'plain',
    action: 'shownarration',
    text: Lang.Narration,
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
      html: "Page {pageNumber} of {totalPageNumber}"
    }
  }, {
    xtype: 'spacer',
    cls: 'line-spacer',
    height: 26
  }, {
    xtype: 'button',
    itemId: 'glossaryBtn',
    cls: 'glossaryBtn',
    ui: 'plain',
    text: Lang.Glossary,
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
    width: 36,
    height: 36,
    ui: 'nextPageBtn',
    action: 'nextPage',
    iconAlign: 'center',
    iconCls: 'pictos pictos-arrow_right'
    //iconCls: 'arrow_right'
  }]
});