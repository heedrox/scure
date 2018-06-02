global.chai = require('chai');
global.sinon = require('sinon');
const { buildScureFor } = require('../src/scure.js');
const { data } = require('./data/data-test');

global.chai.should();
global.expect = global.chai.expect;

global.buildTestScure = () => buildScureFor(data);
