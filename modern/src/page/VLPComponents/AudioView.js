Ext.define('Player.page.VLPComponents.AudioView', {
  extend: 'Player.page.VLPComponents.BaseAudioView',
  xtype: 'vlpaudioview',

  requires: [
    'Ext.Audio',
    'Player.page.components.AudioComponent'
  ],
  cls: ['audio-view', 'object-view'],

  initialize: function() {
    var me = this;
    me.callParent(arguments);

    // add tap/click event to dom, so it works on mobile
    me.queryById('playBtn').el.dom.addEventListener("click", function(e) {
      me.onPlayTap.call(me, e);
    }, true);
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
  },
  onPlayTap: function() {
    var me = this,
      audioComp = me.queryById('audioComp');
    if (audioComp.audio.paused) {
      audioComp.audio.play();
    } else {
      audioComp.audio.pause();
    }
    me.setLoadingMask(Lang.Loading);
  }
});