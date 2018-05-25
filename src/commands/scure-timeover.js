/* eslint-disable no-unused-vars */
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
  return aResponse(scure.sentences.get('end-timeover'), data);
};

exports.scureTimeover = scureTimeover;
