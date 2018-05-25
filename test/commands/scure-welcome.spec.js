const { data } = require('../data/data-test');
const scure = require('../../src/scure.js').buildScureFor(data);
const { scureWelcome } = require('../../src/commands/scure-welcome');

describe('Ric Escape - welcome', () => {
  it('welcomes you', () => {
    const response = scureWelcome([], scure);

    expect(response.sentence).to.contains('¡Hola! Soy RIC.');
  });
});
