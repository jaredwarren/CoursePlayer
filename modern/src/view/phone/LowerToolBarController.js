Ext.define('Player.view.phone.LowerToolBarController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.lowertoolbarphone',

    onShowToc: function(button, e, eOpts) {
        Player.app.fireEvent('show-toc');
        Player.app.fireEvent('hide-tools');
    },


    onNextpageTap: function(button, e, eOpts) {
    	
    },


    onPreviousPageBtnTap: function(button, e, eOpts) {
    },

    onNarrationTextBtnTap: function(button, e, eOpts) {
    	
    }

});
