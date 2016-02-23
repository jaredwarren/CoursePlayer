Ext.define('Player.view.main.GlossaryController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.glossary',
  control: {
    'button[action=closeGlossary]': {
      'tap': 'onCloseGlossary'
    }
  },
  onCloseGlossary: function(button, e, options) {
    this.fireEvent('hide-glossary');
    this.closeTerm();
  },
  closeTerm: function() {}
});