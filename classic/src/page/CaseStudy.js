Ext.define('Player.page.CaseStudy', {
  extend: 'Player.page.Page',
  xtype: 'CaseStudy',


  requires: [
    'Player.page.components.TextImage',
    'Player.view.main.AudioBar',
    'Player.view.main.InstructionsPopup'
  ],

  config: {
    popInstruct: {
      titleInst: 'Instructions',
      startBTNTitle: 'Start'
    },
    feedback: {
      feedbackTitle: 'Feedback',
      startBTNTitle: 'Start'
    },
    btn: {
      submit_btn: 'Check Answer',
      continue_btn: 'Continue'
    },
    nextPageLink: ''
  },

  constructor: function(cfg) {
    var me = this,
      items = cfg.items || [];
    cfg = cfg || {};

    items.unshift({
      xtype: 'textimage',
      cls: 'page-content',
      itemId: 'textImage',
      width: '100%',
      flex: 1,
      pText: cfg.instruction,
      imageFile: cfg.image1.path,
      iconType: 'zoom',
      imgPos: cfg.image1.position,
      imageWidth: 40
    }, {
      xtype: 'form',
      height: 200,
      width: '100%',
      layout: {
        type: 'vbox',
        pack: 'center',
        align: 'center'
      },
      items: [{
        xtype: 'textareafield',
        itemId: 'inputField',
        height: 145,
        width: '75%',
        listeners: {
          change: me.onChange,
          scope: me
        }
      }, {
        xtype: 'container',
        width: '75%',
        padding: '4 6 6 4',
        layout: {
          type: 'hbox',
          pack: 'end'
        },
        items: [{
          xtype: 'button',
          itemId: 'checkAnswer',
          iconCls: 'pictos pictos-check',
          text: me.getConfigValue(cfg, 'btn.submit_btn'),
          cls: 'checkanswer',
          disabled: true,
          listeners: {
            click: me.onCheckAnswer,
            scope: me
          }
        }]
      }]
    }, {
      xtype: 'container',
      flex: 1
    });

    if ( !! cfg.image1.audio) {
      items.push({
        xtype: 'audiobar',
        itemId: 'mainaudiobar',
        region: 'south',
        docked: 'bottom',
        width: '100%',
        margin: '0 0 10 0',
        mediaPath: cfg.image1.audio,
        autoPlayMedia: true
      });
    }

    items.push({
      xtype: 'instructionspopup',
      itemId: 'instructionspopup',
      title: me.getConfigValue(cfg, 'popInstruct.titleInst'),
      pText: cfg.popInstruct,
      mediaPath: cfg.audioPath,
      startButtonText: me.getConfigValue(cfg, 'popInstruct.startBTNTitle'),
      autoPlayMedia: true,
      listeners: {
        'start-activity': me.onShowInstructionsContinue,
        scope: me
      }
    });

    var nextPageLink = me.getConfigValue(cfg, 'configuration.link');
    items.push({
      xtype: 'instructionspopup',
      itemId: 'feedbackpopup',
      title: me.getConfigValue(cfg, 'feedback.feedbackTitle'),
      pText: cfg.feedback,
      startButtonText: me.getConfigValue(cfg, 'btn.continue_btn'),
      mediaPath: cfg.image2.audio,
      imageFile: cfg.image2.path,
      imgPos: cfg.image2.position,
      hideActionButton: Ext.isEmpty(nextPageLink),
      closable: !Ext.isEmpty(nextPageLink),
      autoPlayMedia: true,
      listeners: {
        'start-activity': me.onFeedbackContinue,
        scope: me
      }
    });

    me.callParent([Ext.apply({
      nextPageLink: nextPageLink,
      items: [{
        xtype: 'panel',
        region: 'center',
        anchor: "100% 100%",
        layout: 'vbox',
        items: items
      }]
    }, cfg)]);
  },


  onChange: function(textarea, newValue, oldValue, eOpts) {
    var me = this,
      checkAnswer = me.queryById('checkAnswer');
    if (Ext.isEmpty(newValue)) {
      checkAnswer.disable();
    } else {
      checkAnswer.enable();
    }
  },


  onCheckAnswer: function() {
    var me = this;
    // show feedback
    me.onShowFeedBack();
  },

  onShowFeedBack: function() {
    var me = this;
    me.queryById('feedbackpopup').show();
  },

  onFeedbackContinue: function() {
    var me = this,
      link = me.getNextPageLink();
    if (!Ext.isEmpty(link)) {
      me.fireEvent('link-tap', me, 'asfunction:goToPage,' + link);
    }
  },

  onShowInstructions: function() {
    var me = this;
    me.queryById('instructionspopup').show();
  },

  onShowInstructionsContinue: function(){
    var me = this;
    var audio = me.queryById('mainaudiobar');
    if (audio) {
      audio.start(true);
    }
  },

  start: function() {
    var me = this;
    me.callParent(arguments);

    me.onShowInstructions();
  },
  close: function() {
    var me = this;
    return;
  }
});