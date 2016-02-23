{
	"config": {
		"passingScore": 60,
		"randomize": false
	},
	"questions": [{
		"time": 0,
		"timeLimit": 0,
		"questionId": "Question-0",
		"background": "rgba(50, 50, 0, .5)",
		"submitResponse": true,
		"casesensitive": false,
		"randomizeDistractors": false,
		"qtype": "trueFalse",
		"answered": false,
		"strLearningObjectiveID": "1",
		"intWeighting": 1,
		"answer": "radio_input=='true'",
		"response": {
			"correct": "GOOD",
			"incorrect": "FAIL!!!"
		},
		"questionText": {
			"text": "<div>The definition of convolution is:<img src=\"data/NumberedEquation1.gif\"/></div>",
			"position": {
				"x": "center",
				"y": "center"
			}
		},
		"distractors": [{
			"type": "radio",
			"name": "radio_input",
			"value": "true",
			"text": "True"
		}, {
			"type": "radio",
			"name": "radio_input",
			"value": "false",
			"text": "False"
		}],
		"submitButton": {
			"text": "Submit",
			"position": {
				"x": "center",
				"y": "center"
			}
		},
		"continueButton": {
			"text": "Continue",
			"position": {
				"x": "center",
				"y": "center"
			}
		}
	}, {
		"time": 44.5,
		"timeLimit": 0,
		"questionId": "Question-1",
		"background": "rgba(50, 50, 0, .7)",
		"submitResponse": true,
		"casesensitive": false,
		"randomizeDistractors": true,
		"qtype": "multipleChoice",
		"answered": false,
		"strLearningObjectiveID": "1",
		"intWeighting": 1,
		"answer": "radio_input=='laplace'",
		"response": {
			"correct": "GOOD",
			"incorrect": "FAIL!!!"
		},
		"questionText": {
			"text": "<div>The first step is to?</div>",
			"position": {
				"x": "center",
				"y": "center"
			}
		},
		"distractors": [{
			"type": "radio",
			"name": "radio_input",
			"value": "laplace",
			"text": "Take the Laplace Transformation."
		}, {
			"type": "radio",
			"name": "radio_input",
			"value": "fourier",
			"text": "Take the Fourier Transformation."
		}, {
			"type": "radio",
			"name": "radio_input",
			"value": "z",
			"text": "Take the Z Transformation."
		}, {
			"type": "radio",
			"name": "radio_input",
			"value": "ball",
			"text": "Curl up in a ball and cry."
		}, {
			"type": "radio",
			"name": "radio_input",
			"value": "none",
			"text": "None of the above"
		}],
		"submitButton": {
			"text": "Submit",
			"position": {
				"x": "center",
				"y": "center"
			}
		},
		"continueButton": {
			"text": "Continue",
			"position": {
				"x": "center",
				"y": "center"
			}
		}
	}, {
		"time": 123.4,
		"timeLimit": 0,
		"questionId": "Question-2",
		"background": "rgba(0, 0, 0, .1)",
		"submitResponse": true,
		"strLearningObjectiveID": "1",
		"intWeighting": 1,
		"qtype": "fillIn",
		"casesensitive": false,
		"answer": "sinalphat=='alpha/(s^2+alpha^2)'||sinalphat=='a/(s^2+a^2)'||sinalphat=='α/(s^2+α^2)'",
		"response": {
			"correct": "GOOD",
			"incorrect": "FAIL!!!"
		},
		"questionText": {
			"text": "<div>What is the Laplace transform of sin(&alpha;t)</div>",
			"position": {
				"x": "center",
				"y": "center"
			}
		},
		"distractors": [{
			"type": "input",
			"name": "sinalphat",
			"value": "",
			"text": ""
		}],
		"submitButton": {
			"text": "Submit",
			"position": {
				"x": "center",
				"y": "center"
			}
		},
		"continueButton": {
			"text": "Continue",
			"position": {
				"x": "center",
				"y": "center"
			}
		}
	}]
}