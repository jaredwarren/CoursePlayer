Ext.define('Player.view.main.NarrationPanel', {
  extend: 'Ext.Panel',
  xtype: 'narrationpanel',

  reference: 'narration',
  cls: 'narration',
  style: 'box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);',
  centered: true,
  height: 250,
  width: 250,
  modal: false,
  hidden: true,
  closeAction: 'hide',
  scrollable: {
    direction: 'vertical',
    directionLock: true
  },
  draggable: {
    direction: 'both',
    constraint: {
      min: {
        x: -900,
        y: -900
      },
      max: {
        x: 900,
        y: 900
      }
    }
  },
  items: [{
    xtype: 'toolbar',
    docked: 'top',
    title: 'Narration',
    cls: 'x-msgbox-title',
    items: [{
      xtype: 'spacer'
    }, {
      xtype: 'button',
      id: 'closeNarration',
      itemId: 'closeNarration',
      action: 'closeNarration',
      ui: 'round',
      iconCls: 'pictos pictos-delete',
      align: 'right'
    }]
  }]
});