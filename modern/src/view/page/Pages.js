Ext.define('Player.view.page.Pages', {
  extend: 'Ext.carousel.Carousel',
  xtype: 'pages',

  requires: [
    'Player.view.page.PageController'
  ],

  controller: 'page',
  id: 'mainPages',
  reference: 'mainPages',
  indicator: false,
  defaults: {
    styleHtmlContent: true
  },

  listeners: {
    tap: {
      fn: 'onPageTap',
      element: 'element'
    }
  },
  
  config: {
    locked: 'none'
  },

  prev: function() {
    return this.previous();
  },
  getPrev: function() {
    return this.layout.getPrev();
  },
  getNext: function() {
    return this.items.getAt(this.getActiveIndex() + 1);
  },
  getPrev: function() {
    return this.items.getAt(this.getActiveIndex() - 1);
  },

  onDragStart: function(e) {
    var me = this,
      lockDir = me.getLocked();
    if (e.deltaX > 0 && (lockDir == 'left' || lockDir == 'both')) {
      return;
    } else if (e.deltaX < 0 && (lockDir == 'right' || lockDir == 'both')) {
      return;
    }
    me.callParent(arguments);
  },
  onDrag: function(e) {
    var me = this,
      lockDir = me.getLocked();
    if (e.deltaX > 0 && (lockDir == 'left' || lockDir == 'both')) {
      return;
    } else if (e.deltaX < 0 && (lockDir == 'right' || lockDir == 'both')) {
      return;
    }
    me.callParent(arguments);
  },
  onDragEnd: function(e) {
    if (!this.isDragging) {
      return;
    }

    this.onDrag(e);

    this.isDragging = false;

    var now = Ext.Date.now(),
      itemLength = this.itemLength,
      threshold = itemLength / 2,
      offset = this.offset,
      activeIndex = this.getActiveIndex(),
      maxIndex = this.getMaxItemIndex(),
      animationDirection = 0,
      flickDistance = offset - this.flickStartOffset,
      flickDuration = now - this.flickStartTime,
      indicator = this.getIndicator(),
      velocity;

    if (flickDuration > 0 && Math.abs(flickDistance) >= 10) {
      velocity = flickDistance / flickDuration;

      if (Math.abs(velocity) >= 1) {
        if (velocity < 0 && activeIndex < maxIndex) {
          animationDirection = -1;
        } else if (velocity > 0 && activeIndex > 0) {
          animationDirection = 1;
        }
      }
    }

    if (animationDirection === 0) {
      if (activeIndex < maxIndex && offset < -threshold) {
        animationDirection = -1;
      } else if (activeIndex > 0 && offset > threshold) {
        animationDirection = 1;
      }
    }

    // override animation direction if locked
    var lockDir = this.getLocked();
    if (animationDirection > 0 && (lockDir == 'left' || lockDir == 'both')) {
      animationDirection = 0;
    } else if (animationDirection < 0 && (lockDir == 'right' || lockDir == 'both')) {
      animationDirection = 0;
    }

    if (indicator) {
      indicator.setActiveIndex(activeIndex - animationDirection);
    }

    this.animationDirection = animationDirection;

    this.setOffsetAnimated(animationDirection * itemLength);
  }
});