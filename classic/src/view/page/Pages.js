Ext.define('Player.view.page.Pages', {
  extend: 'Player.view.Carousel',
  xtype: 'pages',

  requires: [
    'Player.view.page.PageController'
  ],

  reference: 'mainPages',
  id: 'mainPages',

  controller: 'page',
  listeners: {
    click: {
      fn: 'onPageTap',
      element: 'el'
    }
  }
});