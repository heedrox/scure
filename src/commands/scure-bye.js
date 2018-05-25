/* eslint-disable no-unused-vars */
const { aResponse } = require('../scure-response');

const cleanData = (data) => {
  data.numCommands = 0;
  data.roomId = null;
  data.startTime = null;
  data.inventory = [];
  data.picked = [];
};

const scureBye = (data, scure) => {
  cleanData(data);
  return aResponse(scure.sentences.get('bye'), null);
};

exports.scureBye = scureBye;
