Ext.define('Player.view.main.LowerToolBar', {
  extend: 'Ext.Container',

  requires: [
    'Player.view.main.LowerToolbarModel'
  ],

  reference: 'lowerToolBar',
  viewModel: 'lowertoolbar',

  config: {
    baseCls: 'x-toolbar',
    docked: 'bottom',
    height: 47,
    layout: {
      align: 'center',
      pack: 'center',
      type: 'hbox'
    }
  }
});