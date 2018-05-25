const scure = buildTestScure();
const { scureBye } = require('../../src/commands/scure-bye');

describe('Ric Escape - bye', () => {
  it('says goodbye if bye intent and cleans', () => {
    const data = { inventory: ['cartera'], startTime: JSON.stringify(new Date() - 50) };

    const response = scureBye(data, scure);

    expect(response.sentence).to.contains('Adiós.');
    expect(response.data).to.eql(null);
  });
});
