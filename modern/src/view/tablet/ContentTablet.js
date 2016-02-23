Ext.define('Player.view.tablet.ContentTablet', {
  extend: 'Player.view.main.Content',
  xtype: 'contenttablet',

  items: [{
    xtype: 'pages',
    id: 'mainPages'
  }, {
    xtype: 'glossary',
    id: 'glossaryPanel'
  }],

  updateScreen: function(screen) {
    var me = this;

    switch (screen) {
      case 'main':
        me.setActiveItem(0);
        break;
      case 'glossary':
        me.animateActiveItem(1, {
          type: 'flip',
          direction: 'right'
        });
        break;
      case 'toc':
        if (me.dir && me.dir == 'right') {
          me.dir = 'right';
          me.out = false;
        } else {
          me.dir = 'left';
          me.out = true;
        }
        me.animateActiveItem(2, {
          type: 'flip',
          direction: me.dir,
          out: true,
          duration: 450
        });
        break;
    }
  }
});