Ext.define('Player.page.questions.MCAUDIO', {
  extend: 'Player.page.questions.BaseMCAUDIO',

  xtype: 'MCAUDIO',

  requires: [
    'Ext.form.field.Checkbox',
    'Player.page.components.AudioBox'
  ]
});