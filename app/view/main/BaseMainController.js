Ext.define('Player.view.main.BaseMainController', {
  extend: 'Ext.app.ViewController',

  requires: [
    'Player.model.ScoSetting'
  ],

  routes: {
    'page/:pageId': {
      action: 'onHashChange'
    }
  },

  listen: {
    store: {
      '#ScoTreeStore': {
        load: 'onScoTreeStoreLoad'
      }
    },
    component: {
      '*': {
        'link-tap': 'onLinkTap'
      },
      'page': {
        'page-complete': 'onPageComplete'
      },
      'quiz': {
        'page-complete': 'onPageComplete',
        'page-change': 'onQuestionchange'
      }
    },
    controller: {
      '*': {
        'show-toc': 'onShowToc',
        'hide-glossary': 'onHideGlossary',
        'page-change': 'onPageChange'
      }
    }
  },

  onHashChange: function(pageId) {
    var me = this;
    if (Ext.getStore("ScoTreeStore").isLoaded()) {
      var st = Ext.getStore("ScoTreeStore"),
        pageRecord = st.findRecordByType('linkID', pageId);
      if (!pageRecord) {
        pageRecord = st.findRecordByType('title', decodeURI(pageId));
        if (!pageRecord) {
          console.error("Page Missing:" + pageId);
          return false;
        }
      }
      me.goToPage(pageRecord);
    }
  },


  onLinkTap: function(sender, link, anchor) {
    console.info("BaseMainController::onLinkTap", link);
    link = link || '';
    var me = this,
      functionArray = link.split(','),
      command = functionArray.shift(),
      argument = functionArray.join(),
      pageNode;

    switch (command) {
      case '':
        // do nothing for empty links
        break;
      case "asfunction:glossary":
        var gt = Ext.getStore('GlossaryTreeStore'),
          record = gt.findRecordByType('title', argument);
        if (record) {
          Ext.Msg.alert(record.get('title'), record.get('definition'));
        } else {
          console.warn("Glossary term missing:", link);
        }
        break;
      case "asfunction:media":
        break;
      case "asfunction:accessFile":
        link = link.substr(22);
        me.showWebPopup(link);
        break;
      case "asfunction:goToPage":
        var st = Ext.getStore("ScoTreeStore"),
          pageRecord = st.findRecordByType('linkID', argument);
        if (!pageRecord) {
          pageRecord = st.findRecordByType('title', argument);
          if (!pageRecord) {
            console.error("Page Missing:" + argument);
            return false;
          }
        }
        me.goToPage(pageRecord);
        break;
      default:
        // for some reason chrome on windows will open double links
        if (Ext.os.is.windows && (Ext.browser.is.Chrome || Ext.browser.is.Edge)) {
          if (anchor && anchor.target == '_blank') {
            break;
          } else {
            me.showWebPopup(link);
          }
        } else {
          me.showWebPopup(link);
        }
        break;
    }
  },

  showWebPopup: function(url) {
    if (!url) {
      console.warn("No Url");
      return false;
    }
    if (Ext.browser.is.Firefox) {
      window.open(url);
      return;
    }

    // Force mobile safari to open in new tab
    var a = document.createElement('a');
    a.setAttribute("href", url);
    a.setAttribute("target", "_blank");

    var dispatch = document.createEvent("HTMLEvents")
    dispatch.initEvent("click", true, true);
    a.dispatchEvent(dispatch);
  },

  goToPage: function(pageNode) {
    this.lookupReference('mainPages').getController().goToPage(pageNode);
  },

  onShowGlossary: function(button, e, options) {
    var me = this,
      content = this.lookupReference('contentPanel');
    if (content.getScreen() != 'glossary') {
      content.setScreen('glossary');
    } else {
      content.setScreen('main');
    }
  },

  onHideGlossary: function(button, e, options) {
    var me = this,
      content = this.lookupReference('contentPanel');
    content.setScreen('main');
  },

  onPreviousPage: function(button, e, options) {
    this.lookupReference('mainPages').getController().onPreviousPage();
  },

  onNextPage: function(button, e, options) {
    this.lookupReference('mainPages').getController().onNextPage();
  },

  onPageComplete: function(page) {
    var me = this,
      view = me.getView(),
      pageCarousel = this.lookupReference('mainPages');

    me.updatePageButtons();
  },

  onQuestionchange: function(sender, value, oldValue, eOpts) {
    var me = this,
      view = me.getView(),
      pageCarousel = this.lookupReference('mainPages');
    if (sender.getNumber_questions()) {
      var pageNum = sender.getPageNumber();
      // Update page Numbering
      me.lookupReference('lowerToolBar').getViewModel().set({
        pageNumber: pageNum
      });
    }
    me.updatePageButtons();
  },


  updatePageButtons: function() {
    var me = this,
      view = me.getView(),
      mainPages = me.lookupReference('mainPages'),
      mainPagesActiveIndex = mainPages.getActiveIndex(),
      currentPage = mainPages.getActiveItem(),
      mpLocked = 'none',
      cpLocked = 'none',
      nextDisabled = false,
      prevDisabled = false;

    if (currentPage && currentPage.hasConfig('locked')) {
      var currentPageActiveIndex = currentPage.getActiveIndex(),
        mode = currentPage.getQuizmode(),
        currentQuestion = currentPage.getActiveItem(),
        qtype = '';
      if (currentQuestion) {
        qtype = currentQuestion.getQtype();
      }
      if (mainPagesActiveIndex <= 0) {
        // mp first
        mpLocked = 'left';
        if (currentPageActiveIndex <= 0) {
          // cp first
          if (!currentPage.getNext()) {
            mpLocked = 'none';
            cpLocked = 'both';
          } else {
            mpLocked = 'right';
            cpLocked = 'left';
          }
          nextDisabled = false;
          prevDisabled = true;
        } else if (currentPageActiveIndex > 0 && currentPage.getNext()) {
          // cp middle
          mpLocked = 'both';
          if (mode == 'test') {
            cpLocked = 'left';
            mpLocked = 'right';
            prevDisabled = true;
          } else {
            cpLocked = 'none';
            prevDisabled = false;
          }
          nextDisabled = false;
        } else {
          // cp last
          mpLocked = 'left';
          if (mode == 'test') {
            if (qtype == 'Review') {
              cpLocked = 'right';
              prevDisabled = false;
            } else {
              mpLocked = 'none';
              cpLocked = 'both';
              prevDisabled = true; //// false
            }
          } else {
            cpLocked = 'right';
            prevDisabled = false;
          }
          nextDisabled = false;
        }
      } else if (mainPagesActiveIndex > 0 && mainPages.getNext()) {
        // mp middle
        mpLocked = 'none';

        if (currentPageActiveIndex <= 0) {
          // cp first
          if (!currentPage.getNext()) {
            mpLocked = 'none';
            cpLocked = 'both';
          } else {
            mpLocked = 'right';
            cpLocked = 'left';
          }
          nextDisabled = false;
          prevDisabled = false;
        } else if (currentPageActiveIndex > 0 && currentPage.getNext()) {
          // cp middle
          mpLocked = 'both';
          if (mode == 'test') {
            cpLocked = 'left';
            mpLocked = 'right';
            prevDisabled = false;
          } else {
            cpLocked = 'none';
            prevDisabled = false;
          }
          nextDisabled = false;
        } else {
          // cp last
          mpLocked = 'left';
          if (mode == 'test') {
            if (qtype == 'Review') {
              cpLocked = 'right';
              prevDisabled = false;
            } else {
              cpLocked = 'both';
              mpLocked = 'none';
              prevDisabled = false;
            }
          } else {
            cpLocked = 'right';
            prevDisabled = false;
          }
          nextDisabled = false;
        }
      } else {
        // mp last
        mpLocked = 'right';
        if (currentPageActiveIndex <= 0) {
          // cp first
          if (!currentPage.getNext()) {
            mpLocked = 'none';
            cpLocked = 'both';
            nextDisabled = true;
          } else {
            mpLocked = 'right';
            cpLocked = 'left';
            nextDisabled = false;
          }
          prevDisabled = false;
        } else if (currentPageActiveIndex > 0 && currentPage.getNext()) {
          // cp middle
          mpLocked = 'both';
          if (mode == 'test') {
            cpLocked = 'left';
            mpLocked = 'right';
            prevDisabled = false;
          } else {
            cpLocked = 'none';
            prevDisabled = false;
          }
          nextDisabled = false;
        } else {
          // cp last
          mpLocked = 'both';
          if (mode == 'test') {
            if (qtype == 'Review') {
              cpLocked = 'right';
              prevDisabled = false;
            } else {
              cpLocked = 'left';
              mpLocked = 'right';
              prevDisabled = false;
            }
          } else {
            cpLocked = 'right';
            prevDisabled = false;
          }
          nextDisabled = true;
        }
      }
      currentPage.setLocked(cpLocked);
    } else {
      if (mainPagesActiveIndex <= 0) {
        // mp first
        mpLocked = 'none';
        prevDisabled = true;
        nextDisabled = false;
      } else if (mainPagesActiveIndex > 0 && mainPages.getNext()) {
        // mp middle
        mpLocked = 'none';
        nextDisabled = false;
        prevDisabled = false;
      } else {
        // mp last
        nextDisabled = true;
        prevDisabled = false;
        mpLocked = 'none';
      }
    }
    mainPages.setLocked(mpLocked);
    //console.log('BaseMainController::updatePageButtons => mp: %c%s%c, cp: %c%s%c, next: %c%s%c, prev: %c%s%c', 'color:#0000FF', mpLocked, 'color:#000000', 'color:#0000FF', cpLocked, 'color:#000000', 'color:#0000FF', !nextDisabled, 'color:#000000', 'color:#0000FF', !prevDisabled, 'color:#000000');
    view.query('button[action=nextPage]')[0].setDisabled(nextDisabled);
    view.query('button[action=previousPage]')[0].setDisabled(prevDisabled);
  },

  onPageChange: function(pageCarousel, pageNode, oldValue, eOpts) {
    var me = this,
      view = me.getView(),
      st = Ext.getStore("ScoTreeStore"),
      pageRecord = st.findRecordByType('id', pageNode.getRecordId());

    me.updatePageButtons();

    // Set Bookmark
    if (Player.settings.get('bookmarking')) {
      SCORM.SetBookmark(encodeURI(pageRecord.get('bookmark')));
    }

    var hash = pageRecord.get('linkID');
    if (hash == "") {
      hash = encodeURI(pageRecord.get('title'))
    }
    me.redirectTo(hash); //window.location.hash = me._currentHash = pageRecord.get('linkID');

    var lowerToolBarData = {};
    // Update Narration
    var pageNarration = pageNode.getNarration(),
      narrationText = '';
    if (pageNarration && pageNarration.hasOwnProperty('#text')) {
      narrationText = pageNarration['#text'];
    }
    me.lookupReference('narration').setHtml(narrationText);
    lowerToolBarData.narrationDisabled = (!narrationText);

    // update tool bars
    if (!pageNode.getNonNavPage()) {
      // Update page Numbering
      lowerToolBarData.pageNumber = parseInt(pageNode.getPageNum(), 10) + 1;

      // Set Topic Title bar
      var uppertoolBarModel = me.lookupReference('upperToolBar').getViewModel(),
        topictitle = '';
      if (pageRecord && !pageRecord.parentNode.isRoot()) {
        topictitle = pageRecord.parentNode.get('title');
      }
      uppertoolBarModel.set({
        topictitle: topictitle
      });
    }

    me.lookupReference('lowerToolBar').getViewModel().set(lowerToolBarData);

    //Update toc, navigate to submenu, highlight item
    if (pageNode.getIsTocEntry() && !pageNode.getNonNavPage()) {
      var toc = me.lookupReference('tableOfContents');
      // Navigate toc to show current page
      toc.goToNode(pageRecord.parentNode);

      // Select node in list
      // NOTE I NEED THE RECORD TO GET THE PATH TO SELECT IN TOC
      toc.getController().selectNodeInToc(pageRecord);
    }

    // for REVIEW - make currentPage global
    window.currentPage = {
      pData: {
        bookmark: pageNode.getBookmark(),
        title: pageNode.getTitle()
      }
    };

    // Timer
    if (Player.settings.get('activateTimer')) {
      me.lookupReference('timerbar').getController().start(pageRecord);
    }
  },

  onShowToc: function() {
    var content = this.lookupReference('contentPanel');
    if (content.getScreen() != 'toc') {
      content.setScreen('toc');
    } else {
      content.setScreen('main');
    }
  },

  onShowNarration: function() {
    var me = this,
      narration = this.lookupReference('narration');
    narration.show();
  },

  onHideNarration: function() {
    this.lookupReference('narration').hide();
  },

  onHideToc: function() {},

  goToPageIdAfterLoad: function(pageId) {
    this.startPageId = pageId;
  },
  goToPageNumAfterLoad: function(pageNum) {
    this.startPageNum = pageNum;
  },

  onClose: function() {
    Ext.Msg.confirm(Lang.Exit, Lang.Sure_Exit, this.exitCourse);
  },
  exitCourse: function(btnId) {
    var me = this,
      tracking = Player.settings.get('tracking').toUpperCase();
    if (btnId == 'yes' || btnId == 'ok') {
      console.info("Exit:", tracking);
      if (tracking == 'TINCAN' || tracking == 'TCAPI' || tracking == 'LOCAL.') {
        SCORM.ConcedeControl();
      } else {
        SCORM.Exit();
      }
    } else {
      try {
        currentPage.showVideo();
      } catch (e) {}
    }
  },

  /**
   * INIT
   */
  init: function(application) {
    var me = this;
    Ext.getWin().on('beforeunload', function(e) {
      SCORM.Exit();
      /*if (e) e.returnValue = Lang.Exit;
      if (window.event) window.event.returnValue = Lang.Exit;
      return Lang.Exit;*/
    }, this, {
      normalized: false
    });
    if (Ext.getStore("ScoTreeStore").isLoaded()) {
      me.startLoadSettings();
    }
  },

  // load Settings
  initHelp: function() {
    var me = this;
    // nothing anymore
  },

  onScoTreeStoreLoad: function(sender, records, successful, eOpts) {
    this.startLoadSettings();
  },

  // load Settings
  startLoadSettings: function() {
    var me = this;
    if (!Player.settings) {
      Player.model.ScoSetting.load(0, {
        scope: me,
        success: me.onLoadSettings,
        failure: function(record, operation) {
          console.error("Failed to load settings");
        }
      });
    }
  },

  onLoadSettings: function(settings, operation) {
    var me = this,
      st = Ext.getStore("ScoTreeStore");

    // TODO: remove this wonce timerbar is ready
    settings.set('activateTimer', false);

    Player.settings = settings;

    //set Tracking
    var tracking = settings.data.tracking;
    if (tracking !== 'none' && tracking !== undefined) {
      Player.settings.set('bookmarking', true);
    }


    var uppertoolBarModel = me.lookupReference('upperToolBar').getViewModel();
    //set course title
    window.document.title = settings.data.title;

    var showClose = true;
    if (tracking == 'none' || (Player.params.showClose && Player.params.showClose != '1')) {
      showClose = false;
    }

    uppertoolBarModel.set({
      coursetitle: settings.data.title,
      showClose: showClose
    });

    // load Math Jax
    me.loadMathJax(settings.data.useMath);

    // Remove timer bar if not set
    if (settings.data.activateTimer) {
      me.lookupReference('timerbar').show();
      console.warn("TODO: timerbar");
    }

    // Lowertoolbar stuff
    var lowertoolBarModel = me.lookupReference('lowerToolBar').getViewModel();

    // Remove glossary from lower bar and help if no glossary
    var glossary = true;
    if (!settings.data.glossary) {
      glossary = false;
    }

    // Remove narration fromlower bar and help if no narration
    var narration = true;
    if (!settings.data.narration) {
      narration = false;
    }

    var totalPageNumber = st.getTotalCount();
    lowertoolBarModel.set({
      pageNumber: 0,
      totalPageNumber: totalPageNumber,
      glossary: glossary,
      narration: narration,
      pageNumbering: !! settings.data.pageNumbering
    });

    /// Load Scorm
    Player.app.fireEvent('loadscorm');

    // Bookmarking
    // recover session
    if (settings.data.bookmarking) {
      var dc = SCORM.GetDataChunk();
      if ( !! dc && dc != "undefined") {
        console.info("recoverSession::", dc);
        st.recoverSession(dc);
      }
    }

    // recover Bookmark page
    var bm = SCORM.GetBookmark(),
      bookmarkPage = decodeURI(SCORM.GetBookmark()),
      hash = Ext.History.currentToken;
    if (settings.data.bookmarking && bookmarkPage != "" && bookmarkPage != "undefined" && Player.params.status != 'notattempted') {
      Ext.Msg.confirm(Lang.scorm.Course_Bookmark, Lang.scorm.Course_Bookmark_Message, function(btnId) {
        if (btnId == 'yes' || btnId == 'ok') {
          me.recoverBookmark(bookmarkPage);
        } else {
          me.goToFirstPage();
        }
      });
    } else if ( !! hash && hash != '' && hash != '#') {
      var st = Ext.getStore("ScoTreeStore"),
        pageRecord = st.findRecordByType('linkID', hash);
      if (!pageRecord) {
        pageRecord = st.findRecordByType('title', hash);
        if (!pageRecord) {
          me.goToFirstPage();
        } else {
          me.goToPage(pageRecord)
        }
      } else {
        me.goToPage(pageRecord)
      }
    } else {
      me.goToFirstPage();
    }

    me.initHelp();

    // INIT first screen
    Ext.fly('appLoadingIndicator').destroy();
  },

  goToFirstPage: function() {
    var me = this,
      st = Ext.getStore("ScoTreeStore"),
      pageController = me.lookupReference('mainPages').getController();
    if (me.startPageId) {
      pageController.goToPage(st.getNode(me.startPageId));
    } else if (me.startPageNum) {
      var spn = parseInt(me.startPageNum) - 1;
      pageController.goToPage(st.getNode(spn, 'pageNum'));
    } else {
      // Go to first page
      pageController.goToPage(st.getFirstLeaf(st.getRoot()));
    }
  },

  recoverBookmark: function(bookmark) {
    var me = this,
      st = Ext.getStore('ScoTreeStore'),
      tempNode,
      bookmarkType = 'bookmark';

    if (!isNaN(parseInt(bookmark))) {
      bookmarkType = 'pageNum';
    }

    tempNode = st.findRecordByType(bookmarkType, bookmark);

    if (tempNode) {
      me.goToPage(tempNode);
    } else {
      me.goToPage(st.getFirstLeaf(st.getRoot()));
    }
  },


  /*
  Math Jax
  */
  loadMathJax: function(useMath) {
    var me = this;

    // load Mathjax, and config
    if (useMath) {
      me.loadScript('http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML', me, 'UTF-8', 'text/javascript', function(e) {
        me.loadScript('mathjax-config.js', me, 'UTF-8', 'text/javascript');
      });
    }

    window.ApplyMathJax =
      function(element) {
        if (typeof MathJax !== 'undefined') {
          MathJax.Hub.PreProcess(element);
          MathJax.Hub.Process(element);
        }
    };
  },

  loadScript: function(url, scope, charset, type, successCallback, failureCallback) {
    // TODO: see I f I can move this to aplciation....
    var script = document.createElement('script'),
      me = this,
      successCallback = successCallback || Ext.emptyFn,
      failureCallback = failureCallback || Ext.emptyFn;

    if (!type) {
      type = 'text/javascript';
    }
    script.type = type;
    script.src = url;
    script.onload = successCallback;
    script.onerror = function(e) {
      failureCallback.call(scope, e);
    };
    script.onreadystatechange = function(e, f, g) {
      if (this.readyState === 'loaded' || this.readyState === 'complete') {
        successCallback.call(scope);
      }
    };

    if (charset) {
      script.charset = charset;
    }

    var documentHead = typeof document != 'undefined' && (document.head || document.getElementsByTagName('head')[0]);
    documentHead.appendChild(script);

    return script;
  }
});