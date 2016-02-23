Ext.define('Player.page.components.PageNoteMixin', {
  extend: 'Ext.Base',

  mixinConfig: {
    id: 'pagenotemixin'
  },

  requires: ['Player.view.main.Note'],

  config: {
    note: {},
    nType: ''
  },

  updateNote: function(note) {
    var me = this,
      pageNote = me.getComponent('pageNote');

    
    if(note && note.hasOwnProperty('#text')){
      if(!pageNote){
        pageNote = me.createNote();
      }
      pageNote.setNoteText(note['#text']);

      ApplyMathJax(pageNote.element.dom);
    }
  },

  createNote: function(){
    var textNote = Ext.create('Player.view.main.Note', {
      itemId: 'pageNote',
      nType: this.nType
    });
    this.add(textNote);
    return textNote;
  },

  updateNType: function(nType) {
    var me = this,
      pageNote = me.getComponent('pageNote');

    if(pageNote){
      pageNote.setNType(nType);
    }
  }
});