Ext.define('Player.view.main.PageInfo', {
  extend: 'Ext.Panel',
  xtype: 'pageinfo',

  requires: [
    'Player.view.main.PageInfoModel'
  ],

  reference: 'pageInfo',
  viewModel: 'pageinfo',

  centered: true,
  height: 100,
  hidden: true,
  cls: 'pageinfo',
  width: 300,
  layout: {
    align: 'center',
    pack: 'center',
    type: 'vbox'
  },
  /*hideAnimation: {
    type: 'fadeOut',
    duration: 400
  },
  showAnimation: {
    type: 'fadeIn',
    duration: 400
  },*/
  items: [{
    xtype: 'container',
    itemId: 'pageTitle',
    bind: {
      html: '{pageTitle}'
    }
  }, {
    xtype: 'container',
    itemId: 'pageNumber',
    bind: {
      hidden: '{!pageNumbering}',
      html: "{pageNumber} of {totalPageNumber}"
    }
  }]

});