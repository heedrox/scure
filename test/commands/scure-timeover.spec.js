const { stateLock, stateUnlock } = require('../../src/lib/state-locks');
const { scureTimeover } = require('../../src/commands/scure-timeover');
const { aCondDesc } = require('../../src/dsl');

const scure = buildTestScure();

const ABOUT_90_MINUTES_AGO = new Date(new Date().getTime() - (90 * 1000 * 60));

describe('Ric Escape - timeover', () => {
  it('finishes when time is up and cleans', () => {
    const data = { startTime: JSON.stringify(ABOUT_90_MINUTES_AGO), inventory: ['cartera'] };

    const response = scureTimeover(data, scure);

    expect(response.sentence).to.contains(scure.sentences.get('end-timeover'));
    expect(response.data.inventory).to.eql([]);
  });

  describe('with conditional texts', () => {
    let timeOverOriginal;

    beforeEach(() => {
      timeOverOriginal = scure.data.sentences['end-timeover'];
    });

    afterEach(() => {
      scure.data.sentences['end-timeover'] = timeOverOriginal;
    });

    it('processes locked descriptions', () => {
      const data = { startTime: JSON.stringify(ABOUT_90_MINUTES_AGO), inventory: ['cartera'] };
      stateLock(data, 'closed-hell');
      scure.data.sentences['end-timeover'] = [
        aCondDesc('!unlocked:closed-hell', 'FIN NOT CLOSED HELL'),
        aCondDesc('unlocked:closed-hell', 'FIN YES CLOSED HELL'),
      ];

      const response = scureTimeover(data, scure);

      expect(response.sentence).to.contains('FIN NOT CLOSED HELL');
    });

    it('processes unlocked descriptions', () => {
      const data = { startTime: JSON.stringify(ABOUT_90_MINUTES_AGO), inventory: ['cartera'] };
      stateUnlock(data, 'closed-hell');
      scure.data.sentences['end-timeover'] = [
        aCondDesc('!unlocked:closed-hell', 'FIN NOT CLOSED HELL'),
        aCondDesc('unlocked:closed-hell', 'FIN YES CLOSED HELL'),
      ];

      const response = scureTimeover(data, scure);

      expect(response.sentence).to.contains('FIN YES CLOSED HELL');
    });
  });
});
