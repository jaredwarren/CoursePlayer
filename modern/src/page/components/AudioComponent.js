Ext.define('Player.page.components.AudioComponent', {
	extend: 'Ext.Audio',
	xtype: 'audiocomponent',
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
		"waiting"
	],

	initialize: function() {
		var me = this,
			audioDom = me.media.dom;
		me.callParent(arguments);
		me.audio = audioDom;
		me.supported = (audioDom && audioDom.tagName.toLowerCase() == 'audio');
		if (me.supported) {
			Ext.Array.each(me._mediaEvents, function(name, index, mediaEvents) {
				//console.info("->", name);
				audioDom.addEventListener(name, function(e) {
					//console.info("<=", name);
					me.fireEvent(e.type, e);
					//me.fireEvent('anyevent', e.type, e);
				}, true);
			});
		}
	}
});