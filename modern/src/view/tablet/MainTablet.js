Ext.define('Player.view.tablet.MainTablet', {
  extend: 'Player.view.main.Main',
  requires: [
    'Player.view.tablet.MainControllerTablet',
    'Player.view.tablet.UpperToolBarTablet',
    'Player.view.tablet.LowerToolBarTablet',// located in package
    'Player.view.tablet.ContentTablet',
    'Player.view.main.DockedToc',
    'Player.view.main.TimerBar',
    'Player.view.main.PopUpPanel',
    'Player.view.main.GlossaryPanel',
    'Player.view.main.MainModel',
    'Player.view.main.PageInfo',
    'Player.view.main.NarrationPanel',
    'Player.view.main.HelpPanelTablet'
  ],

  mixins: [
    'Ext.mixin.Responsive'
  ],
  responsiveConfig: {
    'width > 768': {
      portrait: false
    },
    'width <= 768': {
      portrait: true
    }
  },

  config: {
    portrait: false
  },

  controller: 'tabletmain',
  viewModel: 'main',

  items: [{
    xtype: 'dockedtoc',
    itemId: 'dockedToc'
  }, {
    xtype: 'uppertoolbartablet',
    docked: 'top',
    id: 'upperToolBar'
  }, {
    xtype: 'lowertoolbartablet',
    id: 'lowerToolBar'
  }, {
    xtype: 'timerbar',
    hidden: true,
    itemId: 'timeBar'
  }, {
    xtype: 'contenttablet',
    id: 'contentPanel'
  }, {
    xtype: 'popuppanel',
    hidden: true,
    itemId: 'narrationPanel'
  }, {
    xtype: 'glossarypanel',
    itemId: 'glossaryPopupPanel',
    hidden: true,
    hideOnMaskTap: true
  }, {
    xtype: 'narrationpanel',
    itemId: 'narrationWindow'
  }],
  updatePortrait: function(portrait) {
    this.queryById('hidetocBtn').setHidden(!portrait);
  }
});