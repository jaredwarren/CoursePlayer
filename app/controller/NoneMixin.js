Ext.define('Player.controller.NoneMixin', {
  extend: 'Ext.Base',
  // general api functions
  Initialize: function(config) {},

  // scorm driver 
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
  MatchingResponse: function(strShort, strLong) {
    this.Short = new String(strShort);
    this.Long = new String(strLong);
    this.toString = function() {
      return "[Response Identifier " + this.Short + ", " + this.Long + "]";
    };
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
  RecordMultipleChoiceInteraction: Ext.emptyFn,
  RecordTrueFalseInteraction: Ext.emptyFn,
  RecordFillInInteraction: Ext.emptyFn,
  RecordMatchingInteraction: Ext.emptyFn,
  RecordInteraction: Ext.emptyFn
});