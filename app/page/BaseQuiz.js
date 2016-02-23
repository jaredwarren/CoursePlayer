/*
Handles all of the quiz page logic
*/
Ext.define('Player.page.BaseQuiz', {
  extend: 'Ext.Base',

  requires: [
    'Player.page.questions.Intro',
    'Player.page.questions.FB',
    'Player.page.questions.DDNUM',
    'Player.page.questions.DDTASK',
    'Player.page.questions.ESSAY',
    'Player.page.questions.HOIMAGE',
    'Player.page.questions.ESSAY',
    'Player.page.questions.Intro',
    'Player.page.questions.MC',
    'Player.page.questions.MCAUDIO',
    'Player.page.questions.MCH',
    'Player.page.questions.MCHAUDIO',
    'Player.page.questions.MCHIMAGE',
    'Player.page.questions.MCIMAGE',
    'Player.page.questions.TF',
    'Player.page.questions.Results',
    'Player.page.questions.Review'
  ],

  indicator: false,
  defaults: {
    styleHtmlContent: true
  },

  config: {
    // page stuff
    title: '',
    pType: '',
    pageNum: -1,
    isTocEntry: true,
    nonNavPage: false,
    completed: false,
    narration: false,
    bookmark: '',
    recordId: undefined,

    // quiz stuff
    totalItems: 0,
    numquestions: 0,
    number_questions: true,

    //  Navigation
    locked: 'none'
  },

  /*
  Accessors
  */
  setQuestions: function(questions) {
    var me = this;
    me.removeAll();
    me.add(questions);
  },

  getQuestions: function() {
    return this.items.items;
  },

  getPageNumber: function() {
    var me = this,
      index = me.getActiveIndex()+1,
      activeItem = me.getActiveItem(),
      pageNum = me.getPageNum();

    if (activeItem) {
      var qType = activeItem.getQtype();
      if (qType == 'Intro') {
        index = 1;
      } else if (qType == 'Results') {
        index = me.getActiveIndex() - 0;
      } else if (qType == 'Review') {
        index = me.getActiveIndex() - 1;
      }
    }

    // if  current page is review or results just return pageNum    
    return index + pageNum;
  },

  applyPageNum: function(pageNum) {
    return parseInt(pageNum, 10);
  },


  /*
  MixinHandler
  */
  onReview: function() {
    var me = this,
      review = me.query('Review')[0];
    if(!review){
      me.add(Ext.create('Player.page.questions.Review', me._reviewObj));
    }
    me.nextHandler();
  },

  resetQuestions: function() {
    var me = this;
    me.setActiveItem(0);
  },

  /*
  Page Stuff
  */
  nextHandler: function() {
    var me = this;
    if (me.getActiveIndex() + 1 < me.items.items.length) {
      me.next();
      return false;
    }
    return true;
  },

  previousHandler: function() {
    var me = this;
    if (me.getActiveIndex() > 0) {
      if (me.getQuizmode() == 'test' && me.getActiveItem().getQtype() != 'Review') {
        return true;
      } else {
        me.previous();
        return false;
      }
    }
    return true;
  },

  _started: false,
  start: function() {
    var me = this;

    me._started = true;
    
    // reset questions
    me.onRetake();

    // fix phone nav problem, 
    Ext.Function.defer(function(){
      me.refresh();
    }, 500);
  },

  close: function() {
    var me = this;
    me._started = false;
  }
});