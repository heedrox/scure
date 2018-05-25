const scure = buildTestScure();
const { scureTimeover } = require('../../src/commands/scure-timeover');

const ABOUT_90_MINUTES_AGO = new Date(new Date().getTime() - (90 * 1000 * 60));

describe('Ric Escape - timeover', () => {
  it('finishes when time is up and cleans', () => {
    const data = { startTime: JSON.stringify(ABOUT_90_MINUTES_AGO), inventory: ['cartera'] };

    const response = scureTimeover(data, scure);

    expect(response.sentence).to.contains(scure.sentences.get('end-timeover'));
    expect(response.data.inventory).to.eql([]);
  });
});
