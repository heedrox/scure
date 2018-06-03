const scure = buildTestScure();
const { scurePickup } = require('../../src/commands/scure-pickup');
const { scureInitializeState } = require('../../src/commands/scure-initializer');

describe('Ric Escape - when picking up', () => {
  let data = null;

  beforeEach(() => {
    data = scureInitializeState(scure, {});
  });

  it('tells you item unknown when no arg', () => {
    const response = scurePickup(null, data, scure);

    expect(response.sentence).to.equal(scure.sentences.get('item-unknown'));
  });

  it('tells you item unknown when invalid arg', () => {
    const item = 'not a valid object';
    data.roomId = 'pasillo-norte';

    const response = scurePickup(item, data, scure);

    expect(response.sentence).to.contains('No veo el objeto not a valid object por aquí');
  });

  it('tells you item unknown when arg, but in different room', () => {
    const item = 'cartera';
    data.roomId = 'pasillo-norte';

    const response = scurePickup(item, data, scure);

    expect(response.sentence).to.contains('No veo el objeto cartera por aquí');
  });

  it('tells you it cannot be picked when item not pickable', () => {
    const item = 'ventanas';
    data.roomId = 'sala-mandos';

    const response = scurePickup(item, data, scure);

    expect(response.sentence).to.contains('No puedo llevarme el objeto ventanas al exterior conmigo');
  });

  it('tells you it cannot be picked when item already picked up', () => {
    const item = 'cartera';
    data.roomId = 'comedor';
    data.picked = ['comedor-cartera'];

    const response = scurePickup(item, data, scure);

    expect(response.sentence).to.contains('Ya me llevé el objeto cartera.');
  });

  describe('when conditional picking', () => {
    it('tells you it can pick it up if condition', () => {
      const item = 'Objeto especial para condicion picking';
      data.roomId = 'sala-mandos';
      data.unlocked = ['pickcond'];

      const response = scurePickup(item, data, scure);

      expect(response.sentence).to.contains('Me llevo el objeto');
    });

    it('tells you it can pick it up if condition', () => {
      const item = 'Objeto especial para condicion picking';
      data.roomId = 'sala-mandos';
      data.unlocked = [];

      const response = scurePickup(item, data, scure);

      expect(response.sentence).to.contains('No lo puedes agarrar hasta que cumplas pickcond');
    });
  });


  describe('when valid objects', () => {
    let response;

    beforeEach(() => {
      const item = 'cartera';
      data.roomId = 'comedor';

      response = scurePickup(item, data, scure);
    });
    it('tells you it picked it up when valid arg', () => {
      expect(response.sentence).to.contains('Me llevo el objeto cartera conmigo');
    });

    it('adds the object to inventory', () => {
      expect(response.data.inventory).to.eql(['comedor-cartera']);
    });

    it('marks it as picked up', () => {
      expect(response.data.picked).to.eql(['comedor-cartera']);
    });
  });

  it('tells an aditional response if the item has an aditional picking response', () => {
    const item = 'cuadro';
    data.roomId = 'habitacion-108';

    const response = scurePickup(item, data, scure);

    expect(response.sentence).to.contains('Me llevo el objeto cuadro conmigo');
    expect(response.sentence).to.contains('Veo que al llevarme el cuadro');
  });

  it('tells an alternative response if the item cannot be picked, but has an aditional picking response', () => {
    const item = 'caja fuerte';
    data.roomId = 'habitacion-108';

    const response = scurePickup(item, data, scure);

    expect(response.sentence).to.contains('La caja fuerte está pegada a la pared. Imposible de llevarla encima.');
    expect(response.sentence).to.not.contains('No puedo llevarme el objeto');
  });

  it('tells you first that it has it, if item already in inventory', () => {
    const item = 'aparato';
    data.roomId = 'habitacion-108';
    data.inventory = ['hab108-aparato'];

    const response = scurePickup(item, data, scure);

    expect(response.sentence).to.contains('Ya llevo conmigo');
    expect(response.sentence).to.contains('aparato');
  });
});
