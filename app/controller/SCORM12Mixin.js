Ext.define('Player.controller.SCORM12Mixin', {
  extend: 'Player.controller.SCORMMixin',

  _apiName: 'API',
  _GetValueFn: 'LMSGetValue',
  _GetLastErrorFn: 'LMSGetLastError',
  _GetErrorStringFn: 'LMSGetErrorString',
  _GetDiagnostic: 'LMSGetDiagnostic',
  _SetValueFn: 'LMSSetValue',

  _bookmark: 'cmi.core.lesson_location',
  _datachunk: 'cmi.suspend_data',

  _score_raw: 'cmi.core.score.raw',
  _score_max: 'cmi.core.score.max',
  _score_min: 'cmi.core.score.min',

  _lesson_status: 'cmi.core.lesson_status',

  _learner_id: 'cmi.core.student_id',
  _learner_name: 'cmi.core.student_name',

  _completion_status: 'cmi.lesson_status',

  _learner_response: 'student_response',
  _timestamp: 'time',

  
  _mode: 'cmi.core.lesson_mode',

  _t: 't',
  _f: 'f',

  Initialize: function(config) {
    var me = this;

    me.callParent(arguments);

    if (me.GetLessonMode() != 'review') {
      if (SCORM_IsContentInBrowseMode()) {
        blnResult = me.SetValue("cmi.core.lesson_status", 'browsed');
      } else {
        if (SCORM_GetStatus() == me.NOTATTEMPTED) {
          blnResult = SCORM_CallLMSSetValue("cmi.core.lesson_status", SCORM_INCOMPLETE);
        }
      }
      blnResult = SCORM_CallLMSSetValue("cmi.core.exit", SCORM_TranslateExitTypeToSCORM(DEFAULT_EXIT_TYPE)) && blnResult;
    } else {
      if (!(typeof(REVIEW_MODE_IS_READ_ONLY) == "undefined") && REVIEW_MODE_IS_READ_ONLY === true) {
        blnReviewModeSoReadOnly = true;
      }
    }
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
      result = SCORM_CallLMSSetValue("cmi.interactions." + interactionCount + ".objectives.0.id", objectives) && result;
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

  _formatTime: function(dtmDate) {
    var strHours;
    var strMinutes;
    var strSeconds;
    var strReturn;
    dtmDate = new Date(dtmDate);
    strHours = dtmDate.getHours();
    strMinutes = dtmDate.getMinutes();
    strSeconds = dtmDate.getSeconds();
    strReturn = ZeroPad(strHours, 2) + ":" + ZeroPad(strMinutes, 2) + ":" + ZeroPad(strSeconds, 2);
    return strReturn;
  },


  _finish: function(exitType) {
    var me = this,
      blnResult = true,
      lesson_mode = 'completed';

    me.callParent(arguments);

    if ((exitType == 'FINISH') && !me.isStatusSet) {
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


  Commit: function() {
    var result = this._api.LMSCommit("").toString();
    return result == 'true';
  },

  Terminate: function() {
    var result = this._api.LMSFinish("").toString();
    return result == 'true';
  }
});