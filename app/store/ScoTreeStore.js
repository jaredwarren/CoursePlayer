Ext.define('Player.store.ScoTreeStore', {
  extend: 'Ext.data.TreeStore',
  requires: [
    'Player.model.PageModel',
    'Player.model.TopicModel',
    'Ext.data.proxy.Ajax',
    'Ext.data.reader.Json'
  ],

  model: 'Player.model.PageModel',
  id: 'ScoTreeStore',
  storeId: 'ScoTreeStore',
  autoLoad: true,
  proxy: {
    type: 'ajax',
    url: 'data/sco.json',
    reader: {
      type: 'json',
      typeProperty: 'mtype',
      rootProperty: 'page'
    }
  },
  filters: [
    function(item) {
      if(item.get('restrictedTopicId')){
        item.set('cls', 'restricted-item');
      }
      if (item.isLeaf()) {
        return !!item.data.isTocEntry;
      }
      return true;
    }
  ],
  findRecordByType: function(type, value) {
    if (type == 'id') {
      return this.findIt(type, value, function(key, value, tempNode) {
        return (tempNode.id == value);
      }, this.root.childNodes);
    } else {
      return this.findIt(type, value, function(key, value, tempNode) {
        return (tempNode.raw[type] == value || tempNode.data[type] == value);
      }, this.root.childNodes);
    }
    return false;
  },

  findIt: function(key, value, condition, root) {
    var tempNode;
    for (var i = 0; i < root.length; i++) {
      tempNode = root[i];
      if ( !! condition.apply(this, [key, value, tempNode])) {
        return tempNode;
      }
      var result = this.findIt(key, value, condition, tempNode.childNodes);
      if ( !! result) {
        return result;
      }
    };
    return false;
  },

  getTotalCount: function() {
    var me = this;
    if (typeof me.totalPages != 'undefined') {
      return me.totalPages;
    }
    var count = 0;

    me.root.cascadeBy(function(node) {
      if (node.isLeaf() && !node.data.nonNavPage) {
        if (node.data.pType == 'Quiz' && node.data.number_questions) {
          node.set('pageNum', count);
          if (node.data.useSubset) {
            count += node.data.numquestions;
          } else {
            count += node.data.question.length;
          }
        } else {
          node.set('pageNum', count++);
        }
      }
    });
    return me.totalPages = count;
  },

  getNextPage: function(node) {
    var me = this,
      result;
    if (node && node.nextSibling) {
      if (node.nextSibling.isLeaf() && !node.nextSibling.data.nonNavPage) {
        return node.nextSibling;
      } else {
        result = me.getFirstLeaf(node.nextSibling);
        if (result && !result.data.nonNavPage) {
          return result;
        }
        return me.getNextPage(node.nextSibling);
      }

    } else if (node) {
      return me.getNextPage(node.parentNode);
    }
    return null;
  },

  getFirstLeaf: function(node) {
    var me = this,
      result,
      numNodes = node.childNodes.length,
      childNode,
      i = 0;

    for (i = 0; i < numNodes; i++) {
      childNode = node.childNodes[i];
      if (childNode.isLeaf()) {
        return childNode;
      } else {
        result = me.getFirstLeaf(childNode);
        if (result) {
          return result;
        }
      }
    }
    return null;
  },

  getPreviousPage: function(node) {
    var me = this,
      result;

    if (node && node.previousSibling) {
      if (node.previousSibling.isLeaf() && !node.previousSibling.data.nonNavPage) {
        return node.previousSibling;
      } else {
        result = me.getLastLeaf(node.previousSibling);
        if (result && !result.data.nonNavPage) {
          return result;
        }
        return me.getPreviousPage(node.previousSibling);
      }

    } else if (node) {
      return me.getPreviousPage(node.parentNode);
    }
    return null;
  },

  getLastLeaf: function(node) {
    var me = this,
      result,
      numNodes = node.childNodes.length,
      childNode, i;

    for (i = numNodes - 1; i >= 0; i--) {
      childNode = node.childNodes[i];
      if (childNode.isLeaf()) {
        return childNode;
      } else {
        result = me.getLastLeaf(childNode);
        if (result) {
          return result;
        }
      }
    }
    return null;
  },

  getNode: function(titleOrLinkId, type) {
    var me = this,
      node,
      hp = Ext.getStore('hiddenPages');
    if (type) {
      node = this.findRecordByType(type, titleOrLinkId);
      if (node) {
        return node;
      }
      node = hp.findRecordByType(type, titleOrLinkId);
      if (node) {
        return node;
      }
    } else {
      node = this.findRecordByType('linkID', titleOrLinkId);
      if (node) {
        return node;
      }
      node = this.findRecordByType('title', titleOrLinkId);
      if (node) {
        return node;
      }

      node = hp.findRecordByType('linkID', titleOrLinkId);
      if (node) {
        return node;
      }
      node = hp.findRecordByType('title', titleOrLinkId);
      if (node) {
        return node;
      }
    }
    return null;
  },

  /*
  SCORM Stuff
  */
  getCurrentDataChunk: function() {
    var me = this,
      completedPages = [],
      selectablePage = [],
      partialCompleted = 0,
      totalCompleted = 0,
      dc = 'toc`';

    me.root.cascadeBy(function(node) {
      if (node.get("isTocEntry") && !node.isRoot()) {
        if (node.isLeaf()) {
          if (node.get('complete')) {
            completedPages.push('1');
            partialCompleted++;
          } else {
            completedPages.push('0');
          }
          totalCompleted++;
          if (node.get('restrictedTopicId')) {
            selectablePage.push('0');
          } else {
            selectablePage.push('1');
          }

        }
      }
    });
    percentCompleted = (partialCompleted / totalCompleted) * 100;
    percentCompleted = percentCompleted.toFixed(2);

    dc += completedPages.join(",") + ":" + percentCompleted + ":" + selectablePage.join(",");
    return dc;
  },


  recoverSession: function(chunk) {
    var me = this,
      parts = chunk.substr(4).split(":"),
      pagesCompleted = parts[0].split(','),
      pagesSelectable = parts[2].split(','),
      counter = 0;

    me.root.cascadeBy(function(node) {
      if (node.get("isTocEntry") && !node.isRoot() && node.isLeaf()) {
        if (pagesCompleted[counter] == '1') {
          node.set('text', '&#x2713; ' + node.get('text'));
          node.set('complete', true);
        } else {
          node.set('complete', false);
        }

        if (pagesSelectable[counter] == '1') {
          node.set('restrictedTopicId', false);
        }
        counter++;
      }
    });
  },

  markCompletedTopics: function(pageNode) {
    var me = this,
      completedTopicList = [],
      allPagesComplete = true;

    // Step up tree
    pageNode.bubble(function(node) {
      if (node.isLeaf()) {
        return;
      }
      if (me.isTopicComplete(node)) {
        completedTopicList.push(node.data.topicId);
        // mark topic complete
        node.set('complete', true);
      } else {
        allPagesComplete = false;
        return false;
      }
    });

    me.removeTopicRestriction(me.root, completedTopicList);
  },
  isTopicComplete: function(topicNode) {
    var me = this,
      isTopicComplete = true;
    if (topicNode.isLeaf()) {
      return;
    }
    topicNode.cascadeBy(function(node) {
      // skip self
      if (node != topicNode) {
        if (!node.get('complete')) {
          return isTopicComplete = false;
        }
      }
    });
    return isTopicComplete;
  },

  removeTopicRestriction: function(topicNode, topicIdList) {
    topicNode.cascadeBy(function(node) {
      // Remove restricted from list
      var currentRestrictedId = node.get('restrictedTopicId');
      if (currentRestrictedId && currentRestrictedId.length > 0) {
        var updatedRestrictedId = currentRestrictedId.filter(function(x) {
          return topicIdList.indexOf(x) < 0
        });
        if (updatedRestrictedId.length == 0) {
          node.set('restrictedTopicId', false);
          node.set('cls', '');
        } else {
          node.set('restrictedTopicId', updatedRestrictedId);
        }
      }
    });
  }
});