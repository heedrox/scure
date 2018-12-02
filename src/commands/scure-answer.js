/* eslint-disable no-confusing-arrow */
const { resolveActions } = require('../lib/process-actions');
const { aResponse } = require('../scure-response');
const { handlePluginExtensions } = require('../lib/plugin-executor');
const { setExpectQuestion } = require('../lib/expect-question');

const isAction = response =>
  response.isUnlockingAction || response.isPickingAction || response.isExpectingAnswerAction;

const getSentenceFor = (data, scure, answer) => response =>
  handlePluginExtensions(isAction(response) ? response.response : response, data, scure, answer);

const scureAnswer = (userAnswer, data, scure) => {
  const theQuestion = data.question;
  const theAnswer = scure.answers.findByQuestion(theQuestion);
  const getSentence = getSentenceFor(data, scure, userAnswer);
  data.question = undefined;
  if (!theAnswer) {
    return aResponse(scure.sentences.get('answer-cant'), data);
  } else if (scure.answers.isOk(theAnswer, userAnswer, data)) {
    data = resolveActions(theAnswer.response, data);
    return aResponse(getSentence(theAnswer.response), data);
  }
  setExpectQuestion(theQuestion, data);
  return aResponse(getSentence(theAnswer.sentenceWhenWrong), data);
};

exports.scureAnswer = scureAnswer;
