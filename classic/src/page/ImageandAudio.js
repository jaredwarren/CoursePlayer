/**
 *   DEPRECATED!!! Use TextPage.js instead
 */
Ext.define('Player.page.ImageandAudio', {
    extend: 'Player.page.Page',

    alias: ['widget.ImageandAudio'],
    
    requires: ['Player.page.components.TextImage','Player.view.main.AudioBar'],

    //mixins: ['Player.page.components.ImagePopupMixin'],

    config: {
        layout: 'vbox',
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
            xtype: 'textimage',
            html: '',
            cls: 'page-content',
            itemId: 'pageText'
        }, {
            xtype: 'audiobar',
            itemId: 'audio'
        }],
        pageData: {}
    },

    applyPageData: function(config) {
        return config;
    },

     updatePageData: function(newPageData, oldPageData) {
        var me = this,
            pText = '';

        // Set Title
        me.getComponent('pageTitle').setHtml(newPageData.title);

        // Set Image
        if(newPageData.pText){
            newPageData.pText = false;
        }
        me.getComponent('pageText').setPageData(newPageData);
        me.getComponent('pageText').on('imagetap', me.imageTapHandler, me);

        // Create Audio
        me.getComponent('audio').setMediaPath(newPageData.mediaPath);

        // Impage popup stuff
        me.setImagePopupData(newPageData);

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
    imageTapHandler: function(e) {
        this.showImagePopup();
    },

    start: function() {
        var me = this;
        me.callParent(arguments);

        me.initializePopup();
    },
    close: function() {
        var me = this;
        me.getComponent('audio').pause();
        me.closeImagePopup();
        me.deinitializePopup();
    }
});
