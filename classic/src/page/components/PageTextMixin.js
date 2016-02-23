Ext.define('Player.page.components.PageTextMixin', {
  extend: 'Ext.Base',

  mixinConfig: {
    id: 'pagetextmixin'
  },

  config: {
    pText: {}
  },

  updatePText: function(pText) {
    var me = this;
    // Set Text
    if (pText && pText.hasOwnProperty('#text')) {
      var pageText = me.getComponent('pageText');
      if(!!pageText){
        pageText.setHtml(pText['#text']);
        ApplyMathJax(pageText.element.dom);
      }
    }
  }
});