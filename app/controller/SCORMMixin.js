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

	isFinished: false,
	isCalledFinish: false,
	isReachedEnd: false,
	isOverrodeTime: false,
	isStatusSet: false,

	_startTime: null,


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
		var result = api[me._initialize]("");
		if (result.toString() != "true") {
			var err = me.ErrorHandler();
			console.error("Initialize failed with error code: " + err.code);
			return false;
		}
		me._initialized = true;
		me._startTime = new Date();
		return true;
	},

	GetValue: function(key) {
		var me = this,
			api = me.getAPI(),
			result = "",
			error;
		if (api == null) {
			console.error("Unable to locate the LMS's API Implementation.\nGetValue was not successful.");
		} else if (!me._initialized && !me.Initialize({
			completion: "completed"
		})) {
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
		console.info("GET:", key, " <- ", result.toString());
		return result.toString();
	},

	SetValue: function(key, value) {
		console.info("SET:", key, " -> ", value);
		var me = this,
			api = me.getAPI(),
			result = "false",
			error;
		if (api == null) {
			console.error("Unable to locate the LMS's API Implementation.\nSetValue was not successful.");
		} else if (!me._initialized && !me.Initialize({
			completion: "completed"
		})) {
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
		return me.GetValue(me._bookmark);
	},

	SetBookmark: function(bookmark) {
		var me = this;
		me.SetValue(me._bookmark, bookmark);
	},

	GetDataChunk: function() {
		var me = this;
		return me.GetValue(me._datachunk);
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
		me.isStatusSet = true;
		return result;
	},

	SetFailed: function() {
		var me = this,
			result;
		result = me.SetValue(me._lesson_status, 'failed');
		me.isStatusSet = true;
		return result;
	},

	ResetStatus: function() {
		var me = this;
		me.isStatusSet = false;
		return me.SetValue(me._lesson_status, "incomplete");
	},

	GetLessonMode: function() {
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

	SetReachedEnd: function() {
		var me = this;
		if (me.isStatusSet) {
			me.SetCompleted();
		}
		me.isReachedEnd = true;
	},

	Commit: function() {
		var me = this;
		var result = this._api[me._CommitFn]("").toString();
		return result == 'true';
	},

	ConcedeControl: function() {
		console.log("ConcedeControl::");
		var me = this,
			contentRoot = null,
			urlBase = null;
		contentRoot = me.searchForParentRoot();
		me.Suspend();
		if (contentRoot == window.top) {
			console.log("contentRoot == window.top");
			contentRoot.window.close();
		} else {
			if (contentRoot != null) {
				console.log("contentRoot != null");
				var urlParts = contentRoot.location.href.split("/");
				delete urlParts[urlParts.length - 1];
				urlBase = urlParts.join("/");
				contentRoot.scormdriver_content.location.href = urlBase + EXIT_TARGET;
			} else {
				console.log("force close");
				window.top.close();
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
			result = me.SetValue("cmi.interactions." + interactionCount + ".objectives.0.id", objectives) && result;
		}
		// latency
		if (latency != undefined && latency != null && latency != "") {
			result = me.SetValue("cmi.interactions." + interactionCount + ".latency", me.convertLatency(latency)) && result;
		}
		// description
		result = me._recordInteractionDescription(interactionCount, description) && result;
		//time
		result = me.SetValue("cmi.interactions." + interactionCount + "." + me._timestamp, me.convertTimestamp(time)) && result;

		// responses
		result = me._recordInteractionCorrectResponse(interactionCount, correct_responses, alternateCorrectResponse) && result;
		result = me._recordInteractionResponse(interactionCount, learner_response, alternateResponse) && result;

		return result;
	},

	RecordTrueFalseInteraction: function(id, learner_response, correct, correct_responses, description, weighting, latency, objectives, time) {
		var me = this,
			responseString = '',
			correctResponseString = null
			learnerResponse = learner_response[0];

		if (learnerResponse && learnerResponse.Long.toLowerCase() == me._t) {
			responseString = me._t;
		} else if (learnerResponse && learnerResponse.Long.toLowerCase() == me._f) {
			responseString = me._f;
		} else {
			responseString = '';
		}
		if (correct_responses[0].Long.toLowerCase() == me._t) {
			correctResponseString = me._t;
		} else if (correct_responses[0].Long.toLowerCase() == me._f) {
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
		correctResponseString = correct_responses.join(',');
		if (correctResponseString.length > 250 || learner_response.length > 250) {
			interactionType = 'long-fill-in';
		} else {
			interactionType = 'fill-in';
		}
		if (correctResponseString.length > 4000) {
			correctResponseString = correctResponseString.substr(0, 4000);
		}

		return me.RecordInteraction(id, "fill-in", learner_response, correct, correctResponseString, description, weighting, latency, objectives, time, learner_response, correctResponseString);
	},

	CreateResponseIdentifier: function(Short, Long) {
		return {
			"Short": Short,
			"Long": Long
		};
	},

	Suspend: function() {
		return this.execFinish('suspend');
	},


	_finish: function(exitType) {
		var me = this,
			intAccumulatedMS = 0,
			end;
		end = new Date();
		intAccumulatedMS = (end.getTime() - me._startTime.getTime());
		me._startTime = null;
		me.SetValue(me._session_time, me.convertLatency(intAccumulatedMS));
	},

	execFinish: function(exitType) {
		var me = this;
		if (me._initialized && !me.isCalledFinish) {
			me.isCalledFinish = true;
			if (me.isReachedEnd) { // default: EXIT_SUSPEND_IF_COMPLETED = false;
				exitType = '';
			}
			var result = me._finish(exitType, me.isStatusSet)
			me._initialized = false;
			return result;
		}
		return true;
	},

	IsLoaded: function() {
		return this._initialized;
	},

	IsLmsPresent: function() {
		return this._initialized;
	},

	Exit: function() {
		return this.ConcedeControl();
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

	searchForParentRoot: function() {
		var contentRoot = null,
			win = window,
			i = 0;
		if (win.scormdriver_content) {
			contentRoot = win;
			return contentRoot;
		}
		while (contentRoot == null && win != window.top && (i++ < 100)) {
			if (win.scormdriver_content) {
				contentRoot = win;
				return contentRoot;
			} else {
				win = win.parent;
			}
		}
		return null;
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
			API = me.searchDown(node.frames[i]);
			if ( !! API) {
				return API;
			}
		};
		return API;
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
	},
	_zeroPad: function(intNum, intNumDigits) {
		var strTemp,
			intLen,
			decimalToPad,
			i,
			isNeg = false;
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
	}
});