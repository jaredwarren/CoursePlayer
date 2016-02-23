Ext.define('Player.page.BasePage', {
  extend: 'Ext.Panel',

  requires: [
    'Player.view.main.Note'
  ],

  scrollable: {
    direction: 'vertical',
    directionLock: true
  },
  /*header: {
    ui: 'page-title'
  },*/
  //ui: 'page',
  config: {
    recordId: '',
    title: '',
    pType: '',
    pageNum: -1,
    nType: '',
    isTocEntry: true,
    nonNavPage: false,
    completed: false,
    narration: undefined,
    bookmark: ''
  },

  constructor: function(cfg) {
    var me = this;
    cfg = cfg || {};

    if (cfg.hasOwnProperty('note') && cfg.hasOwnProperty('nType') && cfg.nType != 'none') {
      var noteText = cfg.note;
      if (noteText.hasOwnProperty('#text')) {
        noteText = noteText['#text'];
      }
      cfg.items.push({
        xtype: 'note',
        region: 'south',
        margin: '10 0 0 0',
        docked: 'bottom',
        noteText: noteText,
        nType: cfg.nType
      });
    }

    me.callParent([cfg]);
  },

  start: function() {
    var me = this;
    if (!Player.settings.get('activateTimer') && Player.settings.get('pageComplete')) {
      me.fireEvent('page-complete', me);
    }
  },
  close: function() {},
  nextHandler: function() {
    return true;
  },
  previousHandler: function() {
    return true;
  },
  filterPText: function(pText) {
    if (pText && pText.hasOwnProperty('#text')) {
      return pText['#text'];
    } else {
      return pText;
    }
  },
  getConfigValue: function(cfg, key) {
    var parts = key.split('.'),
      text = '';
    text = Ext.Array.reduce(parts, function(previousValue, currentValue, index, items) {
      if (previousValue.hasOwnProperty(currentValue)) {
        return previousValue[currentValue];
      } else {
        return '';
      }
    }, cfg);

    if (Ext.isEmpty(text)) {
      text = Ext.Array.reduce(parts, function(previousValue, currentValue, index, items) {
        if (previousValue.hasOwnProperty(currentValue)) {
          return previousValue[currentValue];
        } else {
          return false;
        }
      }, this.config);
    }
    return text;
  }
});