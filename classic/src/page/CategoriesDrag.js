Ext.define('Player.page.CategoriesDrag', {
  extend: 'Player.page.Page',
  xtype: 'CategoriesDrag',

  requires: [
    'Player.page.components.TextImage',
    'Player.view.main.AudioBar',
    'Player.view.main.InstructionsPopup'
  ],

  config: {
    myResponses_btn: 'My Responses',
    restart_btn: 'Restart',
    showAnswers_btn: 'Show Answers',
    correctResponses_btn: 'Correct Responses',
    valueTime: 160
  },

  _terms: [],
  _oTerms: [],
  _guess: [],
  _disabled: false,

  constructor: function(cfg) {
    var me = this,
      items = cfg.items || [];
    cfg = cfg || {};

    var categoryPanels = [],
      terms = [];
    Ext.Array.each(cfg.game.category, function(category, index, cats) {
      if (category.hasOwnProperty('term') && category.term.length > 0 && !Ext.isEmpty(category.text)) {
        categoryPanels.push({
          title: category.text,
          categoryId: category.id,
          layout: 'fit',
          itemId: 'drop_' + category.id,
          items: [{
            xtype: 'container',
            itemId: 'dropContainer',
            items: [],
            layout: {
              type: 'vbox',
              align: 'center',
              pack: 'start'
            }
          }]
        });
        Ext.Array.each(category.term, function(term, index, ts) {
          if (term.hasOwnProperty('text') && !Ext.isEmpty(term.text)) {
            terms.push({
              xtype: 'container',
              cls: 'category-drag',
              html: term.text,
              categoryId: category.id
            });
          }
        });
      }
    });

    // store terms
    me._oTerms = terms;

    me.callParent([Ext.apply({
      items: [{
        xtype: 'instructionspopup',
        itemId: 'instructionspopup',
        title: me.getConfigValue(cfg, 'popInstruct.titleInst'),
        pText: cfg.popInstruct,
        mediaPath: cfg.audioPath,
        startButtonText: me.getConfigValue(cfg, 'popInstruct.startBTNTitle'),
        autoPlayMedia: true,
        listeners: {
          'start-activity': me.onShowInstructionsContinue,
          scope: me
        }
      }, {
        layout: {
          type: 'vbox',
          align: 'stretch'
        },
        items: [{
          xtype: 'container',
          height: 100,
          layout: {
            type: 'hbox',
            align: 'stretch'
          },
          items: [{
            xtype: 'container',
            flex: 1,
            itemId: 'instructionsCard',
            //scrollable: 'vertical',
            layout: 'card',
            activeItem: 0,
            margin: 6,
            items: [{
              xtype: 'container',
              html: me.getConfigValue(cfg, 'gameInstruct.#text')
            }, {
              xtype: 'container',
              html: me.getConfigValue(cfg, 'endInstruct.#text')
            }]
          }, {
            xtype: 'container',
            width: 200,
            hidden: !me.getConfigValue(cfg, 'hasTimer'),
            layout: {
              type: 'hbox',
              pack: 'center'
            },
            items: [{
              xtype: 'container',
              itemId: 'timerText',
              cls: 'cagegories-timerText',
              html: me.toHHMMSS(me.getConfigValue(cfg, 'valueTime'))
            }]
          }]
        }, {
          xtype: 'container',
          height: 50,
          itemId: 'dragWrapper',
          layout: {
            type: 'hbox',
            align: 'middle',
            pack: 'center'
          },
          items: []
        }, {
          xtype: 'container',
          flex: 1,
          layout: {
            type: 'hbox',
            align: 'stretch'
          },
          itemId: 'dropWrapper',
          defaults: {
            xtype: 'panel',
            flex: 1,
            cls: 'categories-drop',
            margin: 10,
            minHeight: 100,
            listeners: {
              render: me.initializeDropZone,
              scope: me
            }
          },
          items: categoryPanels
        }]
      }],
      bbar: [{
        xtype: 'tbspacer',
        flex: 1
      }, {
        xtype: 'button',
        itemId: 'showAnswersBtn',
        ui: 'action',
        text: me.getConfigValue(cfg, 'showAnswers_btn'),
        listeners: {
          click: me.onShowAnswers,
          scope: me
        }
      }, {
        xtype: 'button',
        itemId: 'restartBtn',
        ui: 'action',
        text: me.getConfigValue(cfg, 'restart_btn'),
        listeners: {
          click: me.onResetGame,
          scope: me
        }
      }, {
        xtype: 'button',
        itemId: 'myResponsesBtn',
        ui: 'action',
        hidden: true,
        text: me.getConfigValue(cfg, 'myResponses_btn'),
        listeners: {
          click: me.onShowMyResponses,
          scope: me
        }
      }, {
        xtype: 'button',
        itemId: 'correctResponsesBtn',
        ui: 'action',
        hidden: true,
        text: me.getConfigValue(cfg, 'correctResponses_btn'),
        listeners: {
          click: me.onShowCorrectAnswers,
          scope: me
        }
      }, {
        xtype: 'tbspacer',
        flex: 1
      }]
    }, cfg)]);
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
        if (parentElement.classList.contains('category-drag')) {
          allowAdd = false;
          break;
        }
        if (parentElement.classList.contains('categories-drop')) {
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
      if (me._disabled) {
        // clear css
        Ext.Array.each(me.el.dom.querySelectorAll('.drag-over'), function(dragObject, index, items) {
          dragObject.classList.remove('drag-over');
        });
        return;
      }
      var parentElement = event.target,
        allowAdd = false;
      while (parentElement) {
        if (parentElement.classList.contains('categories-drop')) {
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
        me._currenDrag.hide();
        dropZone.queryById('dropContainer').add({
          xtype: 'container',
          html: me._currenDrag.config.html
        });
        // track
        me.onSelect(me._currenDrag, dropZone);
        me._currenDrag = null;
      }
    }, true);
  },

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

  onShowInstructions: function() {
    var me = this;
    // TODO: if already started pause
    me.queryById('instructionspopup').show();
  },

  onShowInstructionsContinue: function() {
    var me = this;
    // TODO: if already started restart
    me.startActivity();
  },

  startActivity: function() {
    var me = this;
    me._guess = [];
    me._terms = [];
    // copy
    Ext.Array.each(me._oTerms, function(term, index, terms) {
      me._terms.push(term);
    });
    me._terms = randomizeArray(me._terms);

    me.queryById('restartBtn').show();
    me.queryById('showAnswersBtn').show();
    me.queryById('myResponsesBtn').hide();
    me.queryById('correctResponsesBtn').hide();

    me.nextTerm();

    me.startTimer(me.getValueTime());
  },

  nextTerm: function() {
    var me = this,
      dragWrapper = me.queryById('dragWrapper');

    dragWrapper.removeAll();
    if (me._terms.length > 0) {
      var nextTerm = me._terms.pop();
      nextTerm.xtype = 'container';
      nextTerm.listeners = {
        render: me.initializeDragZone,
        scope: me
      };
      dragWrapper.add(nextTerm);
    } else {
      me.onTimeEnd();
    }
  },

  _timer: null,
  startTimer: function(time) {
    var me = this,
      timerText = me.queryById('timerText');
    currentTime = time;
    clearInterval(me._timer);
    me._timer = window.setInterval(function() {;
      if (currentTime <= 0) {
        me.onTimeEnd();
      } else {
        timerText.setHtml(me.toHHMMSS(--currentTime));
      }
    }, 1000);
  },

  onTimeEnd: function() {
    var me = this;
    clearInterval(me._timer);
    me._disabled = true;

    // clear css
    Ext.Array.each(me.el.dom.querySelectorAll('.drag-over'), function(dragObject, index, items) {
      dragObject.classList.remove('drag-over');
    });

    me.queryById('restartBtn').hide();
    me.queryById('showAnswersBtn').hide();
    me.queryById('myResponsesBtn').show();
    me.queryById('correctResponsesBtn').show();

    // evaluate
    me.evaluate();

    // show results / hide drag
    me.onShowMyResponses();
  },

  evaluate: function() {
    var me = this,
      dragWrapper = me.queryById('dragWrapper'),
      totalCorrect = 0,
      total = total = me._oTerms.length;
    Ext.Array.each(me._guess, function(guess, index, guessss) {
      if (guess.correct) {
        totalCorrect += 1;
      }
    });

    dragWrapper.removeAll();
    dragWrapper.setHtml('<center>You got ' + totalCorrect + ' of ' + total + ' terms correct!</center>');
  },

  onSelect: function(drag, drop) {
    var me = this;
    me._guess.push({
      drag: drag.config,
      drop: drop,
      correct: (drop.categoryId === drag.categoryId)
    });

    me.nextTerm();
  },

  onShowAnswers: function() {
    var me = this;
    // stop game
    me.onTimeEnd();
    // 
    me.onShowCorrectAnswers();
  },
  onResetGame: function() {
    var me = this;
    // remove all from categories
    me.queryById('dropWrapper').items.each(function(dropZone) {
      dropZone.queryById('dropContainer').removeAll();
    });

    // reset terms and re-randomize
    me.startActivity();
  },
  onShowMyResponses: function() {
    var me = this;
    // remove all from categories
    me.queryById('dropWrapper').items.each(function(dropZone) {
      dropZone.queryById('dropContainer').removeAll();
    });

    Ext.Array.each(me._guess, function(guess, index, guessss) {
      var html = guess.drag.html;
      if (guess.correct) {
        html = '&#x2713; ' + html;
      } else {
        html = '&#x2717; ' + html;
      }
      guess.drop.queryById('dropContainer').add({
        xtype: 'container',
        html: html
      });
    });

    me.queryById('myResponsesBtn').disable();
    me.queryById('correctResponsesBtn').enable();
  },
  onShowCorrectAnswers: function() {
    var me = this;
    // remove all from categories
    me.queryById('dropWrapper').items.each(function(dropZone) {
      dropZone.queryById('dropContainer').removeAll();
    });

    Ext.Array.each(me._oTerms, function(term, index, terms) {
      var dropZone = me.queryById('drop_' + term.categoryId);
      dropZone.queryById('dropContainer').add({
        xtype: 'container',
        html: term.html
      });
    });

    me.queryById('myResponsesBtn').enable();
    me.queryById('correctResponsesBtn').disable();
  },

  start: function() {
    var me = this;
    me.callParent(arguments);

    me.queryById('instructionsCard').setActiveItem(0);

    me._disabled = false;
    me.onShowInstructions();
  },
  close: function() {
    var me = this;
    return;
  },
  /*
  utilities
  */
  toHHMMSS: function(seconds) {
    var sec_num = parseInt(seconds, 10);
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    // 0 pad string
    var time = '';
    // Hours: only show if greater than 0
    if (hours < 10 && hours > 0) {
      time += "0" + hours + ":";
    } else if (hours <= 0) {
      time += '';
    } else {
      time += hours + ":";
    }
    // Minutes: always show, event if 0
    if (minutes < 10) {
      time += "0" + minutes + ":";
    } else {
      time += minutes + ":";
    }
    // Seconds: alwasys show, even if 0
    if (seconds < 10) {
      time += "0" + seconds;
    } else {
      time += seconds;
    }
    return time;
  }
});