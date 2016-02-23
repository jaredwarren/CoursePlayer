Ext.define('Player.model.HelpModel', {
  extend: 'Ext.data.Model',
  config: {
    fields: [{
      name: 'title',
      type: 'string'
    }, {
      name: 'description',
      type: 'string'
    }, {
      name: 'icon',
      type: 'string'
    }, {
      name: 'iconCls',
      type: 'string'
    }]
  }
});