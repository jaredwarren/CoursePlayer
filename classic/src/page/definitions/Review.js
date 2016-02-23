Ext.define('Player.page.definitions.Review', {
  extend: 'Ext.Container',

  xtype: 'defreview',

  scrollable: {
    direction: 'vertical',
    directionLock: true
  },
  layout: {
    align: 'center',
    pack: 'center',
    type: 'hbox'
  },

  config: {
    rolloverColor: '#FF9463',
    termsColor: '#5FA2DD',
    definitions: undefined
  },

  constructor: function(cfg) {
    var me = this,
      items = [];
    cfg = cfg || {};

    Ext.Array.each(cfg.definitions, function(definition, index, definitions) {
      items.push({
        xtype: 'container',
        items: [{
          xtype: 'container',
          cls: 'termtext',
          //style: 'background-color: ' + (cfg.termsColor || me.config.termsColor),
          style: 'background-color: ' + me.config.termsColor,
          html: definition.text,
          definition: definition.definition,
          listeners: {
            mouseenter: {
              element: 'el',
              fn: me.onTermEnter,
              scope: me
            }
          }
        }]
      });
    });

    me.callParent([Ext.apply({
      width: '100%',
      flex: 1,
      items: [{
        xtype: 'container',
        itemId: 'terms',
        cls: 'definitions-review-terms',
        flex: 1,
        layout: {
          type: 'vbox',
          align: 'end',
          pack: 'stretchmax'
        },
        defaults: {
          flex: 1,
          width: '90%'
        },
        items: items
      }, {
        xtype: 'panel',
        title: Lang.definitions.Definition,
        itemId: 'definitionText',
        cls: 'definitions-review-definition',
        flex: 1,
        height: '100%',
        minHeight: 200,
        html: ''
      }]
    }, cfg)]);
  },

  onTermEnter: function(event, target, eOpts) {
    var me = this,
      selectedTerm = me.queryById(target.id),
      definitionText = me.queryById('definitionText');
    definitionText.setHtml(selectedTerm.definition);
    selectedTerm.setStyle('background-color', me.getRolloverColor());
  },
  start: function() {
    var me = this;
    me.queryById('terms').items.each(function(selectedTerm, index, items) {
      selectedTerm.items.items[0].setStyle('background-color', me.getTermsColor());
    });
  }
});