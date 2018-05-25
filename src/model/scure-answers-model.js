const numeralize = x =>
  x.replace(/ /g, '')
    .replace(/uno/g, '1')
    .replace(/dos/g, '2')
    .replace(/tres/g, '3')
    .replace(/cuatro/g, '4')
    .replace(/cinco/g, '5')
    .replace(/seis/g, '6')
    .replace(/siete/g, '7')
    .replace(/ocho/g, '8')
    .replace(/nueve/g, '9')
    .replace(/cero/g, '0');


class ScureAnswersModel {
  constructor(answers) {
    this.answers = answers;
  }

  findByQuestion(question) {
    return this.answers.find(answer => answer.question === question);
  }

  // eslint-disable-next-line class-methods-use-this
  isOk(theAnswer, userAnswer) {
    return theAnswer.answer === numeralize(userAnswer);
  }
}

exports.ScureAnswers = ScureAnswersModel;
