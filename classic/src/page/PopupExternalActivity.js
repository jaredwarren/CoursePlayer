Ext.define('Player.page.PopupExternalActivity', {
  extend: 'Player.page.Page',
  xtype: 'PopupExternalActivity',


  config: {
    btnText: "Start Activity",
    headerText: 'Popup External Activity',
    linkPath: undefined
  },

  constructor: function(cfg) {
    var me = this;
    cfg = cfg || {};

    var h = (Ext.os.is.Phone) ? 3 : 1;
    me.callParent([Ext.apply({
      layout: {
        type: 'vbox',
        align: 'center'
      },
      items: [{
        xtype: 'panel',
        width: '90%',
        cls: 'question-container',
        items: [{
          xtype: 'note',
          itemId: 'noteTitle',
          nType: 'exclaim',
          width: '100%',
          bdr: 'none',
          noteText: '<center><h' + h + ' style="padding-top: 20px">' + me.getConfigValue(cfg, 'headerText') + '</h' + h + '></center>'
        }, {
          xtype: 'panel',
          html: cfg.title,
          cls: 'page-title',
          itemId: 'pageTitle'
        }, {
          xtype: 'panel',
          html: me.getConfigValue(cfg, 'pText.#text'),
          cls: 'page-content',
          itemId: 'pageText'
        }, {
          xtype: 'toolbar',
          width: '100%',
          layout: {
            type: 'hbox',
            pack: 'end',
            align: 'end'
          },
          items: [{
            xtype: 'button',
            text: me.getConfigValue(cfg, 'btnText'),
            itemId: 'popupBtn',
            ui: 'action',
            iconCls: 'pictos pictos-arrow_right',
            iconAlign: 'left',
            listeners: {
              click: me.onPopup,
              scope: me
            }
          }]
        }]
      }]
    }, cfg)]);
  },

  onPopup: function() {
    var me = this;
    me.fireEvent('link-tap', me, me.getLinkPath());
  }
});