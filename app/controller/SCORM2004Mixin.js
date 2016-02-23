Ext.define('Player.controller.SCORM2004Mixin', {
  extend: 'Player.controller.SCORMMixin',

  _apiName: 'API_1484_11',
  _GetValueFn: 'GetValue',
  _GetLastErrorFn: 'GetLastError',
  _GetErrorStringFn: 'GetErrorString',
  _GetDiagnostic: 'GetDiagnostic',
  _SetValueFn: 'SetValue',

  _bookmark: 'cmi.location',
  _datachunk: 'cmi.suspend_data',

  _score_raw: 'cmi.score.raw',
  _score_max: 'cmi.score.max',
  _score_min: 'cmi.score.min',

  _lesson_status: 'cmi.success_status',

  _learner_id: 'cmi.learner_id',
  _learner_name: 'cmi.learner_name',

  _completion_status: 'cmi.completion_status',

  _learner_response: 'learner_response',
  _timestamp: 'timestamp',

  _mode: 'cmi.mode',

  _t: 'true',
  _f: 'false',

  Initialize: function(config) {
    var me = this,
      result,
      api;

    result = me.callParent(arguments);
    api = me.getAPI();
    if (!api) {
      console.error("No API");
      return false;
    }

    // get status
    if (me.GetStatus() == 'not attempted') {
      result = me.SetValue('cmi.completion_status', 'incomplete');
    }
    result = me.SetValue("cmi.exit", 'suspend') && result;

    if (me.GetLessonMode() == 'review') {
      // if review mode is read-only set that here... a feature not supported by the player
    }
    return true;
  },



  GetStatus: function() {
    var me = this,
      success_status = me.GetValue("cmi.success_status"),
      completion_status = me.GetValue("cmi.completion_status");
    if (success_status == 'passed') {
      return 'passed';
    } else if (success_status == 'failed') {
      return 'failed';
    } else if (completion_status == 'completed') {
      return 'completed';
    } else if (completion_status == 'incomplete') {
      return 'incomplete';
    } else if (completion_status == 'not attempted' || completion_status == 'unknown') {
      return 'not attempted';
    } else {
      console.warn("Invalid lesson status received from LMS", "completion_status=" + completion_status);
      return null;
    }
  },

  SetScore: function(intScore, intMaxScore, intMinScore) {
    var me = this,
      result,
      scaled = intScore / 100;
    scaled = +scaled.toFixed(7);
    result = me.callParent(arguments);
    result = me.SetValue('cmi.score.scaled', scaled) && result;
    return result;
  },

  SetPassed: function() {
    var me = this,
      result;
    result = me.callParent();
    result = me.SetCompleted() && result;
    return result;
  },

  SetFailed: function() {
    var me = this,
      result;
    result = me.callParent();
    result = me.SetCompleted() && result;
    return result;
  },

  ResetStatus: function() {
    var me = this,
      result;
    result = me.SetValue(me._lesson_status, 'unknown');
    result = me.SetValue(me._completion_status, 'completed') && result;
    return result;
  },

  _getInteractionResult: function(correct) {
    if (correct == true || correct == 'CORRECT' || correct == 'true') {
      return 'correct';
    } else if (String(correct) == "false" || correct == 'WRONG') {
      return 'incorrect';
    } else if (correct == 'UNANTICIPATED') {
      return 'unanticipated';
    } else if (correct == 'NEUTRAL') {
      return 'neutral';
    } else if (!isNaN(parseFloat(correct)) && isFinite(correct)) {
      return correct;
    } else {
      return '';
    }
  },

  _recordInteractionDescription: function(interactionCount, description) {
    var me = this;
    return me.SetValue("cmi.interactions." + interactionCount + ".description", description);
  },

  _recordInteractionCorrectResponse: function(interactionCount, correct_responses, alternateCorrectResponse) {
    var me = this;
    if (correct_responses != undefined && correct_responses != null && correct_responses != "") {
      return me.SetValue("cmi.interactions." + intInteractionIndex + ".correct_responses.0.pattern", correct_responses);
    }
    return true;
  },

  _recordInteractionResponse: function(interactionCount, learner_response, alternateResponse) {
    var me = this;
    return me.SetValue("cmi.interactions." + interactionCount + "." + me._learner_response, learner_response);
  },

  _formatTime: function(dtm) {
    var me = this,
      strTimeStamp;
    dtm = new Date(dtm);
    var Year = dtm.getFullYear();
    var Month = dtm.getMonth() + 1;
    var Day = dtm.getDate();
    var Hour = dtm.getHours();
    var Minute = dtm.getMinutes();
    var Second = dtm.getSeconds();
    Month = me._zeroPad(Month, 2);
    Day = me._zeroPad(Day, 2);
    Hour = me._zeroPad(Hour, 2);
    Minute = me._zeroPad(Minute, 2);
    Second = me._zeroPad(Second, 2);
    strTimeStamp = Year + "-" + Month + "-" + Day + "T" + Hour + ":" + Minute + ":" + Second;
    var tzoffset = -(dtm.getTimezoneOffset() / 60);
    if (tzoffset != 0) {
      strTimeStamp += '.0';
      if (tzoffset > 0) {
        if (('' + tzoffset).indexOf('.') != -1) {
          var fraction = '0' + ('' + tzoffset).substr(('' + tzoffset).indexOf('.'), ('' + tzoffset).length);
          var base = ('' + tzoffset).substr(0, ('' + tzoffset).indexOf('.'));
          fraction = (fraction * 60);
          strTimeStamp += '+' + me._zeroPad(base + '.' + fraction, 2);
        } else {
          strTimeStamp += '+' + me._zeroPad(tzoffset, 2);
        }
      } else {
        strTimeStamp += me._zeroPad(tzoffset, 2);
      }
    }
    return strTimeStamp;
  },

  _zeroPad: function(intNum, intNumDigits) {
    var strTemp;
    var intLen;
    var decimalToPad;
    var i;
    var isNeg = false;
    strTemp = new String(intNum);
    if (strTemp.indexOf('-') != -1) {
      isNeg = true;
      strTemp = strTemp.substr(1, strTemp.length);
    }
    if (strTemp.indexOf('.') != -1) {
      strTemp.replace('.', '');
      decimalToPad = strTemp.substr(strTemp.indexOf('.') + 1, strTemp.length);
      strTemp = strTemp.substr(0, strTemp.indexOf('.'));
    }
    intLen = strTemp.length;
    if (intLen > intNumDigits) {
      strTemp = strTemp.substr(0, intNumDigits);
    } else {
      for (i = intLen; i < intNumDigits; i++) {
        strTemp = "0" + strTemp;
      }
    }
    if (isNeg == true) {
      strTemp = '-' + strTemp;
    }
    if (decimalToPad != null && decimalToPad != '') {
      if (decimalToPad.length == 1) {
        strTemp += ':' + decimalToPad + '0';
      } else {
        strTemp += ':' + decimalToPad;
      }
    }
    return strTemp;
  },



  _finish: function(exitType) {
    var me = this,
      blnResult = true;

    me.callParent(arguments);

    if ((exitType == 'FINISH') && !me.isStatusSet) {
      blnResult = me.SetValue("cmi.completion_status", 'completed') && blnResult;
    }
    blnResult = me.SetValue("cmi.exit", exitType) && blnResult;
    blnResult = me.Commit() && blnResult;
    blnResult = me.Terminate() && blnResult;
    return blnResult;
  },


  Commit: function() {
    var result = this._api.Commit("").toString();
    return result == 'true';
  },

  Terminate: function() {
    var result = this._api.Terminate("").toString();
    return result == 'true';
  }

});