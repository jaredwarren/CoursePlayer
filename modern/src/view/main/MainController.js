Ext.define('Player.view.main.MainController', {
  extend: 'Player.view.main.BaseMainController',

  alias: 'controller.main',

  control: {
    '#mainPages': {
      'beforeactiveitemchange': 'onBeforePageChange'
    },
    '#tableOfContents': {
      'leafitemtap': 'onNestedlistLeafItemTap'
    },
    'glossary': {
      'leafitemtap': 'onGlossaryLeafItemTap'
    },
    'button[action=previousPage]': {
      'tap': 'onPreviousPage'
    },
    'button[action=nextPage]': {
      'tap': 'onNextPage'
    },
    'button[action=showHelp]': {
      'tap': 'onShowHelp'
    },
    'button[action=showGlossary]': {
      'tap': 'onShowGlossary'
    },
    'button[action=shownarration]': {
      'tap': 'onShowNarration'
    },
    'button[action=closeNarration]': {
      'tap': 'onHideNarration'
    },
    'button[action=close]': {
      'tap': 'onClose'
    }
  },

  onNestedlistLeafItemTap: function(nestedlist, list, index, target, record, e, options) {
    // close glossary term
    this.lookupReference('glossary').getController().closeTerm();

    // set to main screen
    this.lookupReference('contentPanel').setScreen('main');

    // Go to page
    this.goToPage(list.getStore().getAt(index));
  },
  onBeforePageChange: function(pageCarousel, value, oldValue, eOpts) {
    var contentPanel = this.lookupReference('contentPanel');
    // mask while loading pages
    contentPanel.setMasked({
      xtype: "loadmask",
      message: "Loading...",
      cls: 'page-mask'
    });

    // fix weirdness when mask shows but dosn't go away
    setTimeout(function() {
      if (!contentPanel.getMasked().isHidden()) {
        console.warn("WARNING: mask never hidden");
      }
      contentPanel.setMasked(false);
    }, 2000);
  },
  onPageChange: function(pageCarousel, pageNode, oldValue, eOpts) {
    var me = this;
    me.callParent(arguments);
    me.lookupReference('contentPanel').setMasked(false);
  },
  onGlossaryLeafItemTap: function(nestedlist, list, index, target, record, e, options) {
    Ext.Msg.alert(record.get('title'), record.get('definition'));
  },


  initHelp: function() {
    var me = this,
      help = me._help;

    if (!help) {
      me._help = help = Ext.create(me.helppanelclass, {
        modal: false,
        hideOnMaskTap: true,
        centered: true
      });
      Ext.Viewport.add(help);
    }

    if (Player.settings) {
      var settings = Player.settings.data,
        helpPanelModel = help.getViewModel();
      helpPanelModel.set({
        showClose: (settings.tracking != 'none' || Player.params.showClose == '1'),
        showGlossary: settings.glossary,
        showNarration: settings.narration
      });

      // show help or not
      if (Player.settings.get('showHelpOnStart') || (Player.params.showHelp && Player.params.showHelp != '0')) {
        me.onShowHelp(me.view.queryById('helpBtn'));
      }
    }
  },

  onShowHelp: function(button, e, options) {
    var me = this,
      help = me._help,
      buttonBounds = button.el.dom.getBoundingClientRect();

    if (!help) {
      me.initHelp();
      help = me._help;
    }
    if (help.isVisible()) {
      help.hide();
    } else {
      help.setModal(true);
      help.setHideOnMaskTap(true);
      help.setTop(buttonBounds.top);
      help.setRight(buttonBounds.top);
      help.show();
    }
  }
});