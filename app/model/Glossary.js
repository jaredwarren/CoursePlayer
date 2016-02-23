Ext.define('Player.model.Glossary', {
  extend: 'Ext.data.TreeModel',
  requires: [
    'Ext.data.field.String',
    'Ext.data.field.Boolean'
  ],
  fields: [{
    type: 'string',
    name: 'text',
    mapping: 'title'
  }, {
    name: 'title',
    type: 'string',
    convert: function(value, record) {
      if (!value) {
        return '';
      }
      if (record.isLeaf()) {
        return record.data.title;
      }
      var numDef = 0;
      if (record.data.definitions.length > 0) {
        numDef = Ext.Array.reduce(record.data.definitions, function(previous, term, index, items) {
          return previous += (!term.hideEntry) ? 1 : 0;
        }, 0);
      }
      if (record.data.definitions) {
        return value + " (" + numDef + ")";
      }
      console.warn("- ", record, " -");
      return "- " + value + " -";
    }
  }, {
    name: 'numDef',
    type: 'int'
  }, {
    allowNull: false,
    name: 'disabled',
    defaultValue: false,
    type: 'boolean'
  }, {
    defaultValue: [],
    name: 'definition',
    type: 'string',
    convert: function(value, record) {
      // columns are layout in hbox for some reason, and I can't seem to override it, so wrap all <p> into one
      return "<div>" + value + "</div>";
    }
  }]
});