Ext.define('Player.page.questions.EmailPopupMixin', {
  extend: 'Ext.Base',

  requires: [
    'Player.page.questions.EmailPopup'
  ],

  onShowEmailForm: function() {
    var me = this;
    if (me.getUseServer()) {
      me.showEmailPopup();
    } else {
      me.sendEmail(null, null);
    }
  },

  /*
  Email Popup
  */
  showEmailPopup: function() {
    var me = this,
      emailObj = {
        printMessage: me.getPrintMessage()
      };
    if (!me.emailPopup) {
      me.emailPopup = me.createEmailPopup(emailObj);
    }
    me.emailPopup.show();
  },

  /*
  Send Email
  */
  sendEmail: function(emailPopup, formData) {
    var me = this,
      cr = "<br>",
      lmsName = '',
      nowDate = new Date(),
      compDate = (nowDate.getMonth() + 1) + "/" + nowDate.getDate() + "/" + nowDate.getFullYear(),
      bodyText = '',
      results = me.getResults(),
      idag, riktig, ikkerett, fin, serverURL = 'https://demo.litmosauthor.com/email/sendEmail.php',
      winurl, quizTitle = 'Undefined';

    if (!me.getUseServer()) {
      cr = "\r";
      bodyText = Lang.emailpopup.Make_Sure_Send;
      bodyText += cr + cr + cr + cr + cr;
    }

    bodyText += (Lang.emailpopup.Course_Results_Email.replace("{title}", Player.settings.get('title')) + cr + cr);

    if (me.getIncQuizTitle()) {
      quizTitle = me.getQuizTitle();
      if (quizTitle) {
        bodyText += (Lang.emailpopup.Email_Quiz + ":" + quizTitle + cr + cr);
      }
    }

    if (me.getLMS_name()) {
      try {
        lmsName = SCORM.GetStudentName();
      } catch (e) {
        lmsName = '';
      }
      if (lmsName) {
        bodyText += Lang.emailpopup.Email_User + ":" + lmsName + cr + cr;
      }
    }

    if (me.getUseServer()) {
      bodyText += Lang.emailpopup.Email_Learner + ":" + formData.name + cr + cr;

      idag = "4/5/20106-7-0910/10/2011" + compDate + "3/4/0911/12/20091-1-12";
      riktig = "1468790234" + results.correct + "0223859410";
      ikkerett = "938547012312" + results.incorrect + "7894728301";
      fin = "01293847563459" + results.intScore + "6758102938";

      if (me.getServerURL()) {
        serverURL = me.getServerURL();
      }
      // old one is deprecated...
      if (serverURL == 'http://www.rapidintake.net/send_email.asp') {
        serverURL = 'https://demo.litmosauthor.com/email/sendEmail.php';
      } else if (serverURL == 'http://www.litmosauthor.net/send_email.asp') {
        serverURL = 'https://demo.litmosauthor.com/email/sendEmail.php';
      }

      // from
      var emailFrom = "quiz@litmosauthor.com";
      if (formData.email) {
        emailFrom = formData.email;
      }

      bodyText += Lang.emailpopup.Email_DateCompleted + ':' + compDate + cr + cr + Lang.emailpopup.Email_TotalCorrect + ':' + results.correct + cr + Lang.emailpopup.Email_TotalIncorrect + ':' + results.incorrect + cr + Lang.emailpopup.Email_Percent + ':' + results.intScore + cr + cr;

      Ext.Ajax.setUseDefaultXhrHeader(false);
      var result = Ext.Ajax.request({
        url: serverURL,
        method: 'POST',
        disableCaching: false,
        useDefaultXhrHeader: false,
        timeout: 45000,
        headers: {
          "Content-Type": "text/plain"
        },
        params: {
          'email-from': emailFrom,
          'email-to': me.getSendToEmail(),
          'email-subject': me.getEmailSubject(),
          'email-body': '<html><body><p>' + bodyText + '</p></body></html>',
          'idag': idag,
          'riktig': riktig,
          'ikkerett': ikkerett,
          'fin': fin
        },
        success: me.onSendSuccess,
        failure: me.onSendFailure,
        scope: me
      });
    } else {
      bodyText += Lang.emailpopup.Email_DateCompleted + ':' + compDate + cr + cr + Lang.emailpopup.Email_TotalCorrect + ':' + results.correct + cr + Lang.emailpopup.Email_TotalIncorrect + ':' + results.incorrect + cr + Lang.emailpopup.Email_Percent + ':' + results.intScore + cr + cr;
      winurl = 'mailto:' + me.getSendToEmail() + '?subject=' + me.getEmailSubject() + '&body=' + escape(bodyText);
      win = window.open(winurl, Lang.emailpopup.Email_Window);
    }
  },
  onSendSuccess: function(response) {
    var me = this,
      responseObj;
    try {
      responseObj = JSON.parse(response.responseText);
    } catch (e) {
      me.onSendFailure(response);
    }
    if (responseObj && responseObj.success) {
      // successful send
      Ext.Msg.alert(Lang.emailpopup.Email_Sent, Lang.emailpopup.Email_Sent_Message, function() {
        me.emailPopup.close();
      });
    } else {
      me.onSendFailure(response, responseObj);
    }
  },
  onSendFailure: function(response, responseObj) {
    var me = this,
      title = Lang.emailpopup.Could_Not_Send_Email,
      message = Lang.emailpopup.Please_try_again_later;
    if (responseObj && responseObj.message) {
      message = responseObj.message;
    }
    Ext.Msg.alert(title, message, function() {
      me.emailPopup.close();
    });
    console.error("Email, invalid response:", response, responseObj);
  }
});