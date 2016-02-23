Ext.define('Player.page.definitions.Practice', {
  extend: 'Ext.Container',

  xtype: 'defpractice',

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
    definitions: undefined,
    randomize: true,
    tries: Number.MAX_SAFE_INTEGER,
    mode: 'practice',
    resetBtn: false,
    showCheckAnswer: false
  },

  constructor: function(cfg) {
    var me = this,
      correctResponses = [],
      newDropObjects = [],
      newDragObjects = [];
    cfg = cfg || {};


    Ext.Array.each(cfg.definitions, function(definition, index, definitions) {
      var matchelement = index;
      newDragObjects.push({
        html: definition.text,
        selectedCategory: null,
        matchelement: matchelement
      });
      newDropObjects[index] = {
        items: [{
          xtype: 'container',
          cls: 'drop-spacer',
          itemId: 'dropSpacer',
          width: 50,
          html: '...'
        }, {
          xtype: 'container',
          flex: 1,
          itemId: 'dropDef',
          html: definition.definition
        }],
        matchelement: matchelement,
        guess: null
      };
    });

    // randomize drop zones
    if ( !! cfg.randomize) {
      newDropObjects = randomizeArray(newDropObjects);
    }

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
          width: 100,
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
          xtype: 'panel',
          title: cfg.draghead,
          flex: 3,
          itemId: 'dropItems',
          bodyCls: 'ddtask-drop',
          defaults: {
            xtype: 'container',
            cls: 'ddtask-drop-item',
            style: 'background: transparent',
            margin: 10,
            layout: {
              type: 'hbox'
            },
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
        if (parentElement.classList.contains('ddtask-drop-item')) {
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
        parentElement.classList.add('drag-over');
      }
    }, true);

    // drop handler
    el.addEventListener("drop", function(ev) {
      ev.preventDefault();
      var parentElement = event.target,
        allowAdd = false;
      while (parentElement) {
        if (parentElement.classList.contains('ddtask-drop-item')) {
          allowAdd = true;
          break;
        }
        parentElement = parentElement.parentElement;
      }
      // clear css
      Ext.Array.each(me.el.dom.querySelectorAll('.drag-over'), function(dragObject, index, items) {
        dragObject.classList.remove('drag-over');
      });
      if (allowAdd) {
        // update ui
        if (me.getMode() == 'practice') {
          if (dropZone.matchelement === me._currenDrag.matchelement) {
            me._currenDrag.hide();
            dropZone.queryById('dropSpacer').setHtml(me._currenDrag.config.html);
            dropZone.queryById('dropDef').setStyle('color', 'green');
            dropZone.queryById('dropSpacer').setStyle('color', 'green');
          } else {
            dropZone.queryById('dropDef').setStyle('color', 'red');
          }
        } else {
          me._currenDrag.hide();
          dropZone.queryById('dropSpacer').setHtml(me._currenDrag.config.html);
        }
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
    if (Ext.isEmpty(drop.matchelement)) {
      drag.selectedCategory = null;
    } else {
      if ( !! drag.selectedCategory && drag.selectedCategory.matchelement != drop.matchelement) {
        drag.selectedCategory.queryById('dropSpacer').setHtml('...');
      }
      drag.selectedCategory = drop;
    }

    // check all
    me.queryById('dragItems').items.each(function(dragObject, index) {
      if (!dragObject.selectedCategory) {
        allSelected = false;
      } else if (dragObject.id != drag.id && drag.selectedCategory.matchelement == dragObject.selectedCategory.matchelement) {
        allSelected = false;
        dragObject.selectedCategory = null;
      }
    });

    if (me.getResetBtn()) {
      me.queryById('resetBtn').enable();
    }

   /* if (allSelected) {
      //me.showInstructions('evalPrompt', true);
      if (me.getShowCheckAnswer()) {
        me.queryById('checkAnswerBtn').enable();
      }
    } else {
      if (me.getShowCheckAnswer()) {
        me.queryById('checkAnswerBtn').disable();
      }
    }*/
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
      if (dragObject.matchelement != dragObject.selectedCategory.matchelement) {
        allCorrect = false;
      }
      userResponse.push({
        Short: dragObject.matchelement,
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
      me.queryById('checkAnswerBtn').setText("View Feedback");
      //me.queryById('checkAnswerBtn').disable();
    }
    if (me.getResetBtn()) {
      me.queryById('resetBtn').disable();
    }
  },
  clearOptions: function() {
    var me = this;

    me.queryById('dragItems').items.each(function(dragObject, index) {
      dragObject.selectedCategory = null;
      dragObject.show();
    });

    // randomize drop zones
    var newDropObjects = [];
    me.queryById('dropItems').items.each(function(dragObject, index) {
      dragObject.queryById('dropSpacer').setHtml('...');
      dragObject.queryById('dropDef').setStyle('color', 'black');
      dragObject.queryById('dropSpacer').setStyle('color', 'black');
      newDropObjects.push(dragObject.config);
    });
    if ( !! me.getRandomize()) {
      newDropObjects = randomizeArray(newDropObjects);
    }
    me.queryById('dropItems').removeAll();

    me.queryById('dropItems').add(newDropObjects);
  },
  start: function() {
    var me = this;
    me._disabled = false;
    me.clearOptions();
  }
});