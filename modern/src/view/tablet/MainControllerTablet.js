Ext.define('Player.view.tablet.MainControllerTablet', {
  extend: 'Player.view.main.MainController',

  alias: 'controller.tabletmain',

  config: {
    control: {
      'button[action=hideToc]': {
        'tap': 'onHideToc'
      }
    }
  },

  listen: {
    component: {
      '#mainPages': {
        'page-tap': 'onPageTap'
      }
    }
  },
  helppanelclass: 'Player.view.main.HelpPanelTablet',

  onNestedlistLeafItemTap: function(nestedlist, list, index, target, record, e, options) {
    this.onHideToc();
    return this.callParent(arguments);
  },

  onShowToc: function(button, e, eOpts) {
    this.view.getComponent('dockedToc').show();
  },

  onHideToc: function(button, e, eOpts) {
    var dockedToc = this.lookupReference('dockedToc');;
    if (dockedToc.getDockPosition() != 'floating') {
      return;
    }
    dockedToc.hide();
    return this.callParent(arguments);
  },

  onPageTap: function(e, b) {
    var me = this,
      dockedToc = this.view.getComponent('dockedToc');

    if (dockedToc.getDockPosition() != 'floating') {
      return;
    }
    if (!dockedToc.isHidden()) {
      me.onHideToc();
      return;
    }
  }
});