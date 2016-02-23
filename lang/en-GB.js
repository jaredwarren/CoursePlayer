Lang = {
	tableofcontents: "Table Of Contents",
	Exit: "Exit",
	Sure_Exit: "Are you sure you want to exit?",

	Help: 'Help',
	Narration: 'Narration',
	Glossary: 'Glossary',

	Loading: 'Loading...',

	TEST: 'TEST',

	help: {
		help: "Click this button to access this help area again",
		glossary: "Click this button to access the glossary",
		close: "Click to save and close the course. If taking this course for credit, you must tap this button in order for your results to be recorded.",
		previous: "Click this button to go to the previous page",
		next: "Click this button to go to the next page",
		toc: "Click this button to show the table of contents",
		narration: "Click this button to access the narration"
	},

	quiz: {
		introheading: "Quiz Introduction",
		Select_an_Option: "Select an Option",
		Tap_CheckAnswer_Button: "Tap CheckAnswer Button",
		Yes_that_is_correct: "Yes that is correct",
		No_that_is_incorrect: "No that is incorrect",
		Incorrect_Try_Again: "Incorrect Try Again",
		Try_Again: "Try Again",
		Incorrect: "Incorrect",
		Correct: "Correct",
		Check_Answer: "Check Answer",
		Reset: "Reset",
		Results: "Results",
		Review: "Review",
		intro: {
			initPrompt: "Click next to begin the quiz"
		}
	},

	questions: {
		TF: {
			True: "True",
			False: "False"
		},
		FB: {
			initPrompt: "Fill in the blank Text Field.",
			EnterAnswer: "Enter you answer here"
		},
		HOIMAGE: {
			initPrompt: "Double click to expand image"
		}
	},

	emailpopup: {
		Email_Title: "Email_Title",
		Name: "Name",
		email_name_error: "email_name_error",
		Email: "Email",
		OK: "OK",
		Email_Directions: "Email Directions",
		Course_Results_Email: "Course Results Email",
		Make_Sure_Send: "Make Sure Send",
		Email_Quiz: "Quiz",
		Email_User: "User",
		Email_Learner: "Learner",
		Email_DateCompleted: "Date Completed",
		Email_TotalCorrect: "Total Correct",
		Email_TotalIncorrect: "Total Incorrect",
		Email_Percent: "Percent",
		Email_Window: "Email Window",
		Email_Sent: "Email Sent",
		Email_Sent_Message: "The email has been sent successfully. ",
		Email_Title: "Email Title",
		Thank_You: "Thank you. Your response has been sent.",
		Could_Not_Send_Email: "Could Not Send Email",
		Please_try_again_later: "Please try again later"
	},
	review: {
		Retake_Test: "Retake Test",
		Your_Answers_Were: "Your Answers Were",
		C: "&#x2713;",
		N: "&#x2717;",
		X: "&nbsp;",
		Test_Results: "Test Results",
		Correct_Answer: "Correct Answer",
		Question_of: "Question {1} of {2} - {status}",
		Review_Score: "Score {score}%",
		Correct_of: "{1} of {2} correct"
	},
	results: {
		Quiz_Results: "Quiz Results",
		Email_Subject: "Quiz Results",
		Email_Results: "Email Results",
		Sorry: "Sorry",
		You_did_not_pass: "You did not pass",
		Pass: "Pass",
		Review: "Review",
		Congrats_Pass: "Congratulations, you passed",
		Total_Correct: "Total Correct",
		Total_Incorrect: "Total Incorrect",
		Score: "Score",
		Print_Results: "Print Results",
		Possible_Score: "Possible Score",
		Percentage: "Percentage"
	},
	audiobox: {
		Loading: "Loading",
		Audio_Error0: "Audio Error 0",
		Audio_Error1: "Audio Error 1",
		Audio_Error2: "Audio Error 3",
		Audio_Error3: "Audio Error 4",
		Audio_Error4: "Audio Error 5"
	},
	videoplayer: {
		Video_Error: "Video Error",
		Loading: "Loading",
		Tap_To_Play: "Tap To Play",
		Click_To_Play: "Click the play button To begin",
		no_video_found: "No Video Source Found",
		No_Source: "No Video Source"
	},
	essay: {
		Type_in_your_answer_here: "Type in your answer here",
		SUBMIT: "Submit"
	},
	definitions: {
		Practice_Instructions: "Instructions",
		Practice_Step1: "Step1",
		Practice_Step2: "Step2",
		Practice_Review: "Review",
		Error: "Error",
		Practice_SelectTerm: "Select a Term",
		ShowInstructions: "Instructions",
		Sorry: "Sorry",
		Begin: "Begin",
		ResetBtn: "Reset",
		Definition: "Definition",
		Continue: "Continue",
		Practice_NotAMatch: "Not a match",
		Try_Again: "Try Again",
		Learn: "Learn",
		Review_Instructions: "Instructions",
		Review_Practice: "Practice"
	},
	scorm: {
		LMS_Error: "LMS Error",
		Scorm_Load_Error: "Error connecting to LMS",
		Course_Bookmark: "Course Bookmark",
		Course_Bookmark_Message: "This course have been bookmarked. Do you want to return to the last page you visited in the course?"
	},
	// Used as general accessor funciton
	get: function(key) {
		return this[key] || key;
	}
};