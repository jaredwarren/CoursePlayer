Ext.define('Player.controller.SCORM2004Mixin', {
  extend: 'Player.controller.SCORMMixin',

  _initialize: 'Initialize',
  _apiName: 'API_1484_11',
  _GetValueFn: 'GetValue',
  _GetLastErrorFn: 'GetLastError',
  _GetErrorStringFn: 'GetErrorString',
  _GetDiagnostic: 'GetDiagnostic',
  _SetValueFn: 'SetValue',
  _CommitFn: 'Commit',

  _bookmark: 'cmi.location',
  _datachunk: 'cmi.suspend_data',

  _score_raw: 'cmi.score.raw',
  _score_max: 'cmi.score.max',
  _score_min: 'cmi.score.min',

  _lesson_status: 'cmi.success_status',
  _session_time: 'cmi.session_time',

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
      return me.SetValue("cmi.interactions." + interactionCount + ".correct_responses.0.pattern", correct_responses);
    }
    return true;
  },

  _recordInteractionResponse: function(interactionCount, learner_response, alternateResponse) {
    var me = this;
    return me.SetValue("cmi.interactions." + interactionCount + "." + me._learner_response, learner_response);
  },



  Finish: function() {
    return this.execFinish('normal');
  },



  convertLatency: function(latencyInt) {
    var me = this,
      ScormTime = "",
      HundredthsOfASecond,
      Seconds,
      Minutes,
      Hours,
      Days,
      Months,
      Years,
      HUNDREDTHS_PER_SECOND = 100,
      HUNDREDTHS_PER_MINUTE = HUNDREDTHS_PER_SECOND * 60,
      HUNDREDTHS_PER_HOUR = HUNDREDTHS_PER_MINUTE * 60,
      HUNDREDTHS_PER_DAY = HUNDREDTHS_PER_HOUR * 24,
      HUNDREDTHS_PER_MONTH = HUNDREDTHS_PER_DAY * (((365 * 4) + 1) / 48),
      HUNDREDTHS_PER_YEAR = HUNDREDTHS_PER_MONTH * 12;
    HundredthsOfASecond = Math.floor(latencyInt / 10);
    Years = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_YEAR);
    HundredthsOfASecond -= (Years * HUNDREDTHS_PER_YEAR);
    Months = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_MONTH);
    HundredthsOfASecond -= (Months * HUNDREDTHS_PER_MONTH);
    Days = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_DAY);
    HundredthsOfASecond -= (Days * HUNDREDTHS_PER_DAY);
    Hours = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_HOUR);
    HundredthsOfASecond -= (Hours * HUNDREDTHS_PER_HOUR);
    Minutes = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_MINUTE);
    HundredthsOfASecond -= (Minutes * HUNDREDTHS_PER_MINUTE);
    Seconds = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_SECOND);
    HundredthsOfASecond -= (Seconds * HUNDREDTHS_PER_SECOND);
    if (Years > 0) {
      ScormTime += Years + "Y";
    }
    if (Months > 0) {
      ScormTime += Months + "M";
    }
    if (Days > 0) {
      ScormTime += Days + "D";
    }
    if ((HundredthsOfASecond + Seconds + Minutes + Hours) > 0) {
      ScormTime += "T";
      if (Hours > 0) {
        ScormTime += Hours + "H";
      }
      if (Minutes > 0) {
        ScormTime += Minutes + "M";
      }
      if ((HundredthsOfASecond + Seconds) > 0) {
        ScormTime += Seconds;
        if (HundredthsOfASecond > 0) {
          ScormTime += "." + HundredthsOfASecond;
        }
        ScormTime += "S";
      }
    }
    if (ScormTime == "") {
      ScormTime = "T0S";
    }
    ScormTime = "P" + ScormTime;
    return ScormTime;
  },

  convertTimestamp: function(timestamp) {
    var strTimeStamp;
    timestamp = new Date(timestamp);
    var me = this,
      Year = timestamp.getFullYear(),
      Month = timestamp.getMonth() + 1,
      Day = timestamp.getDate(),
      Hour = timestamp.getHours(),
      Minute = timestamp.getMinutes(),
      Second = timestamp.getSeconds();
    Month = me._zeroPad(Month, 2);
    Day = me._zeroPad(Day, 2);
    Hour = me._zeroPad(Hour, 2);
    Minute = me._zeroPad(Minute, 2);
    Second = me._zeroPad(Second, 2);
    strTimeStamp = Year + "-" + Month + "-" + Day + "T" + Hour + ":" + Minute + ":" + Second;
    var tzoffset = -(timestamp.getTimezoneOffset() / 60);
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


  _finish: function(exitType) {
    var me = this,
      blnResult = true;

    if (exitType == '') {
      exitType = 'normal';
    }

    me.callParent([exitType]);

    if ((exitType == 'normal') && !me.isStatusSet) {
      blnResult = me.SetValue("cmi.completion_status", 'completed') && blnResult;
    }
    blnResult = me.SetValue("cmi.exit", exitType) && blnResult;
    blnResult = me.Commit() && blnResult;
    blnResult = me.Terminate() && blnResult;
    return blnResult;
  },


  Terminate: function() {
    var result = this._api.Terminate("").toString();
    return result == 'true';
  }

});