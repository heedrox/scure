const scure = buildTestScure();
const { scureInitializeState } = require('../src/commands/scure-initializer');

describe('Ric Escape - initializer', () => {
  describe('initializes num commands', () => {
    const TEST_CASES = [
      { data: null, expectedNumCommands: 1 },
      { data: { numCommands: 1 }, expectedNumCommands: 2 },
    ];

    TEST_CASES.forEach((testCase) => {
      it(`Counts num of commands for expected ${testCase.expectedNumCommands}: `, () => {
        const { data } = testCase;

        const { numCommands } = scureInitializeState(scure, data);

        expect(numCommands).to.equal(testCase.expectedNumCommands);
      });
    });
  });
});
