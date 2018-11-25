const { scureAnswer } = require('../../src/commands/scure-answer');
const { anAnswer, pluginExtension } = require('../../src/dsl');

const scure = buildTestScure();
const DummyExtension = str => () => `It goes here: ${str}`;


describe('Ric Escape - answering actions handles plugins', () => {
  let backupData;

  beforeEach(() => {
    backupData = scure.data;
  });

  afterEach(() => {
    scure.data = backupData;
  });

  it('handles plugin when ok', () => {
    scure.data.answers.push(anAnswer('plugin-code', '123', pluginExtension(DummyExtension('ok')), pluginExtension(DummyExtension('ko'))));
    const data = { unlocked: [], roomId: 'sala-mandos', question: 'plugin-code', variableWhereResidesResult: 9876 };
    const userAnswer = '123';

    const response = scureAnswer(userAnswer, data, scure);

    expect(response.sentence).to.contains('ok');
  });

  it('handles plugin when ko', () => {
    scure.data.answers.push(anAnswer('plugin-code', '123', pluginExtension(DummyExtension('ok')), pluginExtension(DummyExtension('ko'))));
    const data = { unlocked: [], roomId: 'sala-mandos', question: 'plugin-code', variableWhereResidesResult: 9876 };
    const userAnswer = '234';

    const response = scureAnswer(userAnswer, data, scure);

    expect(response.sentence).to.contains('ko');
  });
});
