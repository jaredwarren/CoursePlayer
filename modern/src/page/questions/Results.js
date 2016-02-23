Ext.define('Player.page.questions.Results', {
  extend: 'Player.page.questions.BaseResults',

  xtype: 'Results',

  createEmailPopup: function(emailObj) {
    var me = this,
      emailPopup = Ext.create('Player.page.questions.EmailPopup', emailObj);
    emailPopup.on('submit', me.sendEmail, me);
    emailPopup = Ext.Viewport.add(emailPopup);
    return emailPopup;
  }
});