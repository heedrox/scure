const { aResponse } = require('../scure-response');

const scureHelp = (data, scure) => {
  const time = scure.getLeftTimeFrom(data.startTime);
  const helpText = scure.sentences.get('help', { time });

  return aResponse(helpText, data);
};

exports.scureHelp = scureHelp;

