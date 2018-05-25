const scure = buildTestScure();
const { scureInitializeState } = require('../src/scure-initializer');

const ABOUT_90_MINUTES_AGO = new Date(new Date().getTime() - (90 * 1000 * 60));

describe('Ric Escape - initializer', () => {
  describe('initializes num commands', () => {
    const TEST_CASES = [
      { data: null, expectedNumCommands: 1 },
      { data: { numCommands: 1 }, expectedNumCommands: 2 },
    ];

    TEST_CASES.forEach((testCase) => {
      it(`Counts num of commands for expected ${testCase.expectedNumCommands}: `, () => {
        let data = testCase.data;

        data = scureInitializeState(scure, data);

        expect(data.numCommands).to.equal(testCase.expectedNumCommands);
      });
    });
  });
});
