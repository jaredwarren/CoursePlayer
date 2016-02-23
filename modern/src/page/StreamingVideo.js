Ext.define('Player.page.StreamingVideo', {
    extend: 'Player.page.Page',

    alias: ['widget.StreamingVideo'],
    requires: [
        'Player.page.components.VideoPlayer'
    ],

    config: {
        layout: {
            type: 'vbox',
            align: 'stretch',
            pack: 'start'
        },
        styleHtmlContent: true,
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        recordId: '',
        items: [{
            xtype: 'panel',
            html: 'Title of the Video',
            itemId: 'pageTitle',
            cls: 'page-title',
            layout: {
                type: 'fit'
            }
        }, {
            xtype: 'videoplayer',
            itemId: 'videoContainer'
        }, {
            xtype: 'panel',
            html: '',
            cls: 'page-content',
            itemId: 'pageText'
        }],
        pageData: {}
    },

    applyPageData: function(config) {
        return config;
    },

    updatePageData: function(newPageData, oldPageData) {
        var me = this,
            pText = '';

        me.initVideo(newPageData);

        // Set Title
        me.getComponent('pageTitle').setHtml(newPageData.title);

        // Set Text
        if (newPageData.pText) {
            pText = newPageData.pText['#text'];
        }
        me.getComponent('pageText').setHtml(pText);

        // Create Note
        if (newPageData.note) {
            var textNote = Ext.create('Player.view.Note', {
                noteText: newPageData.note['#text'],
                nType: newPageData.nType
            });
            me.add(textNote);
        }

        ApplyMathJax(me.element.dom);
    },

    initVideo: function(newPageData) {
        var me = this,
            vc = me.getComponent('videoContainer');

        if (newPageData.videoPath) {
            me.videoUrl = newPageData.videoPath;
        } else if (newPageData.mediaPath) {
            me.videoUrl = newPageData.mediaPath;
        } else {
            me.videoUrl = '';
        }

        if (me.videoUrl.match(/rtmp:\/\//)) {
            var matches = me.videoUrl.match(/rtmp:\/\/(.+\.influxis\.com\/).+:(.+)/);
            if (matches && matches.length > 2) {
                me.videoUrl = 'http://' + matches[1] + 'hls-vod' + matches[2] + '.m3u8';
            }
            var matches = me.videoUrl.match(/rtmp:\/\/(draco\.streamingwizard\.com\/).+:(.+)/);
            if (matches && matches.length > 2) {
                //http://draco.streamingwizard.com/wizard/_definst_/mp4:demo/sample.mp4/playlist.m3u8
                me.videoUrl = 'http://' + matches[1] + 'wizard/_definst_/mp4:' + matches[2] + '/playlist.m3u8';
            }
        }
        me.videoUrl = encodeURI(me.videoUrl);

        vc.setSrc(me.videoUrl);
        vc.on('complete', me.onVideoComplete, me);

        // Override video width and height
        var vcc = vc.getComponent('videoContainer');
        if (newPageData.mediaSize == 'Custom') {
            if (newPageData.videoWidth && newPageData.videoHeight) {
                vcc.setWidth(newPageData.videoWidth);
                vcc.setHeight(newPageData.videoHeight);
            }
        } else if (newPageData.mediaSize) {
            var sizeParts = newPageData.mediaSize.match(/([0-9]+?)x([0-9]+)/);
            if (sizeParts && sizeParts.length >= 3) {
                vcc.setWidth(sizeParts[1]);
                vcc.setHeight(sizeParts[2]);
            }
        }

        me.videoIsInited = true;
    },
    onVideoComplete: function(e) {
        this.fireEvent('page-complete');
    },
    hideVideo: function(e) {
        this.getComponent('videoContainer').hideVideo();
    },
    showVideo: function(e) {
        this.getComponent('videoContainer').showVideo();
    },
    start: function() {
        var me = this,
            vc = me.getComponent('videoContainer');
        me.callParent(arguments);
        vc.showVideo();
        if (!me.videoIsInited) {
            me.initVideo(me.getPageData());
        }
        vc.start();
    },
    close: function() {
        var me = this,
            vc = me.getComponent('videoContainer');
        vc.hideVideo();
        me.videoIsInited = false;
    },

    initialize: function() {
        this.callParent(arguments);
        this.videoIsInited = false;
    }
});