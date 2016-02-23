/**
 *   DEPRECATED!!! Use TextPage.js instead
 */
Ext.define('Player.page.TextandAudio', {
    extend: 'Player.page.Page',

    alias: ['widget.TextandAudio'],

    config: {
        layout: 'vbox',
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
            xtype: 'panel',
            html: '',
            cls: 'page-content',
            itemId: 'pageText'
        }, {
            xtype: 'audiobar',
            itemId: 'audio'
        }],
        pageData: {}
    },

    updatePageData: function(newPageData, oldPageData) {
        var me = this,
            pText = '';

        // Set Title
        me.getComponent('pageTitle').setHtml(newPageData.title);

        // Set Text
        if (newPageData.pText) {
            me.getComponent('pageText').setHtml(newPageData.pText['#text']);
        }

        // Create Audio
        me.getComponent('audio').setMediaPath(newPageData.mediaPath);

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

    start: function() {
        this.callParent(arguments);
    },
    close: function(){
        this.getComponent('audio').pause();
    }
});
