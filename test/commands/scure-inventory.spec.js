const scure = buildTestScure();
const { scureInventory } = require('../../src/commands/scure-inventory');
const { scureInitializeState } = require('../../src/commands/scure-initializer');

describe('Ric Escape - inventory', () => {
  let data = null;

  beforeEach(() => {
    data = scureInitializeState(scure, {});
  });

  it('tells you your inventory', () => {
    data.inventory = ['comedor-cartera'];

    const response = scureInventory(data, scure);

    expect(response.sentence).to.contains('Llevo los siguientes objetos');
    expect(response.sentence).to.contains('Cartera');
  });

  it('tells you your inventory with multiple items', () => {
    data.inventory = ['comedor-cartera', 'hab108-cuadro'];

    const response = scureInventory(data, scure);

    expect(response.sentence).to.contains('Llevo los siguientes objetos');
    expect(response.sentence).to.contains('Cartera y Cuadro');
  });

  xit('tells you your inventory with multiple items in English', () => {
    data.inventory = ['comedor-cartera', 'hab108-cuadro'];

    const response = scureInventory(data, scure);

    expect(response.sentence).to.contains('carrying these items');
    expect(response.sentence).to.contains('Wallet and Picture');
  });


  it('tells you that has nothing', () => {
    data.inventory = null;

    const response = scureInventory(data, scure);

    expect(response.sentence).to.contains('No llevo nada encima.');
  });
});
