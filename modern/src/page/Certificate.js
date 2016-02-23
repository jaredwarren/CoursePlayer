Ext.define('Player.page.Certificate', {
  extend: 'Player.page.Page',
  xtype: 'Certificate',



  constructor: function(cfg) {
    var me = this,
      items = cfg.items || [];
    cfg = cfg || {};



    me.callParent([Ext.apply({
      region: 'center',
      items: [{
        xtype: 'container',
        layout: 'card',
        activeItem: 0,
        height: '100%',
        items: [{
          xtype: 'container',
          height: '100%',
          layout: {
            type: 'vbox',
            align: 'center',
            pack: 'center'
          },
          style: 'border: 1px solid green',
          items: [{
            xtype: 'container',
            style: 'border: 1px solid red',
            height: 200,
            width: '75%',
            layout: 'vbox',
            items: [{
              html: 'image...'
            }, {
              xtype: 'panel',
              docked: 'bottom',
              style: 'border: 1px solid yellow',
              height: 50,
              width: '100%',
              layout: {
                type: 'hbox',
                align: 'center',
                pack: 'end'
              },
              items: [{
                xtype: 'button',
                iconCls: 'pictos pictos-print',
                text: 'print'
              }]
            }]
          }]
        }]
      }]
    }, cfg)]);
  },



  /*config: {
    layout: 'card',
    styleHtmlContent: true,
    scrollable: {
      direction: 'vertical',
      directionLock: true
    },
    recordId: '',
    items: [{
      xtype: 'panel',
      itemId: 'certificate',
      items: [{
        xtype: 'panel',
        docked: 'bottom',
        itemId: 'actionDock',
        padding: '4 4 4 4',
        hidden: true,
        layout: {
          pack: 'end',
          type: 'hbox'
        },
        items: [{
          xtype: 'button',
          text: 'Print',
          itemId: 'printButton',
          ui: 'action'
        }]
      }]
    }, {
      xtype: 'panel',
      layout: {
        type: 'vbox',
        align: 'center',
        pack: 'center'
      },
      items: []
    }, {
      xtype: 'panel',
      layout: {
        type: 'vbox',
        align: 'center',
        pack: 'center'
      },
      items: [{
        xtype: 'container',
        cls: 'note',
        width: '90%',
        itemId: 'restrictedTitle'
      }, {
        xtype: 'container',
        width: '70%',
        itemId: 'restrictedMessage'
      }]
    }],
    pageData: {}
  },*/

  updatePageData: function(newPageData, oldPageData) {
    return;
    var me = this;

    if (!me.isCourseComplete()) {
      var title = me.query('#restrictedTitle')[0];
      var fontSize = Ext.os.is.Phone ? '18px' : '32px';
      var lineHeight = Ext.os.is.Phone ? '65px' : '142px';
      title.setHtml('<img style="float:left; width: 20%" src="' + g_styleRoot + 'resources/images/warning_icon.png"/>' + '<div style="float: left; line-height: ' + lineHeight + '; font-weight: bold; font-size: ' + fontSize + '">Course Not Complete</div>');
      var message = me.query('#restrictedMessage')[0];
      if (newPageData.completeCourse) {
        message.setHtml(newPageData.completeCourse['#text']);
      } else {
        message.setHtml("You may not view and print this certificate until you completed every page in the course");
      }
      me.setActiveItem(2);
      return;
    }
  },

  isCourseComplete: function() {
    var me = this,
      pageDate = me.getPageData(),
      accessGranted = false;
    if (pageDate.restrictCertificate) {
      switch (pageDate.restrict_type) {
        case 'visit':
          // mark this page complete first!!!!
          //this.fireEvent('page-complete');
          if (Player.settings.get('complete')) {
            accessGranted = true;
          }
          break;
        case 'LMS':
          var quizStore = Ext.getStore('Quizes');
          if (quizStore.data.length > 0 && quizStore.getAt(quizStore.data.length - 1).get('complete')) {
            accessGranted = true;
          }
          break;
        default:
          accessGranted = true;
          break;
      }
    } else {
      accessGranted = true;
    }
    return accessGranted;
  },

  /*promptForName: function() {
    var me = this,
      newPageData = me.getPageData();

    var pt = Ext.Msg.show({
      title: 'Name Required',
      message: 'Before viewing and printing the certificate, please enter your name as it will appear on the certificate.',
      buttons: {
        text: "Continue",
        itemId: "ok",
        ui: "action"
      },
      fn: function(buttonId, value) {
        if (buttonId != 'ok') {
          // show popup again
          this.promptForName();
          return false;
        }
        if (value == '') {
          // show popup again
          this.promptForName();
          return false;
        }
        newPageData.username = value;
        me.createCertificate();
      },
      scope: me,
      multiLine: false,
      value: null,
      prompt: {
        autoCapitalize: true,
        itemId: 'promptInput',
        clearIcon: false,
        placeHolder: 'First-name Last-name'
      }
    });

    var okBtn = pt.query('#ok')[0];
    okBtn.disable();

    pt.query('#promptInput')[0].on('keyup', function(e, f, g) {
      if (e.getValue() != '') {
        okBtn.enable();
      } else {
        okBtn.disable();
      }
    }, me)

  },*/

  createCertificate: function() {
    var me = this,
      certificateCard = me.getComponent('certificate'),
      certificateImagePath = '',
      newPageData = me.getPageData(),
      username = newPageData.username || '&nbsp;';

    if (newPageData.certificate == 'upload') {
      certificateImagePath = newPageData.certificateFileName;
    } else {
      certificateImagePath = g_styleRoot + 'resources/images/certificate/' + newPageData.certificate + '.png';
    }

    Ext.Ajax.request({
      url: g_styleRoot + 'resources/images/certificate/certificate.tpl',
      scope: me,
      success: function(response) {
        var text = response.responseText,
          date = new Date(),
          width = 760,
          height = 580,
          re;

        re = new RegExp("{background}", "i");
        text = text.replace(re, certificateImagePath);

        re = new RegExp("{width}", "ig");
        text = text.replace(re, (width) + 'px');
        re = new RegExp("{height}", "ig");
        text = text.replace(re, (height) + 'px');
        re = new RegExp("{halfwidth}", "ig");
        text = text.replace(re, (width / 2) + 'px');
        re = new RegExp("{halfheight}", "ig");
        text = text.replace(re, (height / 2) + 'px');

        re = new RegExp("{username}", "i");
        text = text.replace(re, username);

        re = new RegExp("{coursetitle}", "i");
        text = text.replace(re, Player.settings.raw.title);

        re = new RegExp("{description}", "i");
        text = text.replace(re, newPageData.courseDescription['#text']);

        re = new RegExp("{date}", "i");
        text = text.replace(re, date.toLocaleDateString());

        if (newPageData.certificate == 'upload' || !newPageData.logoFilePath) {
          re = new RegExp('<!-- logo -->(.|\r|\n)+?<!-- /logo -->', "im", "i");
          text = text.replace(re, '');
        } else {
          re = new RegExp("{logo}", "i");
          text = text.replace(re, newPageData.logoFilePath);
        }

        certificateCard.setHtml(text);
        me.resize();
        me.certificateHtml = text;

        me.query('#actionDock')[0].show();
        me.query('#printButton')[0].on('tap', me.onPrint, me);
        me.setActiveItem(0);
      },
      failure: function(response) {
        console.log("Curses, something terrible happened");
        if (response.status == 404) {
          Ext.Msg.alert("Certificate Error", "Certificate template missing.");
        }
        return;
      }
    });
    ApplyMathJax(me.element.dom);
  },

  onPrint: function() {
    var mywindow = window.open('', 'my div', 'height=580,width=760');
    mywindow.document.write('<link rel="stylesheet" type="text/css" href="resources/css/app.css"/>');
    mywindow.document.write(this.certificateHtml);
    mywindow.print();
    // Defer so logo image will load
    Ext.defer(function() {
      mywindow.close();
    }, 400);
  },

  resize: function() {
    var me = this,
      mp = Ext.getCmp('mainPages'),
      vlpContainer = me.getComponent('certificate'),
      mpWidth = mp.element.dom.clientWidth,
      mpHeight = mp.element.dom.clientHeight,
      bWidth = 1024,
      bHeight = 768,
      scaleX = 1,
      scaleY = 1,
      scale = 1.0;

    scaleX = mpWidth / bWidth;
    scaleY = mpHeight / bHeight;

    vlpContainer.innerHtmlElement.setWidth(bWidth);
    vlpContainer.innerHtmlElement.setHeight(bHeight);

    scale = (scaleX < scaleY) ? scaleX : scaleY;
    if (scale > 1) {
      scale = 1.0;
    }
    vlpContainer.innerHtmlElement.dom.style.setProperty('-webkit-transform', 'scale(' + scale + ')');
    vlpContainer.innerHtmlElement.dom.style.setProperty('-webkit-transform-origin', '0 0');
  },

  start: function() {
    var me = this;
    me.callParent(arguments);
    return;

    if (me.isCourseComplete()) {
      if (newPageData.promptForName) {
        me.promptForName();
        return;
      } else {
        me.createCertificate();
      }
    }
  }
});