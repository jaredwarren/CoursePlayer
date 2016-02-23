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

    var h = (Ext.os.is.Phone) ? 1 : 1;
    var style = 'font-size: 2em; font-weight: bold;'

    me.callParent([Ext.apply({
      layout: {
        type: 'vbox',
        pack: 'center',
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
          noteText: '<center><div style="padding-top: 20px; ' + style + '">' + me.getConfigValue(cfg, 'headerText') + '</div></center>'
        }, {
          xtype: 'panel',
          html: cfg.title,
          cls: 'page-title',
          margin: 6,
          itemId: 'pageTitle'
        }, {
          xtype: 'panel',
          html: me.getConfigValue(cfg, 'pText.#text'),
          cls: 'page-content',
          itemId: 'pageText'
        }, {
          xtype: 'container',
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
              tap: me.onPopup,
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