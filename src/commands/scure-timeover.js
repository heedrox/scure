/* eslint-disable no-unused-vars */
const { getDescription } = require('../scure-commons');
const { aResponse } = require('../scure-response');

const cleanData = (data) => {
  data.numCommands = 0;
  data.roomId = null;
  data.startTime = null;
  data.inventory = [];
  data.picked = [];
};

const scureTimeover = (data, scure) => {
  cleanData(data);
  const description = getDescription(scure.sentences.get('end-timeover'), data, scure);
  return aResponse(description, data);
};

exports.scureTimeover = scureTimeover;
