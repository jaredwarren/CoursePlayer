Ext.define('Player.page.FrameHTML5Page', {
  extend: 'Player.page.BaseFrameHTML5Page',

  xtype: 'FrameHTML5Page',

  oldY: 0,

  getBodyEl: function() {
    return this.queryById('pageHtml').innerElement.dom;
  },

  addIframeListeners: function() {
    var me = this,
      iframe = document.getElementById('myiframeCnt' + me.id);

    iframe.contentWindow.onmousedown = function(e) {
      me.onDragStart.call(me, e);
    };
    iframe.contentWindow.onmousemove = function(e) {
      me.onDrag.call(me, e);
    };
    iframe.contentWindow.onmouseup = function(e) {
      me.onDragEnd.call(me, e);
    };

    iframe.contentWindow.addEventListener("touchstart", function(e) {
      me.onDragStart.call(me, e);
    }, true);
    iframe.contentWindow.addEventListener("touchmove", function(e) {
      me.onDrag.call(me, e);
    }, true);
    iframe.contentWindow.addEventListener("touchend", function(e) {
      me.onDragEnd.call(me, e);
    }, true);
    iframe.contentWindow.addEventListener("touchcancel", function(e) {
      me.onDragEnd.call(me, e);
    }, true);
  },

  onDragStart: function(e) {
    var me = this;
    me.fireEvent('page-tap');
    if (e.target.ondragstart || e.target.dragable) {
      return;
    }
    me.isDragging = true;
    me.startDragging = true;
    if (Ext.os.is.desktop) {
      me.startX = e.screenX;
      me.startY = e.screenY;
    } else {
      me.startX = e.touches[0].pageX;
      me.startY = e.touches[0].pageY;
    }
    me.oldY = 0;
  },
  onDrag: function(e) {
    var me = this,
      deltaX, deltaY, absDeltaX, absDeltaY, x, y, time, touch,
      event = Ext.create('Ext.event.Event', {});

    if (!me.isDragging) {
      return;
    }
    if (Ext.os.is.desktop) {
      deltaX = e.screenX - me.startX;
      deltaY = e.screenY - me.startY;
      absDeltaX = Math.abs(deltaX);
      absDeltaY = Math.abs(deltaY);
    } else {
      touch = e.changedTouches[0];
      x = touch.pageX;
      y = touch.pageY;
      absDeltaX = Math.abs(x - me.startX);
      absDeltaY = Math.abs(y - me.startY);
      deltaX = x - me.startX;
      deltaY = y - me.startY;
      time = e.time;
      if (absDeltaY > me.oldY + 29 || absDeltaY < me.oldY - 29) {
        me.onDragEnd(e);
        return;
      }
      me.oldY = absDeltaY;
    }

    event.absDeltaX = Math.abs(deltaX);
    event.absDeltaY = Math.abs(deltaY);
    event.deltaX = deltaX;
    event.deltaY = deltaY;
    event.time = time;

    if (me.startDragging) {
      me.startDragging = false;
      me.parent.onDragStart(event);
    } else {
      if (absDeltaX > absDeltaY) {
        me.parent.onDrag(event);
      } else {
        me.parent.onDragEnd(event);
      }
    }
    e.preventDefault();
  },
  onDragEnd: function(e) {
    var me = this;
    if (!me.isDragging) {
      return;
    }
    me.isDragging = false;
    if (Ext.os.is.desktop) {
      var deltaX = e.screenX - me.startX;
      var deltaY = e.screenY - me.startY;
    } else {
      var touch = e.changedTouches[0],
        x = touch.pageX,
        y = touch.pageY,
        deltaX = x - me.startX,
        deltaY = y - me.startY,
        absDeltaX = Math.abs(deltaX),
        absDeltaY = Math.abs(deltaY);
    }

    var event = Ext.create('Ext.event.Event', {});
    event.absDeltaX = Math.abs(deltaX);
    event.absDeltaY = Math.abs(deltaY);
    event.deltaX = deltaX;
    event.deltaY = deltaY;
    me.parent.onDragEnd(event);
  },
  setLoadingMask: function(message) {
    var me = this;
    if (message === false) {
      me.setMasked(false);
    } else {
      me.setMasked({
        xtype: 'loadmask',
        message: message
      });
    }
  }
});