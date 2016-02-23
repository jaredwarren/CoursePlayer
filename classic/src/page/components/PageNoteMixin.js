Ext.define('Player.page.components.PageNoteMixin', {
  extend: 'Ext.Base',

  mixinConfig: {
    id: 'pagenotemixin'
  },

  requires: ['Player.view.main.Note'],

  config: {
    note: undefined,
    nType: ''
  },

  addNote: function(cfg, items) {
    if (cfg.note && cfg.note.hasOwnProperty('#text')) {
      items.push({
        xtype: 'note',
        itemId: 'pageNote',
        nType: cfg.nType,
        noteText: cfg.note['#text']
      });
    }
    return items;
  }
});