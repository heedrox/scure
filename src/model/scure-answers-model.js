const { numeralize } = require('../lib/string-numeralize');

const compareVariableAnswer = (variableAnswer, userAnswer, data) => {
  const variableWhereResides = variableAnswer.replace(/var:/g, '');
  return numeralize(userAnswer) === `${data[variableWhereResides]}`;
};

class ScureAnswersModel {
  constructor(answers) {
    this.answers = answers;
  }

  findByQuestion(question) {
    return this.answers.find(answer => answer.question === question);
  }

  // eslint-disable-next-line class-methods-use-this
  isOk(theAnswer, userAnswer, data) {
    return theAnswer.answer.startsWith('var:') ?
      compareVariableAnswer(theAnswer.answer, userAnswer, data) :
      theAnswer.answer === numeralize(userAnswer);
  }
}

exports.ScureAnswers = ScureAnswersModel;
