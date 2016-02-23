Ext.define('Player.view.main.ProgressBarX', {
  extend: 'Ext.Container',
  xtype: 'progressbarx',

  config: {
    style: 'background-color:#666',
    layout: {
      type: 'fit'
    },
    maxValue: 100,
    value: 0,
    showText: 1,
    items: [{
      xtype: 'container',
      itemId: 'fillElement',
      style: 'background-color:#00B1EA',
      width: '10%'
    }, {
      xtype: 'container',
      centered: true,
      html: '--%',
      itemId: 'textElement'
    }]
  }
});