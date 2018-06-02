const { scureAnswer } = require('../../src/commands/scure-answer');
const { scureUse } = require('../../src/commands/scure-use');

const scure = buildTestScure();

describe('Ric Escape - answering actions', () => {
  it('uses items that expect answer', () => {
    const items = ['Objeto especial para esperar respuesta'];
    const data = { roomId: 'sala-mandos' };

    const response = scureUse(items, data, scure);

    expect(response.sentence).to.contains('Dime un número');
    expect(response.data.question).to.equal('number-for-expect');
    expect(response.data.lastContext).to.equal('expecting-answer');
  });

  it('answers with unlock action', () => {
    const userAnswer = '9876';
    const data = { roomId: 'sala-mandos', question: 'computer-code' };

    const response = scureAnswer(userAnswer, data, scure);

    expect(response.sentence).to.contains('El código es correcto. Has desbloqueado el lock.');
    expect(response.data.unlocked).to.contains('computer-code-lock');
    expect(response.data.question).to.be.undefined;
  });

  it('answers are converted to numbers', () => {
    const userAnswer = '9 8 7 seis';
    const data = { roomId: 'sala-mandos', question: 'computer-code' };

    const response = scureAnswer(userAnswer, data, scure);


    expect(response.sentence).to.contains('El código es correcto. Has desbloqueado el lock.');
  });

  it('answers gracefully if no question was pending', () => {
    const userAnswer = '9 8 7 seis';
    const data = { roomId: 'sala-mandos' };

    const response = scureAnswer(userAnswer, data, scure);

    expect(response.sentence).to.contains('¿Perdona? No estaba esperando una respuesta. Inténtalo otra vez.');
  });
});
