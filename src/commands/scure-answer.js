/* eslint-disable no-confusing-arrow */
const { resolveActions } = require('../lib/process-actions');
const { aResponse } = require('../scure-response');
const { handlePluginExtensions } = require('../lib/plugin-executor');

const isAction = response =>
  response.isUnlockingAction || response.isPickingAction || response.isExpectingAnswerAction;

const getSentenceFor = (data, scure) => response =>
  handlePluginExtensions(isAction(response) ? response.response : response, data, scure);

const scureAnswer = (userAnswer, data, scure) => {
  const theAnswer = scure.answers.findByQuestion(data.question);
  const getSentence = getSentenceFor(data, scure);
  data.question = undefined;
  if (!theAnswer) {
    return aResponse(scure.sentences.get('answer-cant'), data);
  } else if (scure.answers.isOk(theAnswer, userAnswer)) {
    data = resolveActions(theAnswer.response, data);
    return aResponse(getSentence(theAnswer.response), data);
  }
  return aResponse(theAnswer.sentenceWhenWrong, data);
};

exports.scureAnswer = scureAnswer;
