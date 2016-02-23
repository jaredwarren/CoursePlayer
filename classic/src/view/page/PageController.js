Ext.define('Player.view.page.PageController', {
  extend: 'Player.view.page.BasePageController',
  alias: 'controller.page',
  control: {
    'button[action=previousPage]': {
      'click': 'onPreviousPage'
    },
    'button[action=nextPage]': {
      'click': 'onNextPage'
    }
  },

  maskPages: function(message) {
    var me = this,
      maskObject = false;
    if (message === false) {
      if (me.pageMask) {
        me.pageMask.hide();
      }
    } else {
      if (!me.pageMask) {
        me.pageMask = new Ext.LoadMask({
          msg: message,
          target: me.getView()
        });
      } else {
        me.pageMask.msg = message;
      }
      if (!me.pageMask.isVisible()) {
        me.pageMask.show();
      }
    }
  }
});