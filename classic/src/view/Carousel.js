Ext.define('Player.view.Carousel', {
  extend: 'Ext.panel.Panel',
  xtype: 'carousel',

  layout: 'card',

  config: {
    locked: 'none',
    activeIndex: -1,

    // carousel items
    indicator: false
  },

  activeItem: -1,

  getActiveIndex: function() {
    return this.items.indexOf(this.layout.getActiveItem());
  },
  refresh: function(){},
  /*
  Active Item
  */
  getActiveItem: function() {
    return this.layout.getActiveItem();
  },
  setActiveItem: function(activeItem) {
    var me = this,
      currentItem, nextItem;
    if (me.rendered) {
      currentItem = me.layout.getActiveItem();
      if (typeof activeItem == 'object') {
        var itemIndex = this.items.indexOf(activeItem);
        if (itemIndex < 0) {
          return false;
        }
        nextItem = activeItem;
      } else {
        nextItem = me.items.getAt(activeItem);
        itemIndex = activeItem;
      }
      if (currentItem == nextItem) {
        return false;
      }
      me.fireEvent('beforeactiveitemchange', me, nextItem, currentItem);
      me.layout.setActiveItem(nextItem);
      me.fireEvent('activeitemchange', me, nextItem, currentItem);
      return nextItem;
    }
  },

  getIndicator: function() {
    return false;
  },
  getNext: function() {
    return this.layout.getNext();
  },
  getPrev: function() {
    return this.layout.getPrev();
  },
  next: function() {
    var me = this,
      currentItem = me.layout.getActiveItem(),
      nextItem = me.layout.getNext();

    if (!nextItem) {
      return false;
    }

    me.fireEvent('beforeactiveitemchange', me, nextItem, currentItem);
    var results = me.layout.next();
    me.fireEvent('activeitemchange', me, nextItem, currentItem);
    return results;
  },
  prev: function() {
    var me = this,
      currentItem = me.layout.getActiveItem(),
      nextItem = me.layout.getPrev();
    
    if (!nextItem) {
      console.warn("no previous");
      return false;
    }
    var results = me.layout.prev();
    // for some reason when I fire beforeactiveitemchange when a quiz is the current item calling layout.prev breaks
    me.fireEvent('beforeactiveitemchange', me, nextItem, currentItem);
    me.fireEvent('activeitemchange', me, nextItem, currentItem);
    return results;
  },
  getPrev: function(wrap){
    return this.layout.getPrev();
  },
  previous: function(){
    return this.prev();
  },
  /*add: function(item){
    this.callParent(arguments);
  },*/
  insertBefore: function(item, relativeToItem) {
    var index = this.items.indexOf(relativeToItem);
    if (index !== -1) {
      this.insert(index, item);
    }
    return this;
  },
  insertAfter: function(item, relativeToItem) {
    var index = this.items.indexOf(relativeToItem);

    if (index !== -1) {
      this.insert(index + 1, item);
    }
    return this;
  }
});