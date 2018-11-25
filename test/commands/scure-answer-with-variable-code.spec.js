const { scureAnswer } = require('../../src/commands/scure-answer');
const { anAnswer, anUnlockingAction } = require('../../src/dsl');

const scure = buildTestScure();

describe('Ric Escape - answering actions with variable code', () => {
  let backupData;

  beforeEach(() => {
    backupData = scure.data;
  });

  afterEach(() => {
    scure.data = backupData;
  });

  it('checks variable answers when fail', () => {
    scure.data.answers.push(anAnswer('variable-code', 'var:variableWhereResidesResult', anUnlockingAction('OK!', 'variable-code-lock'), 'KO!'));
    const data = { unlocked: [], roomId: 'sala-mandos', question: 'variable-code', variableWhereResidesResult: 9876 };
    const userAnswer = '2345';

    const response = scureAnswer(userAnswer, data, scure);

    expect(response.sentence).to.contains('KO!');
    expect(response.data.unlocked).not.to.contains('variable-code-lock');
  });

  it('checks variable answers when ok', () => {
    scure.data.answers.push(anAnswer('variable-code', 'var:variableWhereResidesResult', anUnlockingAction('OK!', 'variable-code-lock'), 'KO!'));
    const data = { roomId: 'sala-mandos', question: 'variable-code', variableWhereResidesResult: 9876 };
    const userAnswer = '9876';

    const response = scureAnswer(userAnswer, data, scure);

    expect(response.sentence).to.contains('OK!');
    expect(response.data.unlocked).to.contains('variable-code-lock');
  });
});
