Ext.define('Player.view.tableofcontents.TableOfContents', {
  extend: 'Ext.tree.Panel',
  xtype: 'tableofcontents',
  requires: [
    'Player.view.tableofcontents.TableOfContentsController',
    'Player.store.ScoTreeStore'
  ],
  id: 'tableOfContents',
  controller: 'tableofcontents',
  reference: 'tableOfContents',
  rootVisible: false,
  store: 'ScoTreeStore',

  goToNode: function(pageNode) {
    // Nothing to do here; just here to make compatibl with nested list
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
          target: me
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