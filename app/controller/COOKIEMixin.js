Ext.define('Player.controller.COOKIEMixin', {
  extend: 'Player.controller.NoneMixin',
  /*config: {
    stores: ['SCORM']
  },*/
  DATACHUNK: 'dataChunk',
  BOOKMARK: 'bookmark',
  PERC: 'perc',
  SESSIONTIME: 'sessionTime',
  SCORE: 'score',
  STATUS: 'status',

  PASSED: 'passed',
  FAILED: 'failed',
  COMPLETED: 'completed',
  BROWSED: 'browsed',
  INCOMPLETE: 'incomplete',
  NOTATTEMPTED: 'notattempted', // "not attempted"??

  init: function(){ 
    console.info('plugin initted....');
  },

  Test: function() {
    console.info("test....");
  },
  SetDataChunk: function(chunk) {
    var me = this,
      perc = chunk.match(/:([0-9]*\.[0-9]+|[0-9]+):/)[1];

    me.setScormValue(me.PERC, perc);
    me.postMessage("SetPercentProgress", perc);

    me.setScormValue(me.DATACHUNK, chunk);
    me.postMessage('SetDataChunk', chunk);

    if (perc == 100) {
      me.SetCompleted();
    }
    return true;
  },

  GetDataChunk: function() {
    var me = this;
    return me.getScormValue(me.DATACHUNK);
  },

  SetBookmark: function(bookmark) {
    var me = this;
    me.setScormValue(me.BOOKMARK, bookmark);
    me.postMessage('SetBookmark', bookmark);
    return true;
  },

  GetBookmark: function() {
    var me = this;
    return me.getScormValue(me.BOOKMARK);
  },


  Start: function() {},
  Finish: function() {},
  Suspend: function() {
    Player.app.fireEvent('pauseCourse');
  },
  TimeOut: function() {},
  Unload: function() {},
  SetReachedEnd: function() {
    this.SetCompleted();
  },
  IsLoaded: function() {},
  WriteToDebug: function(msg) {
    console.log("SCORM:" + msg);
  },
  ShowDebugWindow: function() {},
  GetLastError: function() {},
  GetLastLSMErrorCode: function() {},
  GetLastErrorDesc: function() {},
  CommitData: function() {},
  GetStudentID: function() {
    // TODO: maybe request user info on init, then store, then return stored value here?
    return "Unknown Id";
  },
  GetStudentName: function() {
    // TODO: maybe request user info on init, then store, then return stored value here?
    return "Unknown Name";
  },
  SetPointBasedScore: function() {},
  MatchingResponse: function(strShort, strLong) {
    this.Short = new String(strShort);
    this.Long = new String(strLong);
    this.toString = function() {
      return "[Response Identifier " + this.Short + ", " + this.Long + "]";
    };
  },

  SetSessionTime: function(intMilliseconds) {
    var me = this;
    me.setScormValue(me.SESSIONTIME, intMilliseconds);
    me.postMessage("SetSessionTime", intMilliseconds);
  },

  ConcedeControl: function(win) {
    this.postMessage("close");
  },

  GetScore: function() {
    var me = this,
      scoreString = me.getScormValue(me.SCORE),
      score = Ext.JSON.decode(scoreString);
    return score;
  },
  SetScore: function(intScore, intMaxScore, intMinScore) {
    var me = this,
      score = {
        "intScore": intScore,
        "intMaxScore": intMaxScore,
        "intMinScore": intMinScore
      },
      scoreString = JSON.stringify(score);
    me.setScormValue(me.SCORE, scoreString);
    me.postMessage('SetScore', scoreString);
  },

  SetPassed: function() {
    this.SetStatus(this.PASSED);
  },
  SetFailed: function() {
    this.SetStatus(this.FAILED);
  },
  ResetStatus: function() {
    this.SetStatus(this.INCOMPLETE);
  },
  SetCompleted: function() {
    this.SetStatus(this.COMPLETED);
  },
  SetStatus: function(status) {
    var me = this;
    me.setScormValue(me.STATUS, status);
    me.postMessage("SetStatus", status);
  },
  GetStatus: function() {
    var me = this,
      status = me.getScormValue(me.STATUS);
    if (status === null) {
      me.SetStatus(me.INCOMPLETE);
    }
  },

  CreateResponseIdentifier: function(shortId, longId) {
    var rID = {
      "Short": shortId,
      "Long": longId,
      toString: function() {
        return "[Response Identifier " + this.Short + ", " + this.Long + "]";
      }
    };
    return rID;
  },
  RecordMultipleChoiceInteraction: function(strID, response, blnCorrect, correctResponse, strDescription, intWeighting, intLatency, strLearningObjectiveID) {
    this.RecordInteraction(strID, response, blnCorrect, correctResponse, strDescription, intWeighting, intLatency, strLearningObjectiveID);
  },
  RecordTrueFalseInteraction: function(strID, response, blnCorrect, correctResponse, strDescription, intWeighting, intLatency, strLearningObjectiveID) {
    this.RecordInteraction(strID, response, blnCorrect, correctResponse, strDescription, intWeighting, intLatency, strLearningObjectiveID);
  },
  RecordFillInInteraction: function(strID, response, blnCorrect, correctResponse, strDescription, intWeighting, intLatency, strLearningObjectiveID) {
    this.RecordInteraction(strID, response, blnCorrect, correctResponse, strDescription, intWeighting, intLatency, strLearningObjectiveID);
  },
  RecordMatchingInteraction: function(strID, response, blnCorrect, correctResponse, strDescription, intWeighting, intLatency, strLearningObjectiveID) {
    this.RecordInteraction(strID, response, blnCorrect, correctResponse, strDescription, intWeighting, intLatency, strLearningObjectiveID);
  },
  RecordInteraction: function(type, strID, response, blnCorrect, correctResponse, strDescription, intWeighting, intLatency, strLearningObjectiveID) {
    var me = this,
      interaction = {
        "type": type,
        "strID": strID,
        "response": response,
        "blnCorrect": blnCorrect,
        "correctResponse": correctResponse,
        "strDescription": strDescription,
        "intWeighting": intWeighting,
        "intLatency": intLatency,
        "strLearningObjectiveID": strLearningObjectiveID
      },
      interactionString = '';
    try {
      interactionString = JSON.stringify(interaction);
    } catch (e) {
      console.error("Could not stringify interaction - type:" + type);
      return false;
    }
    me.setScormValue(strID, interactionString);
    me.postMessage('RecordInteraction', interactionString);
  },

  getScormValue: function(type) {
    var me = this,
      record = me.ScormStore.findRecord('type', type),
      value = null;
    if (record) {
      value = record.get('data');
    }
    console.log("ScormController::getScormValue", type, value);
    return value;
  },
  setScormValue: function(type, value) {
    var me = this,
      record = me.ScormStore.findRecord('type', type);

    console.log("ScormController::setScormValue", type, value);
    if (record === null) {
      record = me.ScormStore.add({
        "type": type,
        "data": value,
        "time": new Date()
      })[0];
    } else {
      record.set('data', value);
      record.set('time', new Date());
    }
    me.ScormStore.sync();
  },

  postMessage: function(event, data) {
    var dataString = '',
      postString = '';
    if (typeof data !== "string") {
      try {
        dataString = JSON.stringify(data);
      } catch (e) {}
    } else {
      dataString = data;
    }
    if (dataString != '') {
      postString = event + "|" + dataString;
    } else {
      postString = event;
    }
    try {
      top.postMessage(postString, "*");
    } catch (e) {
      console.error("Could not send post:" + e);
    }
  },

  init: function(application) {
    application.on('loadscorm', this.onLoadscorm, this);
  },

  onLoadscorm: function() {
    var me = this,
      tracking = Player.settings.get('tracking').toUpperCase();


    switch (tracking) {
      case 'LOCAL':
        if (parent.opener !== null && parent.opener.Start) {
          SCORM = parent.opener;
        } else {
          if (parent.Start) {
            SCORM = parent;
          } else {
            Ext.Msg.alert(Lang.scorm.LMS_Error + ":" + tracking, Lang.scorm.Scorm_Load_Error);
            return;
          }
        }
        SCORM.Start();
        break;
      case 'COOKIE':
        me.ScormStore = Ext.getStore('SCORM');
        SCORM = me;
        break;
      case 'AICC':
      case 'SCORM1.2':
      case 'SCORM1.3':
      case 'SCORM2004':
      case 'TINCAN':
      case 'TCAPI':
        if (parent.opener !== null && parent.opener.Start) {
          SCORM = parent.opener;
        } else {
          if (parent.Start) {
            SCORM = parent;
          } else {
            Ext.Msg.alert(Lang.scorm.LMS_Error + ":" + tracking, Lang.scorm.Scorm_Load_Error);
          }
        }

        break;
      case 'MLSS':
        if (typeof SCORM_db !== "undefined") {
          SCORM = SCORM_db;
        } else {
          // load scorm_db.js if not found throw error.
          var head = document.getElementsByTagName('head')[0];
          var script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = 'SCORM_db.js';
          script.onload = function() {
            if (typeof SCORM_db !== "undefined") {
              SCORM = SCORM_db;
            } else {
              Ext.Msg.alert(Lang.scorm.LMS_Error + ":MLSS", Lang.scorm.Scorm_Load_Error);
            }
          };
          head.appendChild(script);
        }
        break;
      default:
        if (typeof SCORM_none !== "undefined") {
          SCORM = SCORM_none;
        } else {
          SCORM = {
            IsLmsPresent: function() {
              return false;
            },
            SetBookmark: Ext.emptyFn,
            GetBookmark: function() {
              return false;
            },
            SetDataChunk: Ext.emptyFn,
            GetDataChunk: function() {
              return false;
            },
            Start: Ext.emptyFn,
            Finish: Ext.emptyFn,
            Suspend: Ext.emptyFn,
            TimeOut: Ext.emptyFn,
            Unload: Ext.emptyFn,
            SetReachedEnd: Ext.emptyFn,
            IsLoaded: Ext.emptyFn,
            WriteToDebug: me.WriteToDebug,
            ShowDebugWindow: Ext.emptyFn,
            GetLastError: Ext.emptyFn,
            GetLastLSMErrorCode: Ext.emptyFn,
            GetLastErrorDesc: Ext.emptyFn,
            CommitData: Ext.emptyFn,
            GetStudentID: Ext.emptyFn,
            GetStudentName: Ext.emptyFn,
            SetSessionTime: Ext.emptyFn,
            ConcedeControl: Ext.emptyFn,
            GetScore: Ext.emptyFn,
            ResetStatus: Ext.emptyFn,
            SetScore: Ext.emptyFn,
            SetPassed: Ext.emptyFn,
            SetFailed: Ext.emptyFn,
            SetStatus: Ext.emptyFn,
            GetStatus: Ext.emptyFn,
            SetPointBasedScore: Ext.emptyFn,
            MatchingResponse: me.MatchingResponse,
            CreateResponseIdentifier: me.CreateResponseIdentifier,
            RecordMultipleChoiceInteraction: Ext.emptyFn,
            RecordTrueFalseInteraction: Ext.emptyFn,
            RecordFillInInteraction: Ext.emptyFn,
            RecordMatchingInteraction: Ext.emptyFn,
            RecordInteraction: Ext.emptyFn
          };
        }
        break;
    }
  }
});