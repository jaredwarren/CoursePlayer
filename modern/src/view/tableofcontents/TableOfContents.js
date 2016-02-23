Ext.define('Player.view.tableofcontents.TableOfContents', {
  extend: 'Ext.dataview.NestedList',
  xtype: 'tableofcontents',

  requires: [
    'Player.view.tableofcontents.TableOfContentsController',
    'Player.store.ScoTreeStore'
  ],

  controller: 'tableofcontents',
  reference: 'tableOfContents',

  width: 250,
  height: '100%',
  autoDestroy: false,
  displayField: 'text',
  useTitleAsBackText: false,
  title: "Table of Contents",
  store: 'ScoTreeStore',
  cls: 'tableofcontents',
  backButton:{
    ui: 'back',
    iconCls: 'pictos pictos-arrow_left'
  },
  listConfig: {
    emptyText: "No Pages Available",
    deferEmptyText: false
  },
  toolbar: {
    xtype: 'titlebar',
    height: 47,
    items: [{
      xtype: 'button',
      hidden: true,
      itemId: 'closeToc',
      ui: 'round',
      text: "Close",
      action: 'showtoc',
      align: 'left'
    }, {
      xtype: 'button',
      height: 30,
      ui: 'action',
      itemId: 'hidetocBtn',
      text: 'X',
      action: 'hideToc',
      handler: 'onHideToc',
      align: 'right',
      zIndex: 24
    }]
  },

  // hack because store load event isn't set in time 
  updateStore: function(newStore, oldStore) {
    this.fireEvent('load');
    return this.callParent(arguments);
  },
  setActiveItem: function(list) {
    var me = this,
      store;
    if (typeof list.getStore != 'undefined') {
      store = list.getStore();
    } else if (typeof list.store != 'undefined') {
      store = list.store
    } else {
      return;
    }
    // Remove non isTocEntry from store
    if (store) {
      var removeitems = [];
      store.each(function(record) {
        if (record.isLeaf() && !record.data.isTocEntry) {
          removeitems.push(record);
        }
      }, me);
      store.remove(removeitems);
    }
    me.callParent(arguments);
  },
  getItemTextTpl: function(node) {
    //return '<span<tpl if="leaf == true"> class="x-list-item-leaf"</tpl><tpl if="leaf != true"> class="x-list-item-branch"</tpl>>{text}</span>';
    var checkIcon = 'resources/images/check02-12.png';
    return '<tpl if="leaf !=  true">' +
      '<span class="x-list-item-branch">{text}</span> <span class="pictos pictos-more"></span>' +
      '</tpl>' +
      '<tpl if="leaf === true && complete != true && restrictedTopicId !== false">' +
      '<span class="x-list-item-branch x-list-item-disabled">{text}</span>' +
      '</tpl>' +
      '<tpl if="leaf === true && complete != true && restrictedTopicId === false">' +
      '<span class="x-list-item-leaf">{text}</span>' +
      '</tpl>' +
      '<tpl if="complete === true && leaf ===  true">' +
      '<span class="pictos pictos-check2"></span><span class="x-list-item-leaf x-list-item-complete"> {title}</span>' +
      '</tpl>';
  }
});