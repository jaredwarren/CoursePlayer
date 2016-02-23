Ext.define('Player.view.main.MainController', {
  extend: 'Player.view.main.BaseMainController',

  alias: 'controller.main',

  control: {
    '#tableOfContents': {
      'beforeselect': 'onBeforeLeafItemSelect',
      'itemclick': 'onLeafItemTap'
    },
    'button[action=previousPage]': {
      'click': 'onPreviousPage'
    },
    'button[action=nextPage]': {
      'click': 'onNextPage'
    },
    'button[action=showHelp]': {
      'click': 'onShowHelp'
    },
    'button[action=showGlossary]': {
      'click': 'onShowGlossary'
    },
    'button[action=shownarration]': {
      'click': 'onShowNarration'
    },
    'button[action=closeNarration]': {
      'click': 'onHideNarration'
    },
    'button[action=close]': {
      'click': 'onClose'
    }
  },

  onLeafItemTap: function(treeview, record, el, index, eOpts) {
    if (record.isLeaf()) {
      this.goToPage(record);
    }
  },
  onShowGlossary: function() {
    var glossaryWindow = this.view.queryById('glossaryWindow');
    glossaryWindow.show();
  },

  onHideGlossary: function() {
    this.view.queryById('glossaryWindow').hide();
  },


  onShowHelp: function(button, e, options) {
    this.lookupReference('helpPanel').show();
  },

  onBeforeLeafItemSelect: function(treeview, record, el, index, eOpts) {
    var me = this;
    if (record.isLeaf()) {
      var restrictedTopicId = record.get('restrictedTopicId'),
        ok = !(restrictedTopicId && restrictedTopicId.length > 0);
      if(ok){
        var pageController = me.lookupReference('mainPages').getController();
        pageController.maskPages(Lang.Loading);
        var toc = me.lookupReference('tableOfContents');
        toc.maskPages(Lang.Loading);
      }
      return ok;
    }
    else{
      return false;
    }
  },
  onPageChange: function(pageCarousel, pageNode, oldValue, eOpts) {
    var me = this,
      toc = me.lookupReference('tableOfContents');
    me.callParent(arguments);
    toc.maskPages(false);

    var pageNarration = pageNode.getNarration(),
      narrationText = '';
    var header = pageNode.getHeader(),
      narrationBtn = header.queryById('narrationBtn');
    if (pageNarration && pageNarration.hasOwnProperty('#text')) {
      narrationText = pageNarration['#text'];
      if (!narrationBtn) {
        header.add({
          xtype: 'button',
          itemId: 'narrationBtn',
          iconCls: 'pictos pictos-chat',
          disabled: false,
          ui: 'default',
          action: 'shownarration'
        });
      } else {
        narrationBtn.show();
      }
    } else {
      if (narrationBtn) {
        narrationBtn.hide();
      }
    }
  },

  initHelp: function() {
    var me = this;
    me.callParent(arguments);
    if (Player.settings) {
      var settings = Player.settings.data,
        helpPanelModel = me.lookupReference('helpPanel').getViewModel();
      helpPanelModel.set({
        showClose: (settings.tracking != 'none' || Player.params.showClose == '1'),
        showGlossary: settings.glossary,
        showNarration: settings.narration
      });
      // show help or not
      if (Player.settings.get('showHelpOnStart') || (Player.params.showHelp && Player.params.showHelp != '0')) {
        me.onShowHelp();
      }
    }
  },

  onLoadSettings: function(settings, operation) {
    var me = this;
    me.callParent(arguments);

    // glossary
    if (!settings.data.glossary) {
      me.getView().down('button[action=showGlossary]').hide();
    }
  }
});