Ext.define('Player.view.page.BasePageController', {
  extend: 'Ext.app.ViewController',
  requires: [
    'Player.page.Page',
    'Player.page.TextPage',
    'Player.page.CustomHTML5Page',
    'Player.page.FrameHTML5Page',
    'Player.page.VisualLayoutPage',
    'Player.page.Quiz',
    'Player.page.PopupExternalActivity',
    'Player.page.ImageMouseover',
    'Player.page.Definitions',
    'Player.page.CategoriesDrag',
    'Player.page.CaseStudy',
    'Player.page.Matching',
    'Player.page.Video',
    'Player.page.VideoQuiz',
    'Player.page.StepbyStep',
    'Player.page.Certificate',
    'Player.page.TextandVideo',
    'Player.page.Essay'
  ],

  control: {
    '#mainPages': {
      'beforeactiveitemchange': 'onBeforePageChange',
      'activeitemchange': 'onPageChange'
    }
  },
  listen: {
    component: {
      'page': {
        'page-complete': 'onPageComplete'
      },
      'quiz': {
        'page-complete': 'onPageComplete',
        'page-change': 'onQuestionchange'
      }
    }
  },
  onPageComplete: function(page) {
    var me = this,
      carousel = me.getView(),
      st = Ext.getStore("ScoTreeStore"),
      pageNode = st.findRecordByType('id', page.getRecordId());

    if (pageNode.get('complete')) {
      return;
    }
    pageNode.set('text', '&#x2713; ' + pageNode.get('title'));
    pageNode.set('cls', 'completed-node');
    pageNode.set('complete', true);
    pageNode.commit();

    st.markCompletedTopics(pageNode);

    // Add Next Page
    var nextPage = me.addNextPage(pageNode);

    // store session
    SCORM.SetDataChunk(st.getCurrentDataChunk());

    // scorm report
    if (st.isTopicComplete(st.root)) {
      Player.settings.set('complete', true);
      Player.app.fireEvent('pauseCourse');
      var completion = Player.settings.get('completion');
      switch (completion) {
        case 'completed':
          SCORM.SetCompleted();
          break;
        case 'incomplete':
          SCORM.ResetStatus();
          break;
        case 'pass':
          SCORM.SetPassed();
          break;
        case 'failed':
          SCORM.SetFailed();
          break;
        case 'None':
        default:
          break;
      }
    }
  },

  // on Quiz change lock carousel
  onQuestionchange: function(sender, value, oldValue, eOpts) {},

  onPageTap: function(event, target, eOpts) {
    var me = this,
      tempTarget,
      toggleReg = /(x-button)|(x-video)|(x-field)|(x-list-item)|(x-dataview-item)/i,
      toggleTools = true;
    event.preventDefault();
    event.stopPropagation();

    if (target) {
      tempTarget = target;
      while (tempTarget.parentNode) {
        tempTarget.onclick = function onclick(event) {
          return false;
        };
        if (tempTarget.nodeName == 'A') {
          me.fireViewEvent('link-tap', tempTarget.href, tempTarget);
          return false;
        } else if (tempTarget.className.search(toggleReg) >= 0) {
          toggleTools = false;
          break;
        } else {
          tempTarget = tempTarget.parentNode;
        }
      }
    }
    if (toggleTools) {
      me.fireViewEvent('page-tap', event, target, eOpts);
    }
  },

  goToPage: function(pageNode) {
    var me = this,
      carousel = me.getView(),
      activeIndex = carousel.getActiveIndex(),
      previousPage = carousel.getActiveItem(),
      matchingPages,
      oldRId = '',
      newPage, addedPage;

    if (!pageNode) {
      console.log("no pageNode");
      return;
    }

    if (pageNode.get('restrictedTopicId')) {
      console.log("Restricted:" + pageNode.get('restrictedTopicId'));
      return;
    }

    if (previousPage && pageNode.id == previousPage.recordId) {
      // same page
      return;
    }

    // add pageNod to carousel if not already there
    matchingPages = carousel.query('[recordId=' + pageNode.id + ']');
    if (matchingPages.length == 0) {
      var relativeToItem,
        pageNum = parseInt(pageNode.data.pageNum, 10);
      Ext.Array.each(carousel.items.items, function(tempPage, index, items) {
        // skip indicator
        if (tempPage == carousel.getIndicator()) {
          return;
        }
        if (tempPage.getPageNum() >= pageNum) {
          relativeToItem = tempPage;
          return false;
        }
      });
      // Add page to carousel
      newPage = me.createPage(pageNode);
      if (relativeToItem) {
        carousel.insertBefore(newPage, relativeToItem);
        addedPage = newPage;
      } else {
        addedPage = carousel.add(newPage);
      }
    } else {
      // just goto page
      addedPage = matchingPages[0];
    }

    var ok = carousel.setActiveItem(addedPage);
    if (!ok) {
      console.warn("Something happened..", addedPage);
    }
  },

  createPage: function(pageNode) {
    var me = this,
      pType = pageNode.get('pType'),
      pageData = Ext.clone(pageNode.raw),
      newPage;

    // I need to remove sencha reserved words e.g 'id', 'items'
    // id
    pageData.recordId = pageData.id;
    delete pageData.id;

    // items
    if (pageData.hasOwnProperty('items')) {
      pageData.pageItems = pageData.items;
      delete pageData.items;
    }

    if (typeof Player.page[pType] != 'undefined') {
      newPage = Ext.create('Player.page.' + pType, pageData);
    } else {
      // try to synchronously load Custom Page
      try {
        newPage = Ext.create('Player.page.custom.' + pType, pageData);
      } catch (e) {
        if (e.message.match(/Unrecognized class name/)) {
          newPage = Ext.create('Player.page.TextPage', Ext.Object.merge(pageData, {
            title: ' -- Unsupported Page -- ',
            pType: 'TextPage',
            pText: {
              '#text': 'The page type, `' + pType + '`, is not supported by this player.'
            }
          }));
        } else {
          newPage = Ext.create('Player.page.TextPage', Ext.Object.merge(pageData, {
            title: ' -- Page Error -- ',
            pType: 'TextPage',
            pText: {
              '#text': 'There was an error creting this page (' + pType + ').' + e.message
            }
          }));
        }
      }
    }
    return newPage;
  },

  onNextPage: function() {
    var me = this,
      view = me.getView(),
      currentPage = view.getActiveItem(),
      nextPage = view.getNext(),
      ok = currentPage.nextHandler();
    if (ok && nextPage) {
      view.next();
    }
    return false;
  },

  onPreviousPage: function() {
    var me = this,
      view = me.getView(),
      currentPage = view.getActiveItem(),
      nextPage = view.getPrev(),
      ok = currentPage.previousHandler();
    if (ok && nextPage) {
      view.prev();
    }
    return false;
  },


  onBeforePageChange: function(sender, value, oldValue, eOpts) {
    var me = this;

    me.maskPages(Lang.Loading);

    // End old page
    if ( !! oldValue) {
      oldValue.close();
    }
    //console.log("%c setLocked:::?? none");
    //me.getView().setLocked('none');
  },
  onPageChange: function(sender, value, oldValue, eOpts) {
    var me = this;

    // Update Carousel Items
    if (!value.getNonNavPage()) {
      me.updateCarousel(value);
    }

    me.fireEvent('page-change', sender, value, oldValue, eOpts);

    // Start New page
    value.start();

    // unmask
    me.maskPages(false);
  },
  updateCarousel: function(newPage) {
    var me = this,
      carousel = me.getView(),
      st = Ext.getStore("ScoTreeStore"),
      pageNode = st.findRecordByType('id', newPage.getRecordId()),
      previousNode = st.getPreviousPage(pageNode),
      nextNode,
      currentPage = carousel.getActiveItem(),
      nextPage, previousPage,
      lockDir = 'none';

    // Add previous page if needed
    if (previousNode) {
      if (carousel.query('[recordId=' + previousNode.id + ']').length == 0) {
        previousPage = me.createPage(previousNode);
        carousel.insertBefore(previousPage, currentPage);
      }
    } else {
      lockDir = 'left';
    }

    // Add next page if needed
    if (!Player.settings.get('activateTimer') || pageNode.get('complete')) {
      nextNode = st.getNextPage(pageNode);
      if (nextNode && !nextNode.get('restrictedTopicId')) {
        if (carousel.query('[recordId=' + nextNode.id + ']').length == 0) {
          nextPage = me.createPage(nextNode);
          carousel.insertAfter(nextPage, currentPage);
        }
      } else {
        if (lockDir == 'left') {
          lockDir = 'both';
        } else {
          lockDir = 'right';
        }
      }
    } else {
      if (lockDir == 'left') {
        lockDir = 'both';
      } else {
        lockDir = 'right';
      }
    }
    //console.log('updateCarousel => %c%s', 'color:#FF0000', lockDir);
    //carousel.setLocked(lockDir);
  },

  addNextPage: function(pageNode) {
    var me = this,
      carousel = me.getView(),
      st = Ext.getStore("ScoTreeStore"),
      nextNode,
      currentPage = carousel.getActiveItem(),
      nextPage = false,
      previousPage;

    // Add next page if needed
    if (!Player.settings.get('activateTimer') || pageNode.get('complete')) {
      nextNode = st.getNextPage(pageNode);
      if (nextNode && !nextNode.get('restrictedTopicId')) {
        if (carousel.query('[recordId=' + nextNode.id + ']').length == 0) {
          nextPage = me.createPage(nextNode);
          carousel.insertAfter(nextPage, currentPage);
        }
      } else {
        console.log('addNextPage => %cright', 'color:#FF0000');
        //carousel.setLocked('right');
      }
    } else {
      console.log('addNextPage => %cright', 'color:#FF0000');
      //carousel.setLocked('right');
    }
    return nextPage;
  }
});