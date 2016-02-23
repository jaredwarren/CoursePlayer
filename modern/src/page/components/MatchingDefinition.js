Ext.define('Player.page.components.MatchingDefinition', {
  extend: 'Ext.dataview.component.ListItem',
  xtype: 'matchingdefinition',

  scrollable: {
    direction: 'vertical',
    directionLock: true
  },
  cls: 'matching-def',
  height: 40,
  updateRecord: function(newData, oldData) {
    var me = this;
    if (newData) {
      me.setHtml(newData.raw['#text']);
    }
  }
});