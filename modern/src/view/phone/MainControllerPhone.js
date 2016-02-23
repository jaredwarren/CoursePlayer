Ext.define('Player.view.phone.MainControllerPhone', {
  extend: 'Player.view.main.MainController',

  alias: 'controller.phonemain',

  config: {
    control: {
      'button[action=showGlossary]': {
        'tap': 'onShowGlossary'
      },
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
    },
    controller: {
      '*': {
        'hide-tools': 'hideTools'
      }
    }
  },

  onItemSelected: function(sender, record) {
    Ext.Msg.confirm('Confirm', 'Are you sure?', 'onConfirm', this);
  },

  onHideToc: function() {
    this.lookupReference('contentPanel').setScreen('main');
    return this.callParent(arguments);
  },


  onShowGlossary: function(button, e, options) {
    this.hideTools();
    return this.callParent(arguments);
  },

  onShowHelp: function(button, e, options) {
    console.log("MainController::onShowHelp");
    var me = this,
      help = me._help;

    if (!help) {
      me.initHelp();
      help = me._help;
    }
    if (help.isVisible()) {
      help.hide();
    } else {
      help.setModal(true);
      help.setHideOnMaskTap(true);
      help.setCentered(true);
      help.show();
    }
  },

  onPageTap: function(sender, event, target, eOpts) {
    var me = this,
      tempTarget,
      toggleReg = /(x-button)|(x-video)|(x-field)|(x-list-item)|(x-dataview-item)|(audio-view)|(list-item)/i,
      toggleTools = true;
    if (!Ext.getCmp('upperToolBar').isHidden()) {
      me.hideTools();
      return;
    }
    if (event && event.target) {
      tempTarget = event.target;
      while (tempTarget) {
        if (tempTarget.localName == 'a') {
          event.target.onclick = function onclick(event) {
            return false;
          };
          //debugger;
          me.goToLink(decodeURIComponent(tempTarget.href));
          return;
        } else if (tempTarget.localName == 'video') {
          toggleTools = false;
          break;
        } else if (tempTarget.className && tempTarget.className.search(toggleReg) >= 0) {
          toggleTools = false;
          break;
        } else {
          tempTarget = tempTarget.parentNode;
        }
      }
    }

    if (toggleTools) {
      me.showTools();
    }
  },
  hideTools: function() {
    Player.app.fireEvent('showVideo');
    Ext.getCmp('upperToolBar').hide();
    Ext.getCmp('lowerToolBar').hide();
    Ext.getCmp('pageInfo').hide();
  },
  showTools: function() {
    Player.app.fireEvent('hideVideo');
    Ext.getCmp('upperToolBar').show();
    Ext.getCmp('lowerToolBar').show();
    Ext.getCmp('pageInfo').show();
  },


  helppanelclass: 'Player.view.main.HelpPanelPhone',
  
  
  onLoadSettings: function(settings, operation) {
    var me = this,
      st = Ext.getStore("ScoTreeStore"),
      contentPanel = me.lookupReference('contentPanel');
    me.callParent(arguments);

    // Show TOC first
    if (Player.settings.get('showTocFirst')) {
      contentPanel.setScreen('toc');
    } else {
      me.showTools();
    }

    var totalPageNumber = st.getTotalCount();
    me.lookupReference('pageInfo').getViewModel().set({
      totalPageNumber: totalPageNumber
    });
  },
  onPageChange: function(pageCarousel, value, oldValue, eOpts) {
    this.callParent(arguments);
    var st = Ext.getStore("ScoTreeStore"),
      pageNode = st.findRecordByType('id', value.getRecordId()),
      pageInfoData = {};
    // Update page Numbering
    if (!pageNode.raw.nonNavPage) {
      pageInfoData.pageNumber = parseInt(pageNode.get('pageNum'), 10) + 1;
    }
    // update title
    pageInfoData.pageTitle = pageNode.data.title;
    this.lookupReference('pageInfo').getViewModel().set(pageInfoData);
  }
});