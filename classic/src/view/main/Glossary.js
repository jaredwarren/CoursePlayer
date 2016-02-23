Ext.define('Player.view.main.Glossary', {
  extend: 'Ext.window.Window',
  xtype: 'glossary',

  requires: [
    'Ext.tree.Panel',
    'Player.view.main.GlossaryController',
    'Player.store.GlossaryTreeStore'
  ],

  controller: 'glossary',
  closeAction: 'hide',
  reference: 'glossary',

  scrollable: 'vertical',
  width: '90%',
  height: '90%',
  // required to be 'fit', otherwise scroller is off, and tree will scroll to top every time you expand a node
  layout: 'fit',

  modal: true,

  title: 'Glossary',

  constructor: function(cfg) {
    var me = this;
    cfg = cfg || {};

    me.callParent([Ext.apply({
      items: [{
        itemId: 'glossaryTree',
        width: '100%',
        height: '100%',
        xtype: 'treepanel',
        store: 'GlossaryTreeStore',
        rootVisible: false,
        listeners: {
          afteritemexpand: me.onAfterExpand,
          scope: me
        },
        columns: [{
          xtype: 'treecolumn', //this is so we know which column will show the tree
          text: 'Term',
          flex: 1,
          dataIndex: 'title',
          sortable: false
        }, {
          text: 'Definition',
          flex: 2.5,
          dataIndex: 'definition',
          cellWrap: true,
          sortable: false
        }]
      }]
    }, cfg)]);
  },
  onAfterExpand: function(node, index, item, eOpts) {
    var me = this,
      glossaryTree = me.queryById('glossaryTree');
    if(!node.isRoot()){
      if(!node.isLeaf()){
        // show first definition when expanding a node
        glossaryTree.view.scrollable.scrollIntoView(item.nextElementSibling);
      }
    }
  }
});