/**
 *   DEPRECATED!!! Use TextPage.js instead
 */
Ext.define('Player.page.Text', {
  extend: 'Player.page.Page',

  alias: ['widget.Text'],

  mixins: [
    'Player.page.components.TextImageMixin'
  ],

  layout: 'vbox',
  styleHtmlContent: true,
  scrollable: {
    direction: 'vertical',
    directionLock: true
  },
  items: [{
    xtype: 'panel',
    html: 'Title of the Video',
    itemId: 'pageTitle',
    cls: 'page-title',
    layout: {
      type: 'fit'
    }
  }, {
    xtype: 'textimage',
    cls: 'page-content',
    itemId: 'textImage'
  }]
});