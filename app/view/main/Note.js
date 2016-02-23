Ext.define('Player.view.main.Note', {
  extend: 'Ext.Container',
  xtype: 'note',

  //border: '2px',
  styleHtmlContent: true,
  width: '95%',

  layout: 'hbox',

  height: 120,
  width: '100%',

  config: {
    noteText: 'Lorem ipsum dolor sit amet',
    nType: 'none',
    border: ''
  },
  cls: [
    'note'
  ],
  constructor: function(cfg) {
    var me = this,
      items = [],
      nType = me.filterNType(cfg.nType);
    cfg = cfg || {};

    if (nType != 'none') {
      items.push({
        xtype: 'container',
        docked: 'left',
        itemId: 'noteIcon',
        margin: '0 0 6 0',
        html: '<img style="max-width: 100%; max-height: 96%;" src="resources/images/' + nType + '_icon.png"/>',
        width: '20%',
        height: '100%'
      });
    }
    var cls = 'note';
    if(!cfg.hasOwnProperty('bdr') || cfg.bdr != 'none'){
      cls += ' border';
    }

    items.push({
      xtype: 'container',
      flex: 1,
      height: 120,
      scrollable: {
        direction: 'vertical',
        directionLock: true
      },
      html: cfg.noteText
    });

    me.callParent([Ext.apply({
      cls: cls,
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