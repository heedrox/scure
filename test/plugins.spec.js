const { scureAnswer } = require('../src/commands/scure-answer');
const { scureUse } = require('../src/commands/scure-use');
const { scureInitializeState } = require('../src/commands/scure-initializer');

const scure = buildTestScure();

describe('plugins are handled', () => {
  let data = null;

  beforeEach(() => {
    data = scureInitializeState(scure, {});
  });

  it('handles plugins extensions when actions', () => {
    data.dummyPluginText = '-MyDummyText-';
    data.roomId = 'sala-mandos';
    data.question = 'computer-code-plugin';

    const response = scureAnswer('1234', data, scure);

    expect(response.sentence).to.contains('-MyDummyText-Bien-MyDummyText-');
  });

  it('handles plugins extensions when using', () => {
    data.dummyPluginText = '-MyDummyText-';
    data.roomId = 'comedor';

    const response = scureUse(['gasotron', 'zanahoria'], data, scure);

    expect(response.sentence).to.contains('-MyDummyText-Introduzco-MyDummyText-');
  });
});
