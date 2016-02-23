Ext.define('Player.page.Quiz', {
  extend: 'Player.view.Carousel',
  xtype: 'quiz',

  mixins: [
    'Player.page.BaseQuiz',
    'Player.page.QuizMixin'
  ],

  layout: 'card',

  constructor: function(cfg) {
    var me = this,
      questionList = [];
    cfg = cfg || {};

    // if not ransomized, add now, otherwise add at start
    if (!cfg.randomize) {
      questionList = me.refreshQuestionList(cfg);
    }

    me.callParent([Ext.apply({
      items: questionList,
      totalItems: questionList.length,
      listeners: {
        beforeactiveitemchange: 'onBeforeQuestionchange',
        activeitemchange: 'onQuestionchange',
        scope: me
      }
    }, cfg)]);
  }
});