Ext.define('Player.page.VLPComponents.AudioView', {
  extend: 'Player.page.VLPComponents.BaseAudioView',
  xtype: 'vlpaudioview',

  requires: [
    'Player.page.components.Audio',
    'Player.page.components.AudioComponent'
  ],

  onRender: function(e, f, g) {
    var me = this;
    me.callParent(arguments);
    me.el.on('click', me.onPlayTap, me);
  },
  setLoadingMask: function(message) {
    var me = this,
      maskObject = false;
    if (message === false) {
      if (me.pageMask) {
        me.pageMask.hide();
      }
    } else {
      if (!me.pageMask) {
        me.pageMask = new Ext.LoadMask({
          msg: message,
          target: me
        });
      } else {
        me.pageMask.msg = message;
      }
      if (!me.pageMask.isVisible()) {
        me.pageMask.show();
      }
    }
  },
  setCls: function(cls){
    this.el.setCls(cls);
  },
  start: function(){
    var me = this;
    if(me.getAutoPlay()){
      me.play();
    }
  }
});