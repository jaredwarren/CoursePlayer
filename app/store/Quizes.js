Ext.define('Player.store.Quizes', {
  extend: 'Ext.data.Store',
  alias: 'store.quizes',
  requires: [
    'Player.model.Quiz'
  ],

  config: {
    autoLoad: true,
    model: 'Player.model.Quiz',
    storeId: 'Quizes',
    proxy: {
      type: 'ajax',
      url: 'data/quiz.json',
      reader: {
        type: 'json',
        rootProperty: 'quiz'
      }
    }
  }
});