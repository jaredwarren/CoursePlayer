Ext.define('Player.page.components.TextImagePopup', {
    extend: 'Ext.Panel',

    alias: ['widget.textimagepopup'],

    requires: ['Player.page.components.TextImage'],
    //mixins: ['Player.page.components.ImagePopupMixin'],

    config: {
        itemId: 'popupInstructions',
        centered: true,
        modal: true,
        hidden: true,
        width: '90%',
        height: '90%',
        scrollable: 'vertical',
        cls: 'textimage-popup',
        items: [{
            xtype: 'titlebar',
            itemId: 'titleBar',
            docked: 'top',
            title: ''
        }, {
            xtype: 'textimage',
            html: '',
            cls: 'page-content',
            itemId: 'pageText'
        }, {
            xtype: 'container',
            docked: 'bottom',
            itemId: 'bottomBar',
            layout: {
                align: 'center',
                pack: 'center',
                type: 'hbox'
            },
            items: [{
                xtype: 'button',
                text: 'close',
                itemId: 'closeBtn',
                margin: '10 10 10 10',
                ui: 'action'
            }]
        }],
        listeners: [{
            fn: 'onClose',
            event: 'tap',
            delegate: '#closeBtn'
        }],
        pageData: {}
    },

    updatePageData: function(newPageData, oldPageData) {
        if (!newPageData.pType) {
            newPageData.pType = '';
            return;
        }
        var me = this;

        // Impage popup stuff
        me.setImagePopupData(newPageData);

        me.getComponent('pageText').setPageData(newPageData);
        me.getComponent('pageText').on('imagetap', me.imageTapHandler, me);

        ApplyMathJax(me.element.dom);
    },
    imageTapHandler: function(e, f, g) {
        var me = this;
        me.setImagePopupData(me.getPageData());
        me.initializePopup();
        me.showImagePopup();
    },
    repositionZoomImage: function(e, f, g) {
        try {
            var me = this,
                zoomId = 'zoom_' + e.id,
                imId = 'img_' + e.id,
                zoo = document.getElementById(zoomId),
                im = document.getElementById(imId);
            if (im.complete) {
                zoo.setAttribute("style", "left:" + (im.width + im.offsetLeft - zoo.clientWidth) + "px;top:" + (im.height + im.offsetTop - zoo.clientHeight + 1) + "px");
            } else {
                setTimeout(function() {
                    me.repositionZoomImage.call(me, e);
                }, 300);
            }
        } catch (e) {}
    },
    onClose: function() {
        var me = this;
        me.closeImagePopup();
        me.deinitializePopup();
        me.hide();
    },

    initialize: function() {
        var me = this;
        //me.element.on('tap', me.imageTapHandler, me);
        me.on('painted', me.repositionZoomImage, me);
    }


});