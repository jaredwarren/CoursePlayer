Ext.define('Player.controller.LocalMixin', {
  extend: 'Player.controller.SCORM2004Mixin',

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

  _learner_id: 'cmi.learner_id',
  _learner_name: 'cmi.learner_name',

  _completion_status: 'cmi.completion_status',

  _learner_response: 'learner_response',
  _timestamp: 'timestamp',

  _mode: 'cmi.mode',

  _t: 'true',
  _f: 'false',

  _api: {
    Initialize: function(config) {
      return "true";
    },
    GetValue: function(key) {
      var value = localStorage.getItem(key);
      if(value === null){
        return "";
      } else {
        return value;
      }
    },
    SetValue: function(key, value) {
      localStorage.setItem(key, value);
      return "true";
    },
    GetLastError: function() {
      return '0';
    },
    GetErrorString: function(config) {},
    GetDiagnostic: function(config) {},
    Commit: function(config) {
      return "true";
    },
    Terminate: function(config) {
      return "true";
    }
  }
});