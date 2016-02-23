Ext.define('Player.page.definitions.Practice', {
  extend: 'Ext.Container',
  xtype: 'practice',

  layout: {
    type: 'vbox'
  },
  config: {
    definitions: undefined,
    pageData: undefined
  },

  constructor: function(cfg) {
    var me = this,
      definitions = [],
      practiceInstructionsText = '';
    cfg = cfg || {};

    if (cfg.pageData.practiceMobileInst && cfg.pageData.practiceMobileInst['#text']) {
      practiceInstructionsText = cfg.pageData.practiceMobileInst['#text'];
    } else if (cfg.pageData.instructionTextDD && cfg.pageData.instructionTextDD['#text']) {
      practiceInstructionsText = cfg.pageData.instructionTextDD['#text'];
    }

    var newDropObjects = cfg.definitions;
    //newDropObjects = randomizeArray(newDropObjects);

    me.callParent([Ext.apply({
      items: [{
        xtype: 'container',
        docked: 'top',
        itemId: 'reviewToolbar',
        cls: 'def-instructions',
        layout: {
          align: 'center',
          pack: 'center',
          type: 'hbox'
        },
        items: [{
          xtype: 'container',
          height: 64,
          width: '100%',
          html: Lang.definitions.Practice_Instructions,
          itemId: 'practiceInstructions',
          scrollable: {
            direction: 'vertical',
            directionLock: true
          }
        }, {
          xtype: 'container',
          docked: 'right',
          items: [{
            xtype: 'button',
            itemId: 'resetBtn',
            ui: 'action',
            text: Lang.definitions.ResetBtn,
            iconCls: 'pictos pictos-refresh',
            iconAlign: 'top'
          }]
        }]
      }, {
        xtype: 'container',
        html: Lang.definitions.Practice_Step1,
        cls: 'def-step',
        itemId: 'termTitle'
      }, {
        xtype: 'list',
        itemId: 'termList',
        flex: 1,
        store: {
          fields: ['definition', 'correct', 'term', 'termId'],
          data: cfg.definitions
        },
        itemTpl: '<div>{term}</div>'
      }, {
        xtype: 'container',
        html: Lang.definitions.Practice_Step2,
        cls: 'def-step',
        itemId: 'defTitle'
      }, {
        xtype: 'list',
        itemId: 'defList',
        flex: 1,
        store: {
          fields: ['definition', 'correct', 'term', 'termId'],
          data: newDropObjects
        },
        itemTpl: [
          '<tpl if="correct">',
          '<div class="def-correct">',
          '<span class="topic-complete">&#x2713;</span> {term} - ',
          '</tpl>',
          '<tpl if="correct">',
          '<div style="display: inline-block;">',
          '</tpl>',
          '{definition}</div>'
        ]
      }, {
        xtype: 'container',
        docked: 'bottom',
        height: 42,
        itemId: 'practiceButtonBar',
        layout: {
          align: 'center',
          pack: 'center',
          type: 'hbox'
        },
        items: [{
          xtype: 'button',
          ui: 'action',
          itemId: 'gotoReviewBtn',
          text: Lang.definitions.Practice_Review
        }]
      }]
    }, cfg)]);
  },


  onTermSelect: function(dv, record, eOpts) {
    this.selectedRecord = record;
  },
  onDefSelect: function(dv, record, eOpts) {
    var me = this,
      defList = me.queryById('defList'),
      termList = me.queryById('termList'),
      defStore = defList.getStore(),
      termStore = termList.getStore(),
      defNode;
    if (!me.selectedRecord) {
      Ext.Msg.alert(Lang.definitions.Error, Lang.definitions.Practice_SelectTerm, Ext.emptyFn);
      defList.deselectAll();
      //defList.deselect(defList.getSelection());
      return;
    }

    if (me.selectedRecord.get('termId') === record.get('termId')) {
      defNode = defStore.getAt(defStore.find('termId', record.get('termId')));
      // correct
      record.set('correct', true);
      defNode.set('correct', true);

      // Clear term selection
      me.selectedRecord.store.remove(me.selectedRecord)
      me.selectedRecord = null;

      // make list item green
      var st = dv.getStore(),
        index = st.indexOf(record),
        list = dv.getActiveItem().items.items,
        ln = list.length,
        i,
        allComplete = true;

      for (i = 0; i < ln; i++) {
        if (index == i) {
          list[i].addCls('x-list-item-correct');
        }
      }

      if (termStore.getCount() <= 0) {
        this.fireEvent('page-complete');
      }

    } else {
      // Incrorrect
      Ext.Msg.show({
        title: Lang.definitions.Sorry,
        message: Lang.definitions.Practice_NotAMatch,
        buttons: {
          text: Lang.definitions.Try_Again,
          itemId: 'ok',
          ui: 'action'
        },
        promptConfig: false,
        fn: function(e) {
          var defList = this.queryById('defList');
          defList.deselect(defList.getSelection());
        },
        scope: me
      });
    }
  },
  onReset: function() {
    var me = this,
      defList = me.queryById('defList'),
      termList = me.queryById('termList'),
      termStore = termList.getStore(),
      defStore = defList.getStore();


    termList.deselectAll();
    defList.deselectAll();
    me.selectedRecord = null;

    var newDropObjects = me.getDefinitions();
    // resort terms for term list
    newDropObjects = Ext.Array.sort(newDropObjects, function(a, b) {
      if(a.termId < b.termId){
        return -1
      }
      if(a.termId > b.termId){
        return 1
      }
      return 0
    });
    // mark incorrect
    Ext.Array.each(newDropObjects, function(definition, index, definitions) {
      definition.correct = false;
    });

    // set terms
    termStore.setData(newDropObjects);

    // randomize and set defs
    newDropObjects = randomizeArray(newDropObjects);
    defStore.setData(newDropObjects);
  },

  start: function() {
    var me = this;
    me.onReset();
  },

  initialize: function() {
    var me = this;

    me.callParent(arguments);

    me.queryById('termList').on('select', me.onTermSelect, me);
    me.queryById('defList').on('select', me.onDefSelect, me);

    me.queryById('resetBtn').on('tap', me.onReset, me);
  }

});