const { aResponse } = require('../scure-response');

const scureWelcome = (data, scure) =>
  aResponse(scure.getInit().welcome[0], data);

exports.scureWelcome = scureWelcome;
