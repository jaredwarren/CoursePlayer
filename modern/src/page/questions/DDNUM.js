Ext.define('Player.page.questions.DDNUM', {
  extend: 'Player.page.questions.Question',

  xtype: 'DDNUM',

  requires: [
    'Ext.Picker'
  ],

  scrollable: false,

  config: {
    dragobjects: {},
    draghead: 'Select the category this belongs to:',
    targets: [],
    feedback: {
      "initPrompt": {
        "#text": "Tap each item and select the appropriate category."
      },
      provide: true
    }
  },



  constructor: function(cfg) {
    var me = this,
      correctResponses = [],
      pickerList = [],
      newDragObjects = [];

    // filter drag objects
    Ext.Array.each(cfg.dragobjects.textelement, function(dragObject, index, dragobjects) {
      if (dragObject.hasOwnProperty('#text') && dragObject['#text'] != '' && dragObject.hasOwnProperty('matchelement')) {
        dragObject.text = dragObject['#text'];
        newDragObjects.push(dragObject);
        pickerList.push({
          text: 'Step ' + dragObject.matchelement,
          value: dragObject.matchelement
        });
        correctResponses[index] = {
          title: dragObject['#text'],
          matchelement: dragObject.matchelement
        };
      }
    });
    if ( !! cfg.dragobjects.randomize) {
      newDragObjects = randomizeArray(newDragObjects);
    }

    // set Correct response, do after randomize so short answer is in correct order, eg if random order is 1,3,2,4, short andwer is 1,3,2,4
    /*var correctResponse = [];
    Ext.Array.each(newDragObjects, function(distractor, index, dragobjects) {
      correctResponse.push({
        Short: distractor.matchelement + '',
        Long: distractor['#text']
      });
    });*/
    cfg.questionRecord = {};
    cfg.questionRecord.correctResponse = correctResponses;


    me.callParent([Ext.apply({
      targets: pickerList,
      flexParent: 1,
      items: [{
        xtype: 'list',
        cls: 'ddnum-item-list',
        width: '90%',
        flex: 1,
        itemId: 'datalist',
        inline: true,
        store: {
          data: newDragObjects,
          fields: [{
            mapping: '#text',
            name: 'text',
            type: 'string'
          }, {
            name: 'matchelement',
            type: 'string'
          }, {
            name: 'category',
            type: 'string',
            defaultValue: ''
          }, {
            name: 'guess',
            type: 'string',
            defaultValue: '0'
          }]
        },
        itemTpl: [
          '<div class="ddnum-item">',
          '<tpl if="guess != 0">',
          '<div class="ddnum-step selected">{guess}</div>',
          '<div class="ddnum-text">{text}</div>',
          '</tpl>',
          '<tpl if="guess == 0">',
          '<div class="ddnum-step blank"></div>',
          '<div class="ddnum-text">{text}</div>',
          '</tpl>',
          '</div>'
        ],
        listeners: {
          select: me.onSelect,
          scope: me
        }
      }]
    }, cfg)]);
  },

  initialize: function() {
    var me = this;
    me.callParent(arguments);
    me.initTargets();
  },

  initTargets: function() {
    var me = this,
      pickerList = [],
      targets = me.getTargets();
    if (!me.picker) {
      me.picker = Ext.create('Ext.Picker', {
        doneButton: {
          listeners: {
            tap: me.onPick,
            scope: me
          }
        },
        hidden: true,
        toolbar: {
          ui: 'light',
          title: 'Select Step'
        },
        slots: [{
          name: 'matchelement',
          title: 'Step',
          data: targets
        }]
      });
      Ext.Viewport.add(me.picker);
    } else {
      me.picker.queryById('ddtaskPickerList').getSlots().setData(targets);
    }
  },

  onSelect: function(list, record, eOpts) {
    var me = this;
    if (me.triesAttempted >= me.getTries()) {
      list.deselectAll();
      return false;
    }
    me.picker.show();
  },
  onPick: function(button) {
    var me = this,
      picker = me.picker,
      list = me.queryById('datalist'),
      listStore = list.getStore(),
      slots = picker.getSlots()[0].data,
      pickedValue = me.picker.getValue();

    if (!pickedValue) {
      return;
    }

    if (me.getResetBtn()) {
      me.queryById('resetBtn').enable();
    }

    // Only allow one step to be selected per item
    listStore.each(function(item, index, length) {
      var itemGuess = item.get('guess');
      // set all with pickedValue to 0
      if (itemGuess == pickedValue.matchelement) {
        item.set('guess', 0);
      }

      // modify picker values, maybe in the future....
      for (var i = slots.length - 1; i >= 0; i--) {
        var slot = slots[i];
        if (slot.value == itemGuess || slot.value == pickedValue.matchelement) {
          slot.selected = true;
        }
      };
    });
    list.getSelection().set('guess', pickedValue.matchelement);
    list.deselectAll();

    //picker.setValue(false);


    // Show check answer instructions
    if (listStore.findExact('guess', '0') < 0) {
      if (me.firstSelect && me.getProvideFeedback()) {
        me.firstSelect = false;
        me.showInstructions(me.getEvalprompt_Text(), true);
      }
      me.query('#checkAnswerBtn')[0].enable();
    } else {
      me.query('#checkAnswerBtn')[0].disable();
    }
  },

  evalutateGuess: function(guess, answer) {
    var me = this,
      userResponse = [],
      allCorrect = true;

    me.queryById('datalist').getStore().each(function(item, index, length) {
      var itemGuess = item.get('guess'),
        matchelement = item.get('matchelement');
      if (itemGuess == '0') {
        allCorrect = false;
        return;
      }
      if (itemGuess != matchelement) {
        allCorrect = false;
      }
      userResponse.push({
        correct: (itemGuess == matchelement),
        correctMatch: matchelement,
        Short: itemGuess + '',
        Long: item.get('text')
      });
    });
    me.getQuestionRecord().response = userResponse;

    return allCorrect;
  },


  disableQuestion: function() {
    this.queryById('datalist').disable();
  },
  clearOptions: function() {
    var me = this,
      list = me.queryById('datalist');
    list.getStore().each(function(item, index, length) {
      item.set('guess', 0);
    });
  }
});