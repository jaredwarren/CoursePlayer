Ext.define('Player.store.GlossaryTreeStore', {
  extend: 'Ext.data.TreeStore',
  requires: [
    'Player.model.Glossary',
    'Ext.data.proxy.Ajax',
    'Ext.data.reader.Json'
  ],

  model: 'Player.model.Glossary',
  storeId: 'GlossaryTreeStore',
  autoLoad: true,
  proxy: {
    type: 'ajax',
    url: 'data/glossary.json',
    reader: {
      type: 'json',
      rootProperty: 'definitions'
    }
  },
  filters: [
    function(item) {
      if (item.isLeaf()) {
        return !item.data.hideEntry;
      } else {
        if (item.childNodes.length > 0) {
          var numDef = Ext.Array.reduce(item.childNodes, function(previous, term, index, items) {
            return previous += (!term.data.hideEntry) ? 1 : 0;
          }, 0);
          item.set('numDef', numDef);
          item.set('disabled', false);
          return true;
        }
        else{
          item.set('disabled', true);
        }
      }
      return true;
    }
  ],
  findRecordByType: function(type, value) {
    if (type == 'id') {
      return this.findIt(type, value, function(key, value, tempNode) {
        return (tempNode.id == value);
      }, this.root.childNodes);
    } else {
      return this.findIt(type, value, function(key, value, tempNode) {
        return (tempNode.raw[type] == value || tempNode.data[type] == value);
      }, this.root.childNodes);
    }
    return false;
  },

  findIt: function(key, value, condition, root) {
    var tempNode;
    for (var i = 0; i < root.length; i++) {
      tempNode = root[i];
      if ( !! condition.apply(this, [key, value, tempNode])) {
        return tempNode;
      }
      var result = this.findIt(key, value, condition, tempNode.childNodes);
      if ( !! result) {
        return result;
      }
    };
    return false;
  }
});