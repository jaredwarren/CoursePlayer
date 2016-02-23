Ext.define('Player.page.questions.PrintMixin', {
  extend: 'Ext.Base',

  onPrint: function() {
    var me = this,
      cr = "<br/>",
      lmsName = '',
      nowDate = new Date(),
      compDate = (nowDate.getMonth() + 1) + "/" + nowDate.getDate() + "/" + nowDate.getFullYear(),
      bodyText = '',
      results = me.getResults(),
      winurl, quizTitle = 'Undefined';

    bodyText += (Lang.emailpopup.Course_Results_Email.replace("{title}", Player.settings.get('title')) + cr + cr);

    if (me.incQuizTitle) {
      try {
        quizTitle = me.parent.getPageData().title;
      } catch (e) {
        quizTitle = 'Undefined';
      }
      bodyText += (Lang.emailpopup.Email_Quiz + quizTitle + cr + cr);
    }

    if (me.LMS_name) {
      try {
        lmsName = SCORM.GetStudentName();
      } catch (e) {
        lmsName = '';
      }
      bodyText += Lang.emailpopup.Email_User + lmsName + cr + cr;
    }

    bodyText += Lang.emailpopup.Email_DateCompleted + ':' + compDate + cr + cr + Lang.emailpopup.Email_TotalCorrect + ':' + results.correct + cr + Lang.emailpopup.Email_TotalIncorrect + ':' + results.incorrect + cr + Lang.emailpopup.Email_Percent + ':' + results.intScore + "%" + cr + cr;
    winurl = '';
    win = window.open(winurl, Lang.emailpopup.Email_Window);
    win.document.write('<html><head><title>' + Lang.emailpopup.Email_Window + '</title></head><body ><img src="resources/images/QuizResultsIcon-02.png" width="100" height="100" />' + bodyText + '</body></html>');
    win.print();
  }
});