/**
 *   DEPRECATED!!! Use TextPage.js instead
 */
Ext.define('Player.page.TextandImageLink', {
  extend: 'Player.page.Page',

  alias: ['widget.TextandImageLink'],

  requires: ['Player.page.components.TextImage'],

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