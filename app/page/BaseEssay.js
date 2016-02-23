Ext.define('Player.page.BaseEssay', {
  extend: 'Player.page.Page',

  requires: [
    'Player.page.components.TextImage'
  ],

  config: {
    pText: undefined,
    imageFile: undefined,
    imgPos: 'left',
    imageWidth: '40',
    captiontext: undefined,
    captionhead: undefined,
    imageURL: undefined,
    mediaPath: undefined,
    autoPlayMedia: false
  },

  constructor: function(cfg) {
    var me = this,
      items = cfg.items || [];
    cfg = cfg || {};

    var iconType = (!cfg.imageURL) ? 'zoom' : 'link';

    items.unshift({
      xtype: 'container',
      region: 'center',
      cls: 'page-content',
      layout: {
        type: 'vbox',
        align: 'center'
      },
      items: [{
        xtype: 'textimage',
        width: '100%',
        itemId: 'textImage',
        pText: cfg.pText,
        imageFile: cfg.imageFile,
        iconType: cfg.iconType || iconType,
        imgPos: cfg.imgPos,
        captionhead: cfg.captionhead,
        captiontext: cfg.captiontext,
        imageURL: cfg.imageURL,
        imageWidth: cfg.imageWidth
      }, {
        xtype: Ext.form.Panel.xtype, // because modern -> xtype:'formpanel' classic -> xtype: 'form'
        itemId: 'inputBox',
        width: '75%',
        scrollable: false,
        items: [{
          xtype: 'textareafield',
          itemId: 'inputField',
          enableKeyEvents: true,
          width: '100%',
          placeHolder: Lang.essay.Type_in_your_answer_here,
          emptyText: Lang.essay.Type_in_your_answer_here,
          height: 145,
          listeners: {
            keyup: me.enableCheckBtn,
            scope: me
          }
        }, {
          xtype: 'container',
          width: '100%',
          layout: {
            pack: 'end',
            type: 'hbox'
          },
          items: [{
            margin: '6 0 0 0',
            xtype: 'button',
            itemId: 'checkAnswer',
            text: Lang.essay.SUBMIT,
            cls: 'checkanswer',
            disabled: true,
            scope: me,
            handler: me.onCheckAnswer
          }]
        }]
      }, {
        xtype: 'container',
        itemId: 'responseBox',
        height: 200,
        width: '75%',
        html: cfg.narration['#text'],
        hidden: true,
        styleHtmlContent: true,
        scrollable: {
          direction: 'vertical',
          directionLock: true
        },
        layout: {
          type: 'fit'
        }
      }]
    })

    if ( !! cfg.mediaPath) {
      items.push({
        xtype: 'audiobar',
        itemId: 'audio',
        region: 'south',
        docked: 'bottom',
        width: '100%',
        mediaPath: cfg.mediaPath,
        autoPlayMedia: cfg.autoPlayMedia,
        listeners: {
          'audio-ended': me.onAudioEnded,
          scope: me
        }
      });
    }

    me.callParent([Ext.apply({
      items: items
    }, cfg)]);
  },


  enableCheckBtn: function(e) {
    this.query('#checkAnswer')[0].enable();
  },

  start: function() {
    var me = this;
    var audio = me.queryById('audio');
    if (audio) {
      audio.start(me.getAutoPlayMedia());
    } else {
      // don't call parent aka fire page-complete if audio
      me.callParent(arguments);
    }
    me.queryById('inputField').enable();
    me.queryById('checkAnswer').enable();
    me.queryById('inputField').setValue('');
    me.queryById('responseBox').hide();
  },

  onCheckAnswer: function(e) {
    var me = this;
    me.queryById('responseBox').show();
    me.queryById('inputField').disable();
    me.queryById('checkAnswer').disable();

    me.fireEvent('page-complete', me);
  }
});