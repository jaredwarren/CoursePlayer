Ext.define('Player.page.Definitions', {
  extend: 'Player.page.Page',
  xtype: 'Definitions',

  requires: [
    'Player.page.definitions.Review',
    'Player.page.definitions.Practice'
  ],


  config: {
    instructionText: {
      '#text': 'Place the cursor over each term to learn more. When you are ready, click Practice to test yourself.'
    },
    instructionTextDD: {
      '#text': 'Let\'s see how well you know your terms. Drag the term to the correct definition.'
    }
  },

  constructor: function(cfg) {
    var me = this,
      items = cfg.items || [];
    cfg = cfg || {};

    var definitions = [];
    Ext.Object.each(cfg.definitionsText.defText, function(key, definition, myself) {
      if (!Ext.isEmpty(definition.term)) {
        if (definition.hasOwnProperty('#text') && !Ext.isEmpty(definition['#text'])) {
          definitions.push({
            text: definition.term,
            definition: definition['#text']
          });
        } else {
          console.warn("TODO: look in glossary");
        }
      }
    });

    me.callParent([Ext.apply({
      region: 'center',
      items: [{
        xtype: 'container',
        layout: 'card',
        itemId: 'definitionsCards',
        activeItem: 0,
        height: '100%',
        flex: 1,
        items: [{
          xtype: 'defreview',
          height: '100%',
          definitions: definitions,
          //termsColor: cfg.termsColor,
          //rolloverColor: cfg.rollverColor,
          listeners: {
            activate: me.onActiveItemChange,
            scope: me
          }
        }, {
          xtype: 'defpractice',
          height: '100%',
          definitions: definitions,
          randomize: true,
          listeners: {
            activate: me.onActiveItemChange,
            scope: me
          }
        }]
      }],
      bbar: [{
        xtype: 'toolbar',
        region: 'bottom',
        height: 47,
        width: '100%',
        items: [{
          xtype: 'button',
          text: Lang.definitions.ShowInstructions,
          ui: 'default',
          iconCls: 'pictos pictos-question',
          listeners: {
            click: me.showInstructions,
            scope: me
          }
        }, {
          xtype: 'tbspacer',
          flex: 1
        }, {
          xtype: 'button',
          itemId: 'toggleBtn',
          text: Lang.definitions.Review_Practice,
          ui: 'default',
          listeners: {
            click: me.toggleCard,
            scope: me
          }
        }]
      }]
    }, cfg)]);
  },

  onActiveItemChange: function(activeItem, oldValue) {
    var me = this,
      definitionsCards = me.queryById('definitionsCards'),
      toggleBtn = me.queryById('toggleBtn'),
      activeIndex = me.getActiveIndex();
    if (activeIndex == 0) {
      toggleBtn.setText(Lang.definitions.Review_Practice);
    } else {
      toggleBtn.setText(Lang.definitions.Learn);
    }
    activeItem.start();
  },

  showInstructions: function() {
    var me = this,
      definitionsCards = me.queryById('definitionsCards'),
      activeIndex = me.getActiveIndex();
    if (activeIndex == 0) {
      Ext.MessageBox.show({
        title: Lang.definitions.Practice_Instructions,
        msg: me.config.title + ' - ' + Lang.definitions.Learn + '<br/><br/>' + me.getInstructionText()['#text'],
        buttonText: {
          yes: Lang.definitions.Begin
        }
      });
    } else {
      Ext.MessageBox.show({
        title: Lang.definitions.Review_Instructions,
        msg: me.config.title + ' - ' + Lang.definitions.Review_Practice + '<br/><br/>' + me.getInstructionTextDD()['#text'],
        buttonText: {
          yes: Lang.definitions.Continue
        }
      });
    }
  },

  start: function() {
    var me = this,
      definitionsCards = me.queryById('definitionsCards'),
      activeIndex = me.getActiveIndex();
    me.callParent(arguments);

    if (activeIndex == 0) {
      me.getActiveItem().start();
    } else {
      definitionsCards.layout.setActiveItem(definitionsCards.items.items[0]);

    }

    me.showInstructions();
  },

  toggleCard: function() {
    var me = this,
      definitionsCards = me.queryById('definitionsCards'),
      activeIndex = me.getActiveIndex();
    if (activeIndex == 0) {
      definitionsCards.setActiveItem(1);
    } else {
      definitionsCards.setActiveItem(0);
    }
  },
  getActiveIndex: function() {
    var me = this,
      definitionsCards = me.queryById('definitionsCards');
    return definitionsCards.items.indexOf(definitionsCards.layout.getActiveItem());
  },
  getActiveItem: function() {
    var me = this,
      definitionsCards = me.queryById('definitionsCards');
    return definitionsCards.layout.getActiveItem();
  }
});