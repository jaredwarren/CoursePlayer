Ext.define('Player.page.VLPComponents.BaseNoteView', {
  extend: 'Player.page.VLPComponents.ObjectView',
  border: '2px',
  styleHtmlContent: true,
  layout: {
    type: 'hbox',
    align: 'stretch'
  },
  cls: ['note-view', 'object-view'],
  config: {
    note: undefined,
    nType: 'none'
  },
  scrollable: {
    direction: 'vertical',
    directionLock: true
  },

  constructor: function(cfg) {
    var me = this,
      items = [],
      nType = me.filterNType(cfg.data.nType);
    cfg = cfg || {};

    if (nType != 'none') {
      items.push({
        xtype: 'container',
        itemId: 'noteIcon',
        layout: 'fit',
        styleHtmlContent: true,
        html: '<img style="width:100%" src="resources/images/' + nType + '_icon.png"/>',
        flex: 2
      });
    }

    items.push({
      xtype: 'container',
      itemId: 'noteText',
      html: cfg.data.note['#text'],
      styleHtmlContent: true,
      scrollable: {
        direction: 'vertical',
        directionLock: true
      },
      flex: 8
    });

    me.callParent([Ext.apply({
      hidden: (nType == 'none'),
      items: items
    }, cfg)]);
  },

  filterNType: function(nType) {
    switch (nType) {
      case 'note':
        return 'hint';
      case 'caution':
        return 'warning';
      case 'none':
      case 'warning':
      case 'download':
      case 'tip':
        return nType;
      case '':
        return 'none';
      default:
        if (!nType) {
          return 'none';
        } else {
          return nType;
        }
        break;
    }
  }
});