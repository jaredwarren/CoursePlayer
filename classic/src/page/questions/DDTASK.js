Ext.define('Player.page.questions.DDTASK', {
  extend: 'Player.page.questions.Question',

  xtype: 'DDTASK',

  scrollable: false,

  config: {
    dragobjects: {},
    draghead: '',
    feedback: {
      "initPrompt": {
        "#text": "Drag items to the correct category"
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
        newDragObjects.push({
          html: dragObject['#text'],
          selectedCategory: null,
          matchelement: dragObject.matchelement.toString()
        });

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

    cfg.questionRecord = {};
    cfg.questionRecord.correctResponse = correctResponses;

    if ( !! cfg.dragobjects.randomize) {
      newDragObjects = randomizeArray(newDragObjects);
    }

    var targetRegex = /^target(\d+?)$/;
    Ext.Object.each(cfg, function(key, value, myself) {
      if (targetRegex.test(key)) {
        var parts = key.match(targetRegex),
          part1 = parts[1],
          index = parseInt(part1, 10) - 1;

        newDropObjects[index] = {
          title: value.toString(),
          flex: 1,
          matchelement: part1,
          guess: null
        };
      }
    });

    me.callParent([Ext.apply({
      items: [{
        xtype: 'container',
        margin: '10 10 10 10',
        layout: {
          type: 'hbox',
          align: 'center',
          pack: 'center'
        },
        width: '90%',
        items: [{
          xtype: 'panel',
          title: cfg.draghead,
          flex: 1,
          itemId: 'dragItems',
          bodyCls: 'ddtask-drop',
          listeners: {
            render: me.initializeDropZone,
            scope: me
          },
          defaults: {
            xtype: 'container',
            cls: 'ddtask-drag',
            style: 'cursor: pointer',
            margin: 10,
            listeners: {
              render: me.initializeDragZone,
              scope: me
            }
          },
          items: newDragObjects
        }, {
          xtype: 'container',
          flex: 2,
          width: '100%',
          height: '100%',
          itemId: 'dropItems',
          layout: {
            type: 'hbox',
            align: 'center',
            pack: 'center'
          },
          defaults: {
            xtype: 'panel',
            height: '100%',
            flex: 1,
            bodyCls: 'ddtask-drop',
            style: 'background: transparent',
            listeners: {
              render: me.initializeDropZone,
              scope: me
            }
          },
          items: newDropObjects
        }]
      }]
    }, cfg)]);
  },

  _disabled: true,

  _currenDrag: null,

  initializeDragZone: function(dragItem) {
    var me = this,
      el = dragItem.el.dom;

    el.setAttribute('draggable', true);

    el.addEventListener("dragend", function(ev) {
      // clear css
      Ext.Array.each(me.el.dom.querySelectorAll('.drag-over'), function(dragObject, index, items) {
        dragObject.classList.remove('drag-over');
      });
    }, true);

    el.addEventListener("dragstart", function(ev) {
      if (me._disabled) {
        ev.preventDefault();
        return false;
      }
      //me._currenDrag = ev.target;
      me._currenDrag = dragItem;
    }, true);
  },

  initializeDropZone: function(dropZone) {
    var me = this,
      el = dropZone.el.dom;

    // drag over handler
    el.addEventListener("dragover", function(ev) {
      ev.preventDefault();
      var parentElement = event.target,
        allowAdd = false;
      while (parentElement) {
        if (parentElement.classList.contains('ddtask-drag')) {
          allowAdd = false;
          break;
        }
        if (parentElement.classList.contains('ddtask-drop')) {
          allowAdd = true;
          break;
        }
        parentElement = parentElement.parentElement;
      }
      if (allowAdd) {
        // clear css
        Ext.Array.each(me.el.dom.querySelectorAll('.drag-over'), function(dragObject, index, items) {
          dragObject.classList.remove('drag-over');
        });
        ev.target.classList.add('drag-over');
      }
    }, true);

    el.addEventListener("dragend", function(ev) {
      // clear css
      Ext.Array.each(me.el.dom.querySelectorAll('.drag-over'), function(dragObject, index, items) {
        dragObject.classList.remove('drag-over');
      });
    }, true);

    // drop handler
    el.addEventListener("drop", function(ev) {
      ev.preventDefault();
      var parentElement = event.target,
        allowAdd = false;
      while (parentElement) {
        if (parentElement.classList.contains('ddtask-drop')) {
          allowAdd = true;
          break;
        }
        parentElement = parentElement.parentElement;
      }
      if (allowAdd) {
        // update ui
        parentElement.querySelector('.x-autocontainer-innerCt').appendChild(me._currenDrag.el.dom);
        // clear css
        Ext.Array.each(me.el.dom.querySelectorAll('.drag-over'), function(dragObject, index, items) {
          dragObject.classList.remove('drag-over');
        });
        // track
        me.onSelect(me._currenDrag, dropZone);
        me._currenDrag = null;
      }
    }, true);
  },

  onSelect: function(drag, drop) {
    var me = this,
      allSelected = true;

    if (me.triesAttempted >= me.getTries()) {
      return false;
    }

    // record
    if (!drop.matchelement) {
      drag.selectedCategory = null;
    } else {
      drag.selectedCategory = drop;
    }

    // check all
    me.queryById('dragItems').items.each(function(dragObject, index) {
      if (!dragObject.selectedCategory) {
        allSelected = false;
        return false;
      }
    });

    if (me.getResetBtn()) {
      me.queryById('resetBtn').enable();
    }

    if (allSelected) {
      me.showInstructions('evalPrompt', true);
      if (me.getShowCheckAnswer()) {
        me.queryById('checkAnswerBtn').enable();
      }
    } else {
      if (me.getShowCheckAnswer()) {
        me.queryById('checkAnswerBtn').disable();
      }
    }
  },

  evalutateGuess: function(guess, answer) {
    var me = this,
      userResponse = [],
      allCorrect = true;

    me.queryById('dragItems').items.each(function(dragObject, index) {
      if (!dragObject.selectedCategory) {
        allCorrect = false;
        return false;
      }
      var correct = (dragObject.matchelement == dragObject.selectedCategory.matchelement);
      if (!correct) {
        allCorrect = false;
      }
      userResponse.push({
        correct: correct,
        correctMatch: dragObject.matchelement,
        Short: dragObject.selectedCategory.matchelement,
        Long: dragObject.config.html
      });
    });
    me.getQuestionRecord().response = userResponse;

    return allCorrect;
  },

  /*Cleanup*/
  disableQuestion: function() {
    var me = this;
    me._disabled = true;

    // I can't call setText because it will redraw everything...

    //me.callParent(arguments);
    if (me.getShowCheckAnswer()) {
      //me.queryById('checkAnswerBtn').setText("View Feedback");
      me.queryById('checkAnswerBtn').disable();
    }
    if (me.getResetBtn()) {
      me.queryById('resetBtn').disable();
    }
  },
  clearOptions: function() {
    var me = this;
    // lame hack to force redraw, which resets drag objects
    me.queryById('checkAnswerBtn').setText("View Feedback");
    me.queryById('dragItems').items.each(function(dragObject, index) {
      dragObject.selectedCategory = null;
    });
  },
  start: function() {
    var me = this;
    me._disabled = false;
    me.callParent(arguments);
  }
});