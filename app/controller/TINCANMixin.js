Ext.define('Player.controller.TINCANMixin', {
	extend: 'Player.controller.LMSMixin',
	// generic vars
	_apiName: '',
	_bookmark: '',
	// protected vars
	_api: null,

	// general api functions
	Initialize: function() {
		var me = this,
			api;
		api = me.getAPI();
		if (!api) {
			console.error("No API");
			return false;
		}

		// do init stuff
		var result = api.Initialize("");
		if (result.toString() != "true") {
			console.error("Initialize failed");
			return false;
		}
	},

	GetBookmark: function() {
		var me = this;
		me._api.GetValue(me._bookmark);
	},

	SetBookmark: function(bookmark) {
		var me = this;
		me._api.SetValue(me._bookmark, bookmark);
	},

	Exit: function() {
		var me = this;
		// TODO: same as scorm.concedeControl
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
	}
});