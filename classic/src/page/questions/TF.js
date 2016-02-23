Ext.define('Player.page.questions.TF', {
  extend: 'Player.page.questions.MCH',

  xtype: 'TF',

  constructor: function(cfg) {
    var me = this;
    cfg = cfg || {};
    // true false
    cfg.distractors = {};
    cfg.distractors.distractor = [{
      "#text": Lang.questions.TF.True,
      letter: 'T',
      correct: !! cfg.correctResp
    }, {
      "#text": Lang.questions.TF.False,
      letter: 'F',
      correct: !cfg.correctResp
    }];

    me.callParent([cfg]);
  }
});