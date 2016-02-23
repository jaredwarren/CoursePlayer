Ext.define('Player.view.main.FloatingToc', {
  extend: 'Ext.Panel',
  xtype: 'floatingtoc',
  config: {
    centered: true,
    height: 400,
    hidden: true,
    id: 'floatingToc',
    width: 262,
    autoDestroy: false,
    hideOnMaskTap: true,
    modal: true,
    layout: {
      type: 'fit'
    }
  }
});