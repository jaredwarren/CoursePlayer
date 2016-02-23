Ext.define('Player.view.tableofcontents.TableOfContentsController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.tableofcontents',
	selectNodeInToc: function(pageNode) {
		var me = this,
			path = pageNode.getPath(),
			toc = me.getView();
		toc.selectPath(path);
	}
});


/*
STUPID HACK::::
override the call to me.doScrollTo, to allowOverscroll=true, 
otherwise whenever you select anything in the toc or glossary it scrolls to the top
*/
/*Ext.override(Ext.scroll.Scroller, {
	scrollIntoView: function(el, hscroll, animate, highlight) {
		var me = this,
			position = me.getPosition(),
			newPosition, newX, newY,
			myEl = me.getElement();
		// Might get called before Component#onBoxReady which is when the Scroller is set up with elements.
		if (el) {
			newPosition = Ext.fly(el).getScrollIntoViewXY(myEl, position.x, position.y);
			newX = (hscroll === false) ? position.x : newPosition.x;
			newY = newPosition.y;
			if (highlight) {
				me.on({
					scrollend: 'doHighlight',
					scope: me,
					single: true,
					args: [
						el,
						highlight
					]
				});
			}
			me.doScrollTo(newX, newY, animate, true);
		}
	}
});*/