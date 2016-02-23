Ext.define('Player.view.phone.ContentPhone', {
  extend: 'Player.view.main.Content',
  xtype: 'contentphone',

  config: {
    items: [{
      xtype: 'pages',
      id: 'mainPages'
    }, {
      xtype: 'glossary',
      id: 'glossaryPanel'
    }, {
      xtype: 'tableofcontents',
      id: 'tableOfContents',
      width: '100%',
      height: '100%'

    }]
  },

  updateScreen: function(screen) {
    var me = this;
    switch (screen) {
      case 'main':
        Player.app.fireEvent('showVideo');
        //me.setActiveItem(0);
        me.animateActiveItem(0, {
          type: 'flip',
          direction: 'left'
        });
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