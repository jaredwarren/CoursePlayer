Ext.define('Player.view.main.Content', {
  extend: 'Ext.Panel',
  requires: [
    'Player.view.page.Pages',
    'Player.view.main.Glossary'
  ],

  layout: {
    type: 'card'
  },
  reference: 'contentPanel',
  config: {
    screen: 'main'
  },

  updateScreen: function(screen) {
    var me = this;

    switch (screen) {
      case 'main':
        Player.app.fireEvent('showVideo');
        me.setActiveItem(0);
        break;
      case 'glossary':
        Player.app.fireEvent('hideVideo');
        me.animateActiveItem(1, {
          type: 'flip',
          direction: 'right'
        });
        break;
      case 'toc':
        me.animateActiveItem(2, {
          type: 'flip',
          direction: 'right'
        });
        break;
    }
  }
});