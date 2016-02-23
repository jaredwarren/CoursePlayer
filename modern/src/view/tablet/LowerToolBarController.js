Ext.define('Player.view.tablet.LowerToolBarController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.lowertoolbartablet',


    onNextpageTap: function(button, e, eOpts) {
    	
    },


    onPreviousPageBtnTap: function(button, e, eOpts) {
    },

    onNarrationTextBtnTap: function(button, e, eOpts) {
    	
    },

    onGlossaryBtnTap: function(button, e, eOpts) {
        console.info("tapa");
        this.fireViewEvent('show-glossary');
    }

});
