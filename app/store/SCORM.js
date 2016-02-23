Ext.define('Player.store.SCORM', {
  extend: 'Ext.data.Store',

  requires: [
    'Player.model.ScormData'
  ],

  autoLoad: true,
  model: 'Player.model.ScormData',
  storeId: 'SCORM',
  proxy: {
    type: 'localstorage',
    id: 'scorm'
  }
});