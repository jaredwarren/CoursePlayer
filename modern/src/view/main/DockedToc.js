Ext.define('Player.view.main.DockedToc', {
  extend: 'Ext.Panel',
  xtype: 'dockedtoc',
  requires: [
    'Player.view.tableofcontents.TableOfContents'
  ],

  mixins: ['Ext.mixin.Responsive'],
  reference: 'dockedToc',
  responsiveConfig: {
    'width > 768': {
      dockPosition: 'docked'
    },
    'width <= 768': {
      dockPosition: 'floating'
    }
  },
  config: {
    dockPosition: 'docked'
  },
  autoDestroy: false,

  width: 250,
  height: '100%',
  docked: 'left',
  items: [{
    xtype: 'tableofcontents',
    id: 'tableOfContents'
  }],

  /**
  HACK to fix show hide animations
  */ 
  animateFn: function(animation, component, newState, oldState, controller) {
    var me = this;
    me.activeAnimation = new Ext.fx.Animation(animation);
    me.activeAnimation.setElement(component.element);
    if (!Ext.isEmpty(newState)) {
      me.activeAnimation.setOnEnd(function() {
        me.activeAnimation = null;
        controller.resume();
      });
      controller.pause();
    }
    Ext.Animator.run(me.activeAnimation);
  },
  getHideAnimation: function() {
    // don't show animation unless rendered, otherwise hide animation will run before show animation on first time.
    if(!this.isRendered()){
      return false;
    }
    return {
      type: 'slideOut',
      direction: 'left',
      duration: 400
    };
  },

  getShowAnimation: function() {
    return {
      type: 'slideIn',
      direction: 'right',
      duration: 400
    };
  },

  updateDockPosition: function(dockPosition) {
    switch (dockPosition) {
      case 'floating':
        this.docked = false;
        this.el.setStyle('position', 'fixed');
        this.el.setStyle('top', '0');
        this.el.setStyle('left', '0');
        this.el.setStyle('bottom', '0');
        this.el.setStyle('z-index', '22');
        this.left = 0;
        this.hide();
        break;
      case 'docked':
      default:
        this.el.setStyle('position', 'relative');
        this.docked = 'left';
        this.show();
        break;
    }
  }
});