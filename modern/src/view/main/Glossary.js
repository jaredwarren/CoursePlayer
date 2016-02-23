Ext.define('Player.view.main.Glossary', {
  extend: 'Ext.dataview.NestedList',
  xtype: 'glossary',

  requires: [
    'Player.view.main.GlossaryController',
    'Ext.MessageBox'
  ],

  controller: 'glossary',

  reference: 'glossary',
  config: {
    displayField: 'title',
    store: 'GlossaryTreeStore',
    title: 'Glossary',
    backButton: {
      ui: 'back',
      iconCls: 'pictos pictos-arrow_left'
    },
    listConfig: {
      emptyText: 'No Terms Available',
      deferEmptyText: false
    },
    toolbar: {
      xtype: 'titlebar',
      height: 47,
      items: [{
        xtype: 'button',
        id: 'closeGlossaryBtn',
        ui: 'round',
        text: 'Close',
        align: 'right',
        action: 'closeGlossary'
      }]
    }
  },
  onItemTap: function(list, index, target, record, e) {
    var me = this;
    if (!record.isLeaf()) {
      if (record.get('numDef') == 0) {
        return false;
      }
    }
    me.callParent(arguments);
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
    // Remove non hideEntry from store
    if (store) {
      var removeitems = [];
      store.each(function(record) {
        if (record.isLeaf() && !! record.data.hideEntry) {
          removeitems.push(record);
        } else if (!record.isLeaf() && record.data.numDef == 0) {
          //removeitems.push(record);
        }
      }, me);
      store.remove(removeitems);
    }
    me.callParent(arguments);
  },
  getItemTextTpl: function(node) {
    return '<tpl if="leaf !=  true && disabled != true">' +
      '<span class="x-list-item-branch">{title}</span> <span class="pictos pictos-more"></span>' +
      '</tpl>' +
      '<tpl if="leaf !=  true && disabled === true">' +
      '<span class="x-list-item-branch x-list-item-disabled">{title}</span>' +
      '</tpl>' +
      '<tpl if="leaf === true">' +
      '<span class="x-list-item-branch">{title}</span>' +
      '</tpl>';
  }
});