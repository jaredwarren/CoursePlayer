Ext.define('Player.page.questions.BaseMCAUDIO', {
  extend: 'Player.page.questions.MC',

  getDistractor: function(distractor) {
    var me = this,
      distractorText = distractor['#text'].toString();

    if (!distractorText) {
      return false;
    }
    distractor.distractorText = distractorText;
    return {
      xtype: 'audiobox',
      layout: {
        align: 'center',
        pack: 'start',
        type: 'hbox'
      },
      mediaPath: distractor.filePath,
      raw: distractor,
      listeners: {
        play: me.onPlay,
        scope: me
      },
      items: [{
        xtype: me.distractorType,
        inputValue: distractor.letter,
        boxLabel: distractorText,
        label: distractorText,
        labelAlign: 'right',
        name: me.getDistractorName(distractor.letter),
        labelWrap: true,
        labelWidth: null,
        styleHtmlContent: true,
        letter: distractor.letter,
        correct: distractor.correct,
        listeners: {
          change: {
            fn: me.onSelect,
            scope: me
          }
        }
      }]
    };
  },

  close: function() {
    var me = this;
    me.callParent(arguments);
    Ext.Array.each(me.query('audio'), function(audio, index, items) {
      audio.pause();
    });
  },

  onPlay: function(event) {
    var me = this;
    // pause all others...
    Ext.Array.each(me.query('audio'), function(audio, index, items) {
      if(audio.audio != event.target){
        audio.pause();
      }
    });
  }
});