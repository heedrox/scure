global.chai = require('chai');
global.sinon = require('sinon');
global.chai.should();
global.expect = global.chai.expect;

global.buildTestScure = () => {
  const { data } = require('./data/data-test');
  return require('../src/scure.js').buildScureFor(data);
};