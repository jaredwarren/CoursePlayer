Ext.define('Player.view.phone.MainPhone', {
  extend: 'Player.view.main.Main',
  requires: [
    'Player.view.phone.MainControllerPhone',
    'Player.view.phone.UpperToolBarPhone',
    'Player.view.phone.LowerToolBarPhone',
    'Player.view.phone.ContentPhone',
    'Player.view.main.TimerBar',
    'Player.view.main.GlossaryPanel',
    'Player.view.main.PageInfo',
    'Player.view.main.NarrationPanel',
    'Player.view.main.HelpPanelPhone'
  ],

  controller: 'phonemain',
  viewModel: 'main',

  items: [{
    xtype: 'uppertoolbarphone',
    docked: 'top',
    id: 'upperToolBar',
    width: '100%',
    top: 0,
    hidden: true
  }, {
    xtype: 'lowertoolbarphone',
    id: 'lowerToolBar',
    width: '100%',
    bottom: 0,
    hidden: true
  }, {
    xtype: 'timerbar',
    hidden: true,
    itemId: 'timeBar'
  }, {
    xtype: 'contentphone',
    id: 'contentPanel'
  }, {
    xtype: 'glossarypanel',
    itemId: 'glossaryPopupPanel',
    hideOnMaskTap: true
  }, {
    xtype: 'pageinfo',
    id: 'pageInfo',
    zIndex: 9
  }, {
    xtype: 'narrationpanel',
    itemId: 'narrationWindow'
  }]
});