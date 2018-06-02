const { scureFallback } = require('../../src/commands/scure-fallback');
const { scureInitializeState } = require('../../src/commands/scure-initializer');

const scure = buildTestScure();

describe('when fallback', () => {
  let data = null;

  beforeEach(() => {
    data = scureInitializeState(scure, {});
  });

  it('gives you introduction the first time in any intent', () => {
    const response = scureFallback(data, scure);

    expect(response.sentence).to.contains('¡Hola!');
    expect(response.data.numCommands).to.equal(1);
  });

  it('gives you another introduction the second time', () => {
    data.numCommands = 2;

    const response = scureFallback(data, scure);

    expect(response.sentence).to.contains('Tras el proceso biológico');
    expect(response.data.numCommands).to.equal(2);
  });

  it('tells you the time ', () => {
    data.numCommands = 3;

    const response = scureFallback(data, scure);

    expect(response.sentence).to.contains('No te entiendo. Di Ayuda si');
    expect(response.sentence).to.contains('Nos quedan');
    expect(response.sentence).to.contains('minutos y');
    expect(response.sentence).to.contains('segundos para estrellarnos.');
  });
});
