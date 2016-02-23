Ext.define('Player.page.definitions.Review', {
  extend: 'Ext.Container',
  xtype: 'defreview',

  requires: [
    'Player.layout.Accordion'
  ],

  layout: {
    align: 'center',
    pack: 'center',
    type: 'vbox'
  },
  scrollable: {
    direction: 'vertical',
    directionLock: true
  },

  config: {
    definitions: undefined,
    pageData: undefined
  },


  constructor: function(cfg) {
    var me = this;
    cfg = cfg || {};

    var defAccordionItems = [],
      tempDef, ln = cfg.pageData.definitionsText.defText.length,
      reviewInstructionsText = '',
      firstItem;

    // Add All Items
    for (var i = 0; i < ln; i++) {
      tempDef = cfg.pageData.definitionsText.defText[i];
      defAccordionItems.push({
        xtype: 'panel',
        title: tempDef.term,
        items: [{
          xtype: 'container',
          html: tempDef['#text']
        }],
        cls: 'def-item',
        collapsed: true
      });
    }

    if (cfg.pageData.reviewMobileInst && cfg.pageData.reviewMobileInst['#text']) {
      reviewInstructionsText = cfg.pageData.reviewMobileInst['#text'];
    } else if (cfg.pageData.instructionText && cfg.pageData.instructionText['#text']) {
      reviewInstructionsText = cfg.pageData.instructionText['#text'];
    }

    me.callParent([Ext.apply({
      region: 'center',
      items: [{
        xtype: 'container',
        docked: 'top',
        height: 64,
        cls: 'def-instructions',
        html: 'review instructions',
        itemId: 'reviewInstructions',
        html: reviewInstructionsText,
        ui: 'light',
        scrollable: {
          direction: 'vertical',
          directionLock: true
        }
      }, {
        xtype: 'container',
        itemId: 'accordionContainer',
        width: "90%",

        items: [{
          layout: {
            type: 'accordion',
            mode: 'SINGLE'
          },
          itemId: 'defAccordion',
          items: defAccordionItems
        }]
      }, {
        xtype: 'container',
        docked: 'bottom',
        height: 42,
        itemId: 'reviewButtonBar',
        layout: {
          align: 'center',
          pack: 'center',
          type: 'hbox'
        },
        items: [{
          xtype: 'button',
          ui: 'action',
          itemId: 'gotoPracticeBtn',
          text: Lang.definitions.Review_Practice
        }]
      }]
    }, cfg)]);
  },


  start: function() {
    var me = this,
      defAccordion = me.queryById('defAccordion');
    //defAccordion.getLayout().collapseAllButFirst();
    defAccordion.getLayout().expand(defAccordion.innerItems[0]);
  }

});