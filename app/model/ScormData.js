Ext.define('Player.model.ScormData', {
  extend: 'Ext.data.Model',

  fields: [{
    name: 'id'
  }, {
    name: 'type',
    type: 'string'
  }, {
    name: 'data',
    type: 'string'
  }, {
    name: 'time',
    type: 'date',
    dateFormat: 'time'
  }]
});