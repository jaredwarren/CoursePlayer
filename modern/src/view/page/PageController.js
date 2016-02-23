Ext.define('Player.view.page.PageController', {
  extend: 'Player.view.page.BasePageController',
  alias: 'controller.page',
  control: {
    'button[action=previousPage]': {
      'tap': 'onPreviousPage'
    },
    'button[action=nextPage]': {
      'tap': 'onNextPage'
    }
  },
  maskPages: function(message) {
    var me = this,
      maskObject = false;
    if (message !== false) {
      maskObject = {
        xtype: "loadmask",
        message: message,
        cls: 'page-mask'
      };
    }
    Ext.getCmp("contentPanel").setMasked(maskObject);
  }
});