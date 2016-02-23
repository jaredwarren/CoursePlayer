Ext.define('Player.layout.Accordion', {
  extend: 'Ext.layout.Default',
  alias: 'layout.accordion',

  requires: [
    'Ext.TitleBar',
    'Player.view.tablet.LowerToolBarTablet'
  ],

  itemCls: Ext.baseCSSPrefix + 'layout-accordion-item',
  itemAnimCls: Ext.baseCSSPrefix + 'layout-accordion-item-anim',
  itemArrowCls: Ext.baseCSSPrefix + 'accordion-arrow',
  itemArrowExpandedCls: Ext.baseCSSPrefix + 'accordion-arrow-expanded',

  config: {
    expandedItem: null,
    mode: 'SINGLE'
  },


  checkMode: function(container) {
    var items = container.getInnerItems(),
      i = 0,
      iNum = items.length,
      item, lastItem;
    for (; i < iNum; i++) {
      item = items[i];
      if (!item.collapsed) {
        if (lastItem) {
          this.collapse(lastItem);
        }

        lastItem = item;
      }
    }
  },

  insertInnerItem: function(item, index) {
    var me = this;
    me.callParent([item, index]);

    if (item.isInnerItem()) {
      var titleDock = item.titleDock = item.getHeader(),
        arrowBtn = item.arrowButton = Ext.create('Ext.Button', {
          cls: [
            me.itemArrowCls
          ],
          width: 24,
          height: 24,
          ui: 'plain',
          align: 'right',
          xtype: 'button',
          iconCls: 'pictos pictos-play',
          scope: me,
          handler: 'handleToggleButton'
        });
      titleDock.el.on('tap', me.onTitlebarTap, me);

      titleDock.add(arrowBtn);
      arrowBtn.addCls(me.itemArrowExpandedCls);
      item.addCls(me.itemCls);

      item.on('painted', function() {
        item.addCls(me.itemAnimCls);
      }, me, {
        single: true
      });

      if (item.config.collapsed) {
        item.on('painted', function(component) {
          var items = this.container.getInnerItems(),
            i = 1,
            iNum = items.length,
            item;
          for (; i < iNum; i++) {
            item = items[i];
            if (item.id == component.id) {
              this.collapse(item);
            }
          }
        }, me, {
          single: true
        });
      } else if (me.getMode() === 'SINGLE') {
        me.setExpandedItem(item);
      }
      item.refreshInnerState();
    }
  },

  onTitlebarTap: function(e, node) {
    e.stopPropagation();
    var me = this,
      items = me.container.getInnerItems(),
      ln = items.length,
      tempItem;

    for (var i = 0; i < ln; i++) {
      tempItem = items[i];
      if (tempItem.el.query("#" + node.id).length > 0) {
        break;
      }
    }
    me.expand(tempItem);
  },

  handleToggleButton: function(btn) {
    var component = btn.parent.up('component');
    this.toggleCollapse(component);
  },

  toggleCollapse: function(component) {
    this[component.collapsed ? 'expand' : 'collapse'](component);
  },

  collapseAllButFirst: function() {
    // debugger;
    var items = this.container.getInnerItems(),
      i = 1,
      iNum = items.length,
      item;
    for (; i < iNum; i++) {
      item = items[i];
      this.collapse(item);
    }
  },

  collapse: function(component) {
    //console.log("~collapse:" + component.title);
    if (component.isInner && !(this.getMode() === 'SINGLE' && this.getExpandedItem() === component)) {
      var titleDock = component.titleDock,
        titleHeight = titleDock.el.getHeight();
      component.fullHeight = component.el.getHeight();
      component.setHeight(titleHeight);
      component.collapsed = true;
      component.arrowButton.removeCls(this.itemArrowExpandedCls);
    }
  },

  expand: function(component) {
    //console.log("~expand:" + component.title);
    //debugger;
    var me = this;
    if (component.isInner) {
      if (me.getMode() === 'SINGLE') {
        var expanded = me.getExpandedItem();

        me.setExpandedItem(component);
        if (expanded) {
          me.collapse(expanded);
        }
      }
      component.setHeight(component.fullHeight);
      component.collapsed = false;
      if (component.arrowButton) component.arrowButton.addCls(me.itemArrowExpandedCls);
    }
  }
});