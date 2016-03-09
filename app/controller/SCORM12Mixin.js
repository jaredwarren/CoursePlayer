Ext.define('Player.controller.SCORM12Mixin', {
  extend: 'Player.controller.SCORMMixin',

  _initialize: 'LMSInitialize',
  _apiName: 'API',
  _GetValueFn: 'LMSGetValue',
  _GetLastErrorFn: 'LMSGetLastError',
  _GetErrorStringFn: 'LMSGetErrorString',
  _GetDiagnostic: 'LMSGetDiagnostic',
  _SetValueFn: 'LMSSetValue',
  _CommitFn: 'LMSCommit',

  _bookmark: 'cmi.core.lesson_location',
  _datachunk: 'cmi.suspend_data',

  _score_raw: 'cmi.core.score.raw',
  _score_max: 'cmi.core.score.max',
  _score_min: 'cmi.core.score.min',

  _lesson_status: 'cmi.core.lesson_status',
  _session_time: 'cmi.core.session_time',

  _learner_id: 'cmi.core.student_id',
  _learner_name: 'cmi.core.student_name',

  _completion_status: 'cmi.lesson_status',

  _learner_response: 'student_response',
  _timestamp: 'time',


  _mode: 'cmi.core.lesson_mode',

  _t: 't',
  _f: 'f',
  REVIEW_MODE_IS_READ_ONLY: false,

  Initialize: function(config) {
    var me = this,
      blnResult = true;

    me.callParent(arguments);

    if (me.GetLessonMode() != 'review') {
      if (me.GetValue("cmi.core.lesson_mode") == 'browse') {
        blnResult = me.SetValue("cmi.core.lesson_status", 'browsed');
      } else {
        if (me.GetValue("cmi.core.lesson_status") == "not attempted") {
          blnResult = me.SetValue("cmi.core.lesson_status", "incomplete");
        }
      }
      blnResult = me.SetValue("cmi.core.exit", "suspend") && blnResult;
    }
    return true;
  },

  ResetStatus: function() {
    var me = this,
      result;
    result = me.SetValue(me._lesson_status, 'unknown');
    return result;
  },

  RecordInteraction: function(id, type, learner_response, correct, correct_responses, description, weighting, latency, objectives) {
    var me = this,
      result;

    var interactionCount = me.GetValue('cmi.interactions._count');
    if (!interactionCount) {
      interactionCount = 0;
    }

    result = me.SetValue("cmi.interactions." + interactionCount + ".id", id);
    result = me.SetValue("cmi.interactions." + interactionCount + ".type", type) && result;
    result = me.SetValue("cmi.interactions." + interactionCount + "." + me._learner_response, learner_response) && result;

    var interactionResult = me._getInteractionResult(correct);
    if (interactionResult != undefined && interactionResult != null && interactionResult != "") {
      result = me.SetValue("cmi.interactions." + interactionCount + ".result", interactionResult) && result;
    }
    // weighting
    if (weighting != undefined && weighting != null && weighting != "") {
      result = me.SetValue("cmi.interactions." + interactionCount + ".weighting", weighting) && result;
    }

    // Objective
    if (objectives != undefined && objectives != null && objectives != "") {
      result = me.SetValue("cmi.interactions." + interactionCount + ".objectives.0.id", objectives) && result;
    }

    // latency
    if (latency != undefined && latency != null && latency != "") {
      result = me.SetValue("cmi.interactions." + interactionCount + ".latency", latency) && result;
    }

    return result;
  },

  _getInteractionResult: function(correct) {
    if (!isNaN(parseFloat(correct)) && isFinite(correct)) {
      return correct;
    } else {
      if (correct == true || correct == 'CORRECT') {
        return 'correct';
      } else if (correct == "" || correct == "false" || correct == 'WRONG') {
        return 'wrong';
      } else if (correct == 'UNANTICIPATED') {
        return 'unanticipated';
      } else if (correct == 'NEUTRAL') {
        return 'neutral';
      }
    }
    return false;
  },

  _recordInteractionDescription: function(interactionCount, description) {
    // scorm 1.2 doesn't support description as far as I know
    return true;
  },
  _recordInteractionCorrectResponse: function(interactionCount, correct_responses, alternateCorrectResponse) {
    var me = this,
      tempResult = true;
    if (correct_responses != undefined && correct_responses != null && correct_responses != "") {
      tempResult = me.SetValue("cmi.interactions." + interactionCount + ".correct_responses.0.pattern", correct_responses);
      if (tempResult == false) {
        tempResult = me.SetValue("cmi.interactions." + interactionCount + ".correct_responses.0.pattern", alternateCorrectResponse);
      }
    }
    return tempResult;
  },

  _recordInteractionResponse: function(interactionCount, learner_response, alternateResponse) {
    var me = this;
    var tempResult = me.SetValue("cmi.interactions." + interactionCount + "." + me._learner_response, learner_response);
    if (tempResult == false) {
      tempResult = me.SetValue("cmi.interactions." + interactionCount + "." + me._learner_response, alternateResponse);
    }
    return tempResult;
  },

  convertLatency: function(latencyInt, incFraction) {
    var me = this,
      intHours,
      intMinutes,
      intSeconds,
      intMilliseconds,
      intHundredths,
      strCMITimeSpan;
    if (incFraction == null || incFraction == undefined) {
      incFraction = true;
    }
    intMilliseconds = latencyInt % 1000;
    intSeconds = ((latencyInt - intMilliseconds) / 1000) % 60;
    intMinutes = ((latencyInt - intMilliseconds - (intSeconds * 1000)) / 60000) % 60;
    intHours = (latencyInt - intMilliseconds - (intSeconds * 1000) - (intMinutes * 60000)) / 3600000;
    if (intHours == 10000) {
      intHours = 9999;
      intMinutes = (latencyInt - (intHours * 3600000)) / 60000;
      if (intMinutes == 100) {
        intMinutes = 99;
      }
      intMinutes = Math.floor(intMinutes);
      intSeconds = (latencyInt - (intHours * 3600000) - (intMinutes * 60000)) / 1000;
      if (intSeconds == 100) {
        intSeconds = 99;
      }
      intSeconds = Math.floor(intSeconds);
      intMilliseconds = (latencyInt - (intHours * 3600000) - (intMinutes * 60000) - (intSeconds * 1000));
    }
    intHundredths = Math.floor(intMilliseconds / 10);
    strCMITimeSpan = me._zeroPad(intHours, 4) + ":" + me._zeroPad(intMinutes, 2) + ":" + me._zeroPad(intSeconds, 2);
    if (incFraction) {
      strCMITimeSpan += "." + intHundredths;
    }
    if (intHours > 9999) {
      strCMITimeSpan = "9999:99:99";
      if (incFraction) {
        strCMITimeSpan += ".99";
      }
    }
    return strCMITimeSpan;
  },

  convertTimestamp: function(dtmDate) {
    var me = this,
      strHours,
      strMinutes,
      strSeconds,
      strReturn;
    dtmDate = new Date(dtmDate);
    strHours = dtmDate.getHours();
    strMinutes = dtmDate.getMinutes();
    strSeconds = dtmDate.getSeconds();
    strReturn = me._zeroPad(strHours, 2) + ":" + me._zeroPad(strMinutes, 2) + ":" + me._zeroPad(strSeconds, 2);
    return strReturn;
  },



  /*  latency  -> ConvertMilliSecondsToSCORMTime
  timestamp -> ConvertDateToCMITime*/


  _finish: function(exitType) {
    var me = this,
      blnResult = true,
      lesson_mode = 'completed';

    me.callParent(arguments);

    if ((exitType == '') && !me.isStatusSet) {
      if (me.GetValue("cmi.core.lesson_mode") == 'browse') {
        lesson_mode = 'browse';
      }

      blnResult = me.SetValue("cmi.core.lesson_status", lesson_mode) && blnResult;
    }
    blnResult = me.SetValue("cmi.core.exit", exitType) && blnResult;
    blnResult = me.Commit() && blnResult;
    blnResult = me.Terminate() && blnResult;
    return blnResult;
  },

  Finish: function() {
    return this.execFinish('');
  },


  Terminate: function() {
    var result = this._api.LMSFinish("").toString();
    return result == 'true';
  }
});