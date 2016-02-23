Ext.define('Player.page.questions.DDTASK', {
  extend: 'Player.page.questions.Question',

  xtype: 'DDTASK',

  //scrollable: false,
  scrollable: {
    direction: 'vertical',
    directionLock: true
  },

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
      newDropObjects = [],
      newDragObjects = [];

    // filter drag objects
    Ext.Array.each(cfg.dragobjects.textelement, function(dragObject, index, dragobjects) {
      if (dragObject.hasOwnProperty('#text') && dragObject['#text'] != '' && dragObject.hasOwnProperty('matchelement')) {
        dragObject.text = dragObject['#text'];
        newDragObjects.push(dragObject);

        var key = parseInt(dragObject.matchelement, 10);
        var correctResponse = correctResponses[key];
        if (!correctResponse) {
          correctResponse = {
            title: cfg['target' + key],
            matchelement: key,
            matches: []
          }
        }
        correctResponse.matches.push({
          text: dragObject['#text']
        });
        correctResponses[key] = correctResponse;
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

    // targets
    // build targets
    var targets = [],
      targetRegex = /^target(\d+?)$/;
    Ext.Object.each(cfg, function(key, value, myself) {
      if (targetRegex.test(key)) {
        var parts = key.match(targetRegex),
          part1 = parts[1],
          index = parseInt(part1, 10) - 1;
        targets[index] = value;
      }
    });

    me.callParent([Ext.apply({
      targets: targets,
      items: [{
        xtype: 'list',
        margin: '10 10 10 10',
        cls: 'ddtask-item-list',
        width: '90%',
        itemId: 'datalist',
        inline: true,
        scrollable: false,
        /*scrollable: {
          direction: 'vertical',
          directionLock: true
        },*/
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
          '<div class="ddtask-item">',
          '<tpl if="guess != 0">',
          '<div class="ddtask-category-selected">CATEGORY: {category}</div>',
          '<div class="ddtask-text-selected">{text}</div>',
          '</tpl>',
          '<tpl if="guess == 0">',
          '<div class="ddtask-category-notselected">CATEGORY: ?</div>',
          '<div class="ddtask-text-notselected">{text}</div>',
          '<div class="ddtask-arrow" style="background: url(\'resources/images/tocArrow-02.png\') no-repeat; background-position: 50% 50%;"></div></tpl>',
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

    Ext.Array.each(targets, function(target, index, dragobjects) {
      pickerList.push({
        text: target,
        value: index + 1,
        selected: false
      });
    });

    if (!me.picker) {
      me.picker = Ext.create('Ext.Panel', {
        xtype: 'panel',
        itemId: 'picker',
        cls: 'ddtask-picker',
        centered: true,
        height: 130,
        width: '80%',
        hidden: true,
        scrollable: false,
        hideOnMaskTap: true,
        layout: {
          type: 'fit'
        },
        modal: true,
        items: [{
          xtype: 'panel',
          cls: 'ddtask-picker-title',
          docked: 'top',
          html: me.getDraghead()
        }, {
          xtype: 'list',
          cls: 'ddtask-picker-list',
          itemId: 'ddtaskPickerList',
          store: {
            data: pickerList,
            fields: [{
              name: 'text',
              type: 'string'
            }, {
              name: 'value',
              type: 'string'
            }]
          },
          itemTpl: [
            '<div class="ddtask-category">',
            '<div class="ddtask-category-text">{text}</div>',
            '</div>'
          ],
          listeners: {
            select: me.onPick,
            scope: me
          }

        }]
      });
      Ext.Viewport.add(me.picker);
    } else {
      me.picker.queryById('ddtaskPickerList').getStore().setData(pickerList);
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

  onPick: function(categoryList, record) {
    var me = this,
      list = me.queryById('datalist'),
      listSelection = list.getSelection();
    listSelection.set('guess', record.get('value'));
    listSelection.set('category', record.get('text'));
    list.deselectAll();
    categoryList.deselectAll();

    me.picker.hide();

    if (me.getResetBtn()) {
      me.queryById('resetBtn').enable();
    }

    // Show check answer instructions
    if (list.getStore().findExact('guess', '0') < 0) {
      if (me.firstSelect && me.getProvideFeedback()) {
        me.firstSelect = false;
        me.showInstructions(me.getFeedback().evalPrompt, true);
      }
      me.queryById('checkAnswerBtn').enable();
    } else {
      me.queryById('checkAnswerBtn').disable();
    }
  },

  evalutateGuess: function(guess, answer) {
    var me = this,
      userResponse = [],
      allCorrect = true;

    me.queryById('datalist').getStore().each(function(item, index, length) {
      var itemGuess = item.get('guess'),
        matchelement = item.get('matchelement');
      if (itemGuess != matchelement) {
        allCorrect = false;
      }
      userResponse.push({
        correct: (itemGuess != matchelement),
        correctMatch: matchelement.toString(),
        Short: itemGuess.toString(),
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
      item.set('category', '');
    });
  }
});