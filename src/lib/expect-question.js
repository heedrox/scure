const setExpectQuestion = (question, data) => {
  data.question = question;
  data.lastContext = 'expecting-answer';
};

exports.setExpectQuestion = setExpectQuestion;
