const scure = buildTestScure();
const { scureHelp } = require('../../src/commands/scure-help');

describe('Ric Escape - help', () => {
  it('tells you the time and map when help', () => {
    const data = { numCommands: 10, startTime: JSON.stringify(new Date()) };

    const response = scureHelp(data, scure);

    const text = response.sentence;
    expect(text).to.contains('Me puedes dar las siguientes instrucciones: Mirar, Usar, Ir, Coger e Inventario.');
    expect(text).to.contains('Nos quedan');
    expect(text).to.contains('minutos y');
    expect(text).to.contains('segundos para estrellarnos.');
  });
});
