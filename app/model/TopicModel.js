Ext.define('Player.model.TopicModel', {
  extend: 'Ext.data.TreeModel',
  requires: [
    'Ext.data.field.String',
    'Ext.data.field.Boolean'
  ],
  entityName: 'TopicModel',
  fields: [{
    type: 'number',
    name: 'index'
  }, {
    type: 'string',
    name: 'text',
    mapping: 'title'
  }, {
    type: 'boolean',
    defaultValue: false,
    name: 'complete'
  }]
});