Ext.define('Player.page.components.VideoComponent', {
	extend: 'Ext.Video',
	xtype: 'videocomponent',
	_mediaEvents: [
		"abort",
		"canplay",
		"canplaythrough",
		"cuechange",
		"durationchange",
		"emptied",
		"empty",
		"ended",
		"error",
		"loadeddata",
		"loadedmetadata",
		"loadstart",
		"pause",
		"play",
		"playing",
		"progress",
		"ratechange",
		"seeked",
		"seeking",
		"stalled",
		"suspend",
		"timeupdate",
		"volumechange",
		"waiting",
		// Full Screen Events
		"fullscreenchange",
		"webkitfullscreenchange",
		"mozfullscreenchange",
		"MSFullscreenChange",
		// unofficial events
		"canshowcurrentframe",
		"dataunavailable",
		"mozaudioavailable"
	],

	initialize: function() {
		var me = this,
			videoDom = me.media.dom;
		me.callParent(arguments);
		me.video = videoDom;
		me.supported = (videoDom && videoDom.tagName.toLowerCase() == 'video');
		if (me.supported) {
			Ext.Array.each(me._mediaEvents, function(name, index, mediaEvents) {
				videoDom.addEventListener(name, function(e) {
					me.fireEvent(e.type, e);
				}, true);
			});
		}
	}
});