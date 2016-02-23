Ext.define('Player.page.Matching', {
  extend: 'Player.page.Page',
  xtype: 'Matching',

  config: {
    trackInteraction: true,
    recordScore: true,
    showCorrect: true,
    only_drop_on_correct: false,
    points_on_correct: 1,
    timer: 60,
    max_terms_by_game: Number.MAX_SAFE_INTEGER
  },

  _defs: [],
  _terms: [],

  constructor: function(cfg) {
    var me = this;
    cfg = cfg || {};

    var defs = [],
      terms = [];
    Ext.Array.each(cfg.game.term, function(term, index, cats) {
      if (term.hasOwnProperty('term') && term.hasOwnProperty('#text') && !Ext.isEmpty(term.term) && !Ext.isEmpty(term['#text'])) {
        term.matchId = index;
        defs.push(term);
        terms.push(term);
      }
    });

    me._terms = terms;
    me._defs = defs;

    var timer = parseInt(me.getConfigValue(cfg.configuration, 'timer'), 10),
      points = parseInt(me.getConfigValue(cfg.configuration, 'points_on_correct'), 10),
      showCorrect = me.getConfigValue(cfg.configuration, 'showCorrect');

    me.callParent([Ext.apply({
      only_drop_on_correct: me.getConfigValue(cfg.configuration, 'only_drop_on_correct'),
      points_on_correct: points,
      timer: timer,
      showCorrect: showCorrect,
      max_terms_by_game: Math.min(parseInt(me.getConfigValue(cfg, 'max_terms_by_game'), 10), terms.length),
      layout: {
        type: 'vbox',
        align: 'stretch'
      },
      items: [{
        xtype: 'instructionspopup',
        itemId: 'instructionspopup',
        title: me.getConfigValue(cfg, 'popup_title.#text'),
        pText: cfg.popup_title['#text'],
        mediaPath: cfg.configuration.audio,
        startButtonText: me.getConfigValue(cfg, 'start_btn.#text'),
        autoPlayMedia: true,
        listeners: {
          'start-activity': me.onShowInstructionsContinue,
          scope: me
        }
      }, {
        xtype: 'container',
        itemId: 'instructions',
        cls: 'matching-instructions',
        html: me.getConfigValue(cfg, 'instruction_page1.#text')
      }, {
        xtype: 'container',
        hidden: (timer < 1 && points <= 0),
        layout: {
          type: 'hbox',
          pack: 'end'
        },
        items: [{
          xtype: 'container',
          itemId: 'scoreBox',
          cls: 'scoreBox',
          layout: {
            type: 'hbox',
            align: 'center'
          },
          items: [{
            html: 'Score: 0',
            itemId: 'scoreText',
            cls: 'scoreText',
            hidden: (points <= 0 || !showCorrect)
          }, {
            html: ' | ',
            hidden: (timer < 1 || (points <= 0 || !showCorrect))
          }, {
            xtype: 'container',
            itemId: 'timerText',
            cls: 'timerText',
            hidden: (timer < 1),
            html: '00:00:00'
          }]
        }]
      }, {
        xtype: 'container',
        flex: 1,
        layout: {
          type: 'hbox',
          align: 'stretch'
        },
        items: [{
          xtype: 'container',
          itemId: 'termWrapper',
          flex: 1,
          layout: {
            type: 'vbox',
            align: 'stretch',
            pack: 'center'
          },
          defaults: {
            xtype: 'panel',
            cls: 'matching-drag',
            style: 'z-index: 2',
            margin: 10,
            listeners: {
              render: me.initializeDragZone,
              scope: me
            }
          },
          items: []
        }, {
          xtype: 'container',
          itemId: 'matchWrapper',
          flex: 1,
          height: '100%',
          html: '<canvas id="' + Ext.id() + '" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0;"></canvas>'
        }, {
          xtype: 'container',
          flex: 1,
          itemId: 'defWrapper',
          layout: {
            type: 'vbox',
            align: 'stretch',
            pack: 'center'
          },
          defaults: {
            xtype: 'panel',
            cls: 'matching-drop',
            style: 'z-index: 2',
            margin: 10,
            listeners: {
              render: me.initializeDropZone,
              scope: me
            }
          },
          items: []
        }]
      }, {
        xtype: 'container',
        layout: {
          type: 'hbox',
          align: 'middle',
          pack: 'center'
        },
        style: 'z-index: 2',
        items: [{
          xtype: 'button',
          itemId: 'myResponsesBtn',
          margin: 10,
          text: me.getConfigValue(cfg, 'myResponses_btn.#text'),
          listeners: {
            click: me.onShowMyResponses,
            scope: me
          }
        }, {
          xtype: 'button',
          itemId: 'correctResponsesBtn',
          margin: 10,
          text: me.getConfigValue(cfg, 'correctResponses_btn.#text'),
          listeners: {
            click: me.onShowCorrectResponses,
            scope: me
          }
        }]
      }]
    }, cfg)]);
  },

  onShowInstructionsContinue: function() {
    var me = this;
    // TODO start activity
    me.startActivity();
  },

  _disabled: false,
  _totalQuestions: -1,
  scormCorrectResponses: [],

  startActivity: function() {
    var me = this,
      terms = [],
      termWrapper = me.queryById('termWrapper'),
      defWrapper = me.queryById('defWrapper'),
      correctResponses = [];

    me.responses = [];
    me.drawLines(me.responses, 0, false);

    // terms
    terms = randomizeArray(me._terms).slice(0, me.getMax_terms_by_game());

    termWrapper.removeAll();
    Ext.Array.each(terms, function(term, index, terms) {
      term.termLetter = String.fromCharCode(65 + index);
      termWrapper.add({
        html: term.term.toString(),
        termLetter: term.termLetter,
        matchId: term.matchId
      });
    });

    terms = randomizeArray(terms);
    // defs
    defWrapper.removeAll();
    Ext.Array.each(terms, function(def, index, defs) {
      defWrapper.add({
        html: def['#text'],
        defLetter: String.fromCharCode(65 + index),
        matchId: def.matchId
      });
      correctResponses.push({
        termLetter: def.termLetter,
        termText: def.term.toString(),
        defLetter: String.fromCharCode(65 + index),
        defText: def['#text'],
        matchId: def.matchId
      });
    });

    me.scormCorrectResponses = correctResponses;

    me._totalQuestions = terms.length;

    me.queryById('myResponsesBtn').hide();
    me.queryById('correctResponsesBtn').hide();

    me.startTimer(me.getTimer());
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
        if (parentElement.classList.contains('matching-drag')) {
          allowAdd = false;
          break;
        }
        if (parentElement.classList.contains('matching-drop')) {
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
        if (parentElement.classList.contains('matching-drop')) {
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
        // track
        me.onMatch(me._currenDrag, dropZone);
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
      // don't allow drag to incorrect once correct
      var currentConnection = me.responses[dragItem.matchId];
      if (currentConnection && currentConnection.correct) {
        ev.preventDefault();
        return false;
      }
      me._currenDrag = dragItem;
    }, true);
  },

  /*
  Timer
  */
  _timer: null,
  _currentTime: 0,
  startTimer: function(time) {
    var me = this,
      timerText = me.queryById('timerText');
    me._currentTime = parseInt(time, 10);
    if (me._currentTime < 1) {
      timerText.hide();
      return;
    }

    timerText.setHtml(me.toHHMMSS(me._currentTime));
    clearInterval(me._timer);
    me._timer = window.setInterval(function() {;
      if (me._currentTime <= 0) {
        me.onTimeEnd(true, true);
      } else {
        timerText.setHtml(me.toHHMMSS(--me._currentTime));
      }
    }, 1000);
  },

  onTimeEnd: function(showFeedback, timeUp) {
    var me = this;
    clearInterval(me._timer);
    me._disabled = true;

    // clear css
    Ext.Array.each(me.el.dom.querySelectorAll('.drag-over'), function(dragObject, index, items) {
      dragObject.classList.remove('drag-over');
    });

    me.queryById('myResponsesBtn').show();
    me.queryById('correctResponsesBtn').show();

    // show results / hide drag
    me.onShowMyResponses();

    // update score one more time and show if points
    if (me.getPoints_on_correct() > 0) {
      me.updateScore();
      me.queryById('scoreText').show();
    }

    me.queryById('instructions').setHtml(me.config.instruction_page2['#text']);

    // record
    me.onGameComplete(showFeedback, timeUp);
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
  },

  onShowInstructions: function() {
    var me = this;
    // TODO: if already started pause
    me.queryById('instructionspopup').show();
  },


  responses: [],

  onMatch: function(drag, drop) {
    var me = this,
      currentConnection = null,
      addConnection = true,
      allCompleted = true,
      showCorrect = me.getShowCorrect(),
      connections = me.responses,
      correct = null;

    correct = (drop.matchId == drag.matchId);

    if (!correct && me.getOnly_drop_on_correct()) {
      return false;
    }

    // don't draw incorrect once correct
    if (showCorrect) {
      currentConnection = connections[drag.matchId];
      if (currentConnection && currentConnection.correct) {
        return false;
      }
    }

    for (var i = connections.length - 1; i >= 0; i--) {
      var connection = connections[i];
      if (typeof connection == 'undefined') {
        continue;
      }
      // remove old connections
      if (connection.defIndex == drop.matchId) {
        if (connection.correct) {
          addConnection = false;
          break;
        } else {
          connections[i] = undefined;
        }
      }
    }

    if (addConnection) {
      me.responses[drag.matchId] = {
        correct: correct,
        term: drag,
        def: drop,
        termIndex: drag.matchId,
        defIndex: drop.matchId
      };

      me.drawLines(me.responses, 0, showCorrect);
      if (correct) {
        me.score += me.getPoints_on_correct();
      }
    }

    me.updateScore();

    // check for completion
    for (var i = connections.length - 1; i >= 0; i--) {
      var connection = connections[i];
      if (typeof connection == 'undefined') {
        allCompleted = false;
        break;
      }
      if (!connection.correct) {
        allCompleted = false;
        break;
      }
    }
    if (allCompleted && connections.length == me._terms.length) {
      me.onTimeEnd(true, false);
    }
    return addConnection;
  },


  _currentShowCorrect: false,
  _currentConnections: [],
  _isDrawing: false,
  drawLines: function(connections, delay, showCorrect, callback) {
    var me = this,
      canvas = me.queryById('matchWrapper').el.dom.querySelector('canvas')
      ctx = canvas.getContext("2d"),
      canvasBox = canvas.getBoundingClientRect();

    delay = delay || 0;
    callback = callback || Ext.emptyFn;

    if (me._isDrawing) {
      return false;
    }

    // reset canvas size
    ctx.clearRect(0, 0, canvasBox.width, canvasBox.height);

    if (connections.length == 0) {
      return;
    }

    me._isDrawing = true;

    // Draw first
    (function next(counter, connections, canvasBox, ctx, delay, showCorrect) {
      var connection = connections[counter];

      // break if maxLoops has been reached
      if (counter++ >= connections.length) {
        callback.call(me);
        me._isDrawing = false;
        return;
      };
      // continue if connection is undefined
      if (typeof connection == 'undefined') {
        next(counter, connections, canvasBox, ctx, delay, showCorrect);
        return;
      }
      var termY, defY, termBox, defBox, termX, defX;

      termBox = connection.term.el.dom.getBoundingClientRect();
      termY = termBox.top + termBox.height / 2 - (canvasBox.top);
      termX = termBox.right - canvasBox.left;

      defBox = connection.def.el.dom.getBoundingClientRect();
      defY = defBox.top + defBox.height / 2 - canvasBox.top;
      defX = defBox.left - canvasBox.left;

      ctx.beginPath();
      ctx.moveTo(termX, termY);
      //ctx.lineTo(defX, defY);
      ctx.bezierCurveTo(100 + termX, 0 + termY, defX - 100, 0 + defY, 0 + defX, 0 + defY);
      ctx.lineWidth = 4;
      if (showCorrect) {
        ctx.strokeStyle = (connection.correct) ? 'green' : 'red';
      } else {
        ctx.strokeStyle = 'blue';
      }

      //box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);
      ctx.shadowColor = 'rgba(0, 0, 0, 0.26)';
      ctx.shadowBlur = 5;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 2;

      ctx.stroke();
      // delay next call
      setTimeout(function() {
        // call next() recursively
        next(counter, connections, canvasBox, ctx, delay, showCorrect);
      }, delay);

    })(0, connections, canvasBox, ctx, delay, showCorrect);

    me._currentConnections = connections;
    me._currentShowCorrect = showCorrect;
  },

  onInstructionContinue: function() {
    var me = this;
    /*me.instructionsPopup.query('#instructionsAudio')[0].pause();
    me.instructionsPopup.hide();*/

    me.updateScore();
    me.startTimer();
  },

  onGameComplete: function(showFeedback, timeUp) {
    var me = this,
      termWrapper = me.queryById('termWrapper'),
      defWrapper = me.queryById('defWrapper');

    if (showFeedback) {
      if (timeUp) {
        Ext.Msg.alert("Time's Up", me.config.instruction_page2['#text']);
      } else {
        Ext.Msg.alert("Success", me.config.instruction_page2['#text']);
      }
    }

    // do Scorm stuff
    if (me.getTrackInteraction()) {
      var scormResponses = [],
        blnCorrect = true,
        scormCorrectResponses = [];
      Ext.Array.each(me.responses, function(response, index, items) {
        if (typeof response != 'undefined') {
          if (!response.correct) {
            blnCorrect = false;
          }
          var source = SCORM.CreateResponseIdentifier(response.term.termLetter, response.term.config.html);
          var target = SCORM.CreateResponseIdentifier(response.def.defLetter, response.def.config.html);

          var matchingResponse = new SCORM.MatchingResponse(source, target);
          scormResponses.push(matchingResponse);

        }
      });

      Ext.Array.each(me.scormCorrectResponses, function(scormResponse, index, items) {
        var source = SCORM.CreateResponseIdentifier(scormResponse.termLetter, scormResponse.termText);
        var target = SCORM.CreateResponseIdentifier(scormResponse.defLetter, scormResponse.defText);

        var matchingResponse = new SCORM.MatchingResponse(source, target);
        scormCorrectResponses.push(matchingResponse);
      });

      //TODO: add question id and learning objective to form
      SCORM.RecordMatchingInteraction(me.getTitle(), scormResponses, blnCorrect, scormCorrectResponses, me.config.instruction_page1['#text'], 1, me.toHHMMSS(me._currentTime), me.getTitle());
    }

    // SCORM score
    if (me.getRecordScore()) {
      SCORM.SetPointBasedScore(me.currentPoints, me._terms.length * me.getPoints_on_correct(), 0);
    }
  },


  getCorrectResponses: function() {
    var me = this,
      terms = [],
      termWrapper = me.queryById('termWrapper'),
      defWrapper = me.queryById('defWrapper');
    termWrapper.items.each(function(term, termIndex) {
      defWrapper.items.each(function(def, defIndex) {
        if (def.matchId == term.matchId) {
          terms.push({
            correct: true,
            defIndex: defIndex,
            termIndex: termIndex,
            term: term,
            def: def
          })
        }
      });
    });
    return me.correctResponses = terms;
  },

  correctResponses: undefined,
  onShowCorrectResponses: function() {
    var me = this;

    me.queryById('correctResponsesBtn').disable();
    me.drawLines(me.getCorrectResponses(), 200, true, function() {
      me.queryById('myResponsesBtn').enable();
    });
  },

  onShowMyResponses: function() {
    var me = this;
    me.queryById('myResponsesBtn').disable();
    me.drawLines(me.responses, 200, true, function() {
      me.queryById('correctResponsesBtn').enable();
    });
  },


  updateScore: function() {
    var me = this,
      score = 0,
      scoreText = me.queryById('scoreText');
    score = Ext.Array.reduce(me.responses, function(previousValue, response, index, items) {
      if (typeof response != 'undefined' && response.correct) {
        return ++previousValue;
      }
      return previousValue;
    }, 0);
    scoreText.setHtml(me.config.score_title_txt["#text"] + " : " + score + " of " + me._terms.length * me.getPoints_on_correct());
  },

  onResize: function(width, height) {
    var me = this,
      matchWrapper = me.queryById('matchWrapper'),
      canvas = matchWrapper.el.dom.querySelector('canvas'),
      termWrapper = me.queryById('termWrapper').el.dom.getBoundingClientRect(),
      defWrapper = me.queryById('defWrapper').el.dom.getBoundingClientRect();
    me.callParent(arguments);

    canvas.style.setProperty('left', termWrapper.left + 'px');
    canvas.style.setProperty('top', termWrapper.top + 'px');

    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);

    canvas.style.setProperty('z-index', '1');

    me.drawLines(me._currentConnections, 0, me._currentShowCorrect);
  },


  start: function() {
    var me = this;
    me.callParent(arguments);

    me._disabled = false;
    me.onShowInstructions();
  },
  close: function() {
    var me = this;
    me.callParent(arguments);
    me.onTimeEnd();
  }
});