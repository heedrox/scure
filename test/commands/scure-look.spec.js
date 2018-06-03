const scure = buildTestScure();
const { scureLook } = require('../../src/commands/scure-look');
const { scureInitializeState } = require('../../src/commands/scure-initializer');
const { stateLock } = require('../../src/lib/');

describe('Ric Escape - when looking up', () => {
  let data = null;

  beforeEach(() => {
    data = scureInitializeState(scure, {});
  });

  const EMPTY_ARGS = [null, undefined, '', ' ', 'habitación', 'lugar', [], {}];

  EMPTY_ARGS.forEach((arg) => {
    it(`looks the room and shows destinations when no argument given or 'habitacion' or 'lugar' is said (arg: ${arg})`, () => {
      const itemName = arg;
      data.roomId = 'sala-mandos';

      const response = scureLook(itemName, data, scure);

      expect(response.sentence).to.contains(scure.rooms.getRoom('sala-mandos').description);
      expect(response.sentence).to.contains('Desde aquí puedo ir a: Pasillo norte');
    });
  });

  it('does not say possible destinations when no destinations are possible', () => {
    const itemName = '';
    data.roomId = 'habitacion-110';
    stateLock(data, 'closed-inside-110');

    const response = scureLook(itemName, data, scure);

    expect(response.sentence).to.contains(scure.rooms.getRoom('habitacion-110').description);
    expect(response.sentence).not.to.contains('Desde aquí puedo ir a');
  });

  it('looks the room depending on conditions', () => {
    const itemName = null;
    data.roomId = 'comedor';
    data.picked = ['comedor-cartera'];

    const response = scureLook(itemName, data, scure);

    expect(response.sentence).to.contains('Estoy en el comedor de la nave espacial');
    expect(response.sentence).to.not.contains('También veo algo en el suelo.');
  });

  const ARGS = ['Ventanas al exterior', 'ventana', 'véntana'];

  ARGS.forEach((arg) => {
    it(`looks the description of the object when argument is given - ${JSON.stringify(arg)}`, () => {
      const itemName = arg;
      data.roomId = 'sala-mandos';

      const response = scureLook(itemName, data, scure);

      expect(response.sentence).to.equal(scure.items.getItem('sala-mandos-ventanas').description);
    });
  });

  it('looks the description of the item when in inventory', () => {
    const itemName = 'combinación 4815';
    data.roomId = 'sala-mandos';
    data.inventory = ['combinacion-4815'];

    const response = scureLook(itemName, data, scure);

    expect(response.sentence).to.equal(scure.items.getItem('combinacion-4815').description);
  });

  it('looks the description of the proper item when in room', () => {
    const itemName = 'paredes';
    data.roomId = 'pasillo-sur';

    const response = scureLook(itemName, data, scure);

    expect(response.sentence).to.equal(scure.items.getItem('passur-pared').description);
  });

  it('looks the description of the proper item in a universally located item (item.location == null)', () => {
    const itemName = 'robot';
    data.roomId = 'habitacion-108';

    const response = scureLook(itemName, data, scure);

    expect(response.sentence).to.contains('RIC');
  });

  const INVALID_ARGS = ['ventana', 'not a valid object'];

  INVALID_ARGS.forEach((arg) => {
    it(`cannot look an object when not in place or not valid obj - ${JSON.stringify(arg)}`, () => {
      const itemName = arg;
      data.roomId = 'pasillo-central';

      const response = scureLook(itemName, data, scure);

      expect(response.sentence).to.contains('No encuentro o veo ese objeto.');
    });
  });

  describe('changes description of things depending on condition picked', () => {
    it('shows default description when object is not picked up', () => {
      const itemName = 'suelo';
      data.roomId = 'comedor';

      const response = scureLook(itemName, data, scure);

      expect(response.sentence).to.contains('Veo una cartera en el suelo');
    });

    it('shows another description when object is picked up', () => {
      const itemName = 'suelo';
      data.roomId = 'comedor';
      data.picked = ['comedor-cartera'];

      const response = scureLook(itemName, data, scure);

      expect(response.sentence).to.contains('Es el suelo. No veo nada más.');
    });
  });

  it('shows item descriptions based on plugins', () => {
    const itemName = 'Objeto especial para plugin looking';
    data.roomId = 'sala-mandos';
    data.dummyPluginText = 'This is what Dummy plugin says';

    const response = scureLook(itemName, data, scure);

    expect(response.sentence).to.equal('This is what Dummy plugin says');
  });
});
