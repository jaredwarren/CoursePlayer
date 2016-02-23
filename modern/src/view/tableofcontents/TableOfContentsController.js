Ext.define('Player.view.tableofcontents.TableOfContentsController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.tableofcontents',
	onHideToc: function() {
		this.fireViewEvent('hide-toc', this);
	},
	selectNodeInToc: function(pageNode) {
		var me = this,
			index = -1,
			nodeList = pageNode.parentNode.childNodes,
			ln = nodeList.length,
			domlist = me.getView().getActiveItem().getViewItems(),
			i, tempNode;

		// loop through parent node find index of toc entries only
		for (i = 0; i < ln; i++) {
			tempNode = nodeList[i];
			if (tempNode == pageNode) {
				index++;
				break;
			} else if (tempNode.get('isTocEntry') || !tempNode.isLeaf()) {
				index++;
			}
		}

		// mark all as not selected except index
		for (i = 0, ln = domlist.length; i < ln; i++) {
			domlist[i].element.removeCls('x-item-selected');
			if (index == i) {
				domlist[i].element.addCls('x-item-selected');
			}
		}

		// Scroll to node
		return;
		var list = me.getView().getActiveItem(),
			el = domlist[index],
			offset = el.element.dom.offsetTop,
			scroller = list.getScrollable();
		if (offset > list.element.getHeight() - el.element.getHeight()) {
			var maxPosition = scroller.getMaxPosition();
			if (offset > maxPosition.y) {
				offset = maxPosition.y;
			}
			scroller.scrollTo(0, offset);
		} else if (offset < scroller.position.y) {
			scroller.scrollTo(0, offset);
		}
	}
});