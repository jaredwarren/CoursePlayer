Ext.define('Player.page.Quiz', {
  extend: 'Ext.carousel.Carousel',
  xtype: 'quiz',

  mixins: [
    'Player.page.BaseQuiz',
    'Player.page.QuizMixin'
  ],

  indicator: false,

  constructor: function(cfg) {
    var me = this,
      questionList = [];
    cfg = cfg || {};

    // if not ransomized, add now, otherwise add at start
    if (typeof cfg.randomize == 'undefined') { // for some reason if randomize isn't set it throws an error
      cfg.randomize = true;
    }
    if (!cfg.randomize) {
      questionList = me.refreshQuestionList(cfg);
    }

    me.callParent([Ext.apply({
      items: questionList,
      totalItems: questionList.length
    }, cfg)]);
  },

  initialize: function() {
    var me = this;
    me.callParent(arguments);
    this.on("beforeactiveitemchange", me.onBeforeActiveItemChange, me);
    this.on("activeitemchange", me.onActiveItemChange, me);
  },

  onBeforeActiveItemChange: function(sender, pageNode, oldValue, eOpts) {
    var me = this;
    me.onBeforeQuestionchange(me, pageNode, oldValue, eOpts);
  },

  onActiveItemChange: function(sender, pageNode, oldValue, eOpts) {
    var me = this,
      activeIndex = me.getActiveIndex(),
      previousNode = me.getAt(activeIndex - 1),
      nextNode = me.getAt(activeIndex + 1),
      lockDir = me.getLocked();

    me.onQuestionchange(me, pageNode, oldValue, eOpts);
  },

  getNext: function() {
    return this.items.getAt(this.getActiveIndex() + 1)
  },
  getPreviousPage: function(questionNode) {
    return this.getAt(this.getActiveIndex() - 1);
  },

  getNextPage: function(questionNode) {
    return this.getAt(this.getActiveIndex() + 1);
  },

  start: function() {
    var me = this;
    // call mixin start
    me.mixins['Player.page.BaseQuiz'].start.call(me);
    // force call onActiveItemChange because carousel is stupid
    me.onActiveItemChange(me, me.getActiveItem(), null);



  },


  /*
  Carousel navigation stuff
  */
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