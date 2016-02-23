Ext.define('Player.controller.SCORMMixin', {
	extend: 'Player.controller.LMSMixin',
	// generic vars
	_apiName: '',
	_bookmark: '',
	_datachunk: '',
	_completion: 'completed',

	_score_raw: '',
	_score_max: '',
	_score_min: '',

	_lesson_status: '',

	_learner_id: '',
	_learner_name: '',

	_learner_response: '',

	// protected vars
	_api: null,
	_initialized: false,

	isReachedEnd: false,

	isLoaded: false,
	isFinished: false,
	isCalledFinish: false,
	isReachedEnd: false,
	isOverrodeTime: false,
	isStatusSet: false,


	// general api functions
	Initialize: function(config) {
		var me = this,
			api;
		api = me.getAPI();
		if (!api) {
			console.error("Unable to locate the LMS's API Implementation.\nInitialize was not successful.");
			return false;
		}

		me._completion = config.completion;

		// do init stuff
		var result = api.Initialize("");
		if (result.toString() != "true") {
			var err = me.ErrorHandler();
			console.error("Initialize failed with error code: " + err.code);
			return false;
		}
		me._initialized = true;
		return true;
	},

	GetValue: function(key) {
		var me = this,
			api = me.getAPI(),
			result = "",
			error;
		if (api == null) {
			console.error("Unable to locate the LMS's API Implementation.\nGetValue was not successful.");
		} else if (!me._initialized && !me.Initialize()) {
			error = me.ErrorHandler();
			console.error("GetValue failed - Could not initialize communication with the LMS - error code: " + error.code);
		} else {
			result = api[me._GetValueFn](key);
			error = me.ErrorHandler();
			if (error.code != '0') {
				// an error was encountered so display the error description
				console.error("GetValue(" + key + ") failed. \n" + error.code + ": " + error.string);
				result = "";
			}
		}
		return result.toString();
	},

	SetValue: function(key, value) {
		var me = this,
			api = me.getAPI(),
			result = "false",
			error;
		if (api == null) {
			console.error("Unable to locate the LMS's API Implementation.\nSetValue was not successful.");
		} else if (!me._initialized && !me.Initialize()) {
			error = ErrorHandler();
			console.error("SetValue failed - Could not initialize communication with the LMS - error code: " + error.code);
		} else {
			result = api[me._SetValueFn](key, value);
			if (result.toString() != "true") {
				error = me.ErrorHandler();
				console.error("SetValue(" + key + ", " + value + ") failed. \n" + error.code + ": " + error.string);
			}
		}

		return result.toString();
	},



	GetBookmark: function() {
		var me = this;
		me.GetValue(me._bookmark);
	},

	SetBookmark: function(bookmark) {
		var me = this;
		me.SetValue(me._bookmark, bookmark);
	},

	GetDataChunk: function() {
		var me = this;
		me.GetValue(me._datachunk);
	},

	SetDataChunk: function(suspend_data) {
		var me = this;
		me.SetValue(me._datachunk, suspend_data);
	},



	SetScore: function(intScore, intMaxScore, intMinScore) {
		var me = this,
			result;
		result = me.SetValue(me._score_raw, intScore);
		result = me.SetValue(me._score_max, intMaxScore) && result;
		result = me.SetValue(me._score_min, intMinScore) && result;
		return result;
	},

	SetPassed: function() {
		var me = this,
			result;
		result = me.SetValue(me._lesson_status, 'passed');
		return result;
	},

	SetFailed: function() {
		var me = this,
			result;
		result = me.SetValue(me._lesson_status, 'failed');
		return result;
	},

	GetLessonMode: function(){
		var me = this;
		return lessonMode = me.GetValue(me._mode);
	},


	SetCompleted: function() {
		var me = this,
			result;
		result = me.SetValue(me._completion_status, 'completed') && result;
		return result;
	},

	GetStudentID: function() {
		return this.GetValue(this._learner_id);
	},

	GetStudentName: function() {
		return this.GetValue(this._learner_name);
	},

	ConcedeControl: function() {
		var me = this,
			contentRoot = null,
			urlBase = null;
		contentRoot = me.searchForParentRoot();
		if (contentRoot == window.top) {
			me.Suspend();
			contentRoot.window.close();
		} else {
			me.Suspend();
			if (contentRoot != null) {
				var urlParts = contentRoot.location.href.split("/");
				delete urlParts[urlParts.length - 1];
				urlBase = urlParts.join("/");
				contentRoot.scormdriver_content.location.href = urlBase + EXIT_TARGET;
			}
		}
		return true;
	},

	RecordInteraction: function(id, type, learner_response, correct, correct_responses, description, weighting, latency, objectives, time, alternateResponse, alternateCorrectResponse) {
		var me = this,
			result;

		var interactionCount = me.GetValue('cmi.interactions._count');
		if (!interactionCount) {
			interactionCount = 0;
		}

		result = me.SetValue("cmi.interactions." + interactionCount + ".id", id);
		result = me.SetValue("cmi.interactions." + interactionCount + ".type", type) && result;

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
		// description
		result = me._recordInteractionDescription(interactionCount, description) && result;
		//time
		result = me.SetValue("cmi.interactions." + interactionCount + "." + me._timestamp, me._formatTime(time)) && result;

		// responses
		result = me._recordInteractionCorrectResponse(interactionCount, correct_responses, alternateCorrectResponse) && result;
		result = me._recordInteractionResponse(interactionCount, learner_response, alternateResponse) && result;

		return result;
	},

	RecordTrueFalseInteraction: function(id, learner_response, correct, correct_responses, description, weighting, latency, objectives, time) {
		var me = this,
			responseString = '',
			correctResponseString = null;

		if (learner_response) {
			responseString = me._t;
		} else {
			responseString = me._f;
		}
		if (correct_responses == true) {
			correctResponseString = me._t;
		} else if (correct_responses == false) {
			correctResponseString = me._f;
		}

		return me.RecordInteraction(id, 'true-false', responseString, correct, correctResponseString, description, weighting, latency, objectives, time, responseString, correctResponseString);
	},

	RecordMultipleChoiceInteraction: function(id, learner_response, correct, correct_responses, description, weighting, latency, objectives, time) {
		var me = this;
		var responseString = learner_response.map(function(response) {
			return response.Long;
		}).join(',');
		var correctResponseString = correct_responses.map(function(response) {
			return response.Long;
		}).join(',');

		var altResponseString = learner_response.map(function(response) {
			return response.Short;
		}).join(',');
		var alternateCorrectResponse = correct_responses.map(function(response) {
			return response.Short;
		}).join(',');

		return me.RecordInteraction(id, 'choice', responseString, correct, correctResponseString, description, weighting, latency, objectives, time, altResponseString, alternateCorrectResponse);
	},

	RecordFillInInteraction: function(id, learner_response, correct, correct_responses, description, weighting, latency, objectives, time) {
		var me = this;
		var interactionType;
		if (correct_responses == null) {
			correct_responses = "";
		}
		correct_responses = new String(correct_responses);
		if (correct_responses.length > 250 || learner_response.length > 250) {
			interactionType = 'long-fill-in';
		} else {
			interactionType = 'fill-in';
		}
		if (correct_responses.length > 4000) {
			correct_responses = correct_responses.substr(0, 4000);
		}

		return me.RecordInteraction(id, interactionType, learner_response, correct, correct_responses, description, weighting, latency, objectives, time, learner_response, correct_responses);
	},

	CreateResponseIdentifier: function(Short, Long) {
		return {
			"Short": Short,
			"Long": Long
		};
	},

	Suspend: function() {
		return this._finish('SUSPEND');
	},

	_finish: function(exitType) {
		var me = this;
		if (me.isLoaded && !me.isCalledFinish) {
			me.isCalledFinish = true;
			if (me.isReachedEnd && (!EXIT_SUSPEND_IF_COMPLETED)) {
				exitType = 'FINISH';
			}
			/*
			// Not supported yet...
			if (me.GetStatus() == 'passed' && EXIT_NORMAL_IF_PASSED == true) {
				exitType = 'FINISH';
			}
			// TODO:
			if (!me.isOverrodeTime) {
				dtmEnd = new Date();
				AccumulateTime();
				me.SaveTime(intAccumulatedMS);
			}
			*/
			me.isLoaded = false;
		}
		return true;
	},

	Exit: function() {
		return this.Suspend();
	},


	//
	// 
	getAPI: function() {
		var me = this,
			API = me._api;

		if ( !! API) {
			return API;
		}

		if (!API && !! window.parent && window.parent != window) {
			API = me.searchUp(window.parent);
		}
		if (!API && !! window.top.opener) {
			API = me.searchUp(window.top.opener);
		}

		if (!API) {
			API = me.searchForAPI(window);
		}

		if (!API) {
			console.error("Couldn't find API");
		}
		me._api = API;

		return API;
	},

	searchUp: function(win) {
		var me = this,
			counter = 0;
		while ((win[me._apiName] == null || win[me._apiName] == undefined) && (win.parent != null) && (win.parent != win) && (counter <= 500)) {
			counter++;
			win = win.parent;
		}
		return win[me._apiName];
	},

	searchForAPI: function(win) {
		var me = this,
			API = null;
		API = win[me._apiName];
		if ( !! API) {
			return API;
		}
		if ( !! win.parent && win.parent != win) {
			API = me.searchForAPI(win.parent);
			if ( !! API) {
				return API;
			}
		}
		if ( !! win.opener && win.opener != win) {
			API = me.searchForAPI(win.opener);
			if ( !! API) {
				return API;
			}
		}
		API = me.searchDown(win);
		if ( !! API) {
			return API;
		}
		return null;
	},

	searchDown: function(node) {
		var me = this,
			API = null;
		for (var i = node.frames.length - 1; i >= 0; i--) {
			API = node.frames[i][me._apiName];
			if ( !! API) {
				return API;
			}
			API = me.searchDown(wnd.frames[i]);
			if ( !! API) {
				return API;
			}
		};
		return API;
	},
	searchForParentRoot: function() {
		var contentRoot = null;
		var wnd = window;
		var i = 0;
		if (wnd.scormdriver_content) {
			contentRoot = wnd;
			return contentRoot;
		}
		while (contentRoot == null && wnd != window.top && (i++ < 100)) {
			if (wnd.scormdriver_content) {
				contentRoot = wnd;
				return contentRoot;
			} else {
				wnd = wnd.parent;
			}
		}
		return null;
	},
	ErrorHandler: function() {
		var error = {
			"code": "0",
			"string": "No Error",
			"diagnostic": "No Error"
		};
		var me = this,
			api = me.getAPI();
		if (api == null) {
			message("Unable to locate the LMS's API Implementation.\nCannot determine LMS error code.");
			error.code = _GeneralException.code;
			error.string = _GeneralException.string;
			error.diagnostic = "Unable to locate the LMS's API Implementation. Cannot determine LMS error code.";
			return error;
		}

		// check for errors caused by or from the LMS
		error.code = api[me._GetLastErrorFn]().toString();
		if (error.code != '0') {
			// an error was encountered so display the error description
			error.string = api[me._GetErrorStringFn](error.code);
			error.diagnostic = api[me._GetDiagnostic]("");
		}

		return error;
	}
});