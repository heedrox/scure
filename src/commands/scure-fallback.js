/* eslint-disable no-confusing-arrow */
const { aResponse } = require('../scure-response');

const scureFallback = (data, scure) => {
  if (data.numCommands < scure.getInit().welcome.length) {
    const welcomeSentence = scure.getInit().welcome[data.numCommands];
    return aResponse(welcomeSentence, data);
  }
  const time = scure.getLeftTimeFrom(data.startTime);
  return aResponse(scure.sentences.get('fallback', { time }), data);
};

exports.scureFallback = scureFallback;
