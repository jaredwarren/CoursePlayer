Ext.define('Player.page.Definitions', {
  extend: 'Player.page.Page',
  xtype: 'Definitions',

  requires: [
    'Player.page.definitions.Review',
    'Player.page.definitions.Practice'
  ],

  layout: 'card',

  scrollable: false,

  constructor: function(cfg) {
    var me = this,
      items = cfg.items || [];
    cfg = cfg || {};

    var definitions = [];
    Ext.Array.each(cfg.definitionsText.defText, function(definition, index) {
      if (!Ext.isEmpty(definition.term)) {
        if (definition.hasOwnProperty('#text') && !Ext.isEmpty(definition['#text'])) {
          definitions.push({
            term: definition.term,
            termId: index,
            correct: false,
            definition: definition['#text']
          });
        } else {
          console.warn("TODO: look in glossary");
        }
      }
    });

    me.callParent([Ext.apply({
      listeners: {
        activeitemchange: function(sender, newCard, oldCard) {
          me.onActiveItemChange(sender, newCard, oldCard);
        }
      },
      items: [{
        xtype: 'defreview',
        itemId: 'reviewCard',
        definitions: definitions,
        pageData: cfg
      }, {
        xtype: 'practice',
        itemId: 'practiceCard',
        definitions: definitions,
        pageData: cfg
      }]
    }, cfg)]);
  },

  onActiveItemChange: function(sender, newCard, oldCard){
    newCard.start();
  },

  start: function() {
    var me = this;
    me.callParent(arguments);
    if (me.currentCard == 'review') {
      me.getComponent('reviewCard').start();
    }
  },
  toggleCard: function() {
    var me = this;
    if (me.currentCard == 'review') {
      me.currentCard = 'practice';
      me.setActiveItem(1);
    } else {
      me.currentCard = 'review';
      me.setActiveItem(0);
    }
  },

  initialize: function() {
    var me = this;
    me.callParent(arguments);

    me.callParent(arguments);
    me.currentCard = 'review';

    me.getComponent('reviewCard').query('#gotoPracticeBtn')[0].on('tap', me.toggleCard, me);
    me.getComponent('practiceCard').query('#gotoReviewBtn')[0].on('tap', me.toggleCard, me);
  }
});