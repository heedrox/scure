const { scureUse } = require('../../src/commands/scure-use');
const { scureInitializeState } = require('../../src/commands/scure-initializer');

const scure = buildTestScure();

describe('Ric Escape - when using', () => {
  let data = null;

  beforeEach(() => {
    data = scureInitializeState(scure, {});
  });

  const WRONG_ARG_DATA = [
    { arg: [], expectedSentence: 'use-noarg', comment: 'no arg (null)' },
    { arg: ['Cuadro'], expectedSentence: 'use-cant', comment: 'object does not exist' },
    { arg: ['sillas'], expectedSentence: 'use-cant', comment: 'object cannot be used' },
  ];

  WRONG_ARG_DATA.forEach((td) => {
    it(`tells you cannot be used or wrong object when: ${td.comment}`, () => {
      const itemName = td.arg;
      data.roomId = 'sala-mandos';

      const response = scureUse(itemName, data, scure);

      const expectedResponse = scure.sentences.get(td.expectedSentence, { item: td.arg });
      expect(response.sentence).to.equal(expectedResponse);
    });
  });

  it('tells you cannot be used if not in room', () => {
    const itemName = ['diario'];
    data.roomId = 'pasillo-norte';

    const response = scureUse(itemName, data, scure);

    expect(response.sentence).to.equal(scure.sentences.get('use-cant', { item: 'diario' }));
  });

  it('tells you cannot be used if there is no usage for it', () => {
    const itemName = ['cuadro'];
    data.roomId = 'habitacion-108';

    const response = scureUse(itemName, data, scure);

    expect(response.sentence).to.contains('cuadro');
  });

  it('uses items on inventory, but does not dispose them if onlyOnce = false', () => {
    const itemName = ['llave'];
    data.roomId = 'habitacion-108';
    data.inventory = ['hab108-librarykey'];
    data.picked = ['hab108-librarykey'];

    const response = scureUse(itemName, data, scure);

    expect(response.sentence).to.contains('quieres usar la llave?');
    expect(response.data.inventory).to.contains('hab108-librarykey');
  });

  describe('using objects ok several times', () => {
    const TEST_DATA = [
      { usages: null, expectedText: 'Los primeros minutos del diario', nextUsage: 1 },
      { usages: [], expectedText: 'Los primeros minutos del diario', nextUsage: 1 },
      { usages: { 'sala-mandos-diario': 1 }, expectedText: 'Los siguientes minutos del diario', nextUsage: 2 },
      { usages: { 'sala-mandos-diario': 2 }, expectedText: 'Los últimos minutos del diario', nextUsage: 3 },
      { usages: { 'sala-mandos-diario': 3 }, expectedText: 'Los primeros minutos del diario', nextUsage: 4 },
    ];

    TEST_DATA.forEach((testData) => {
      it(`responds depending of number of times used ${testData.usages && testData.usages['sala-mandos-diario']}`, () => {
        const itemName = ['diario'];
        data.roomId = 'sala-mandos';
        data.usages = testData.usages;

        const response = scureUse(itemName, data, scure);

        expect(response.sentence).to.contains(testData.expectedText);
        expect(response.data.usages['sala-mandos-diario']).to.equal(testData.nextUsage);
      });
    });
  });

  describe('when unlocking actions', () => {
    it('adds to unlocked array', () => {
      const itemName = ['diario de abordo'];
      data.roomId = 'sala-mandos';
      data.usages = { 'sala-mandos-diario': 1 };

      const response = scureUse(itemName, data, scure);

      expect(response.data.unlocked).to.eql(['hab108']);
    });
    it('does not add it twice', () => {
      const itemName = ['diario de abordo'];
      data.roomId = 'sala-mandos';
      data.unlocked = ['hab108'];
      data.usages = { 'sala-mandos-diario': 4 };

      const response = scureUse(itemName, data, scure);

      expect(response.data.unlocked).to.eql(['hab108']);
    });
  });

  it('uses items even if wrongly accented', () => {
    const itemName = ['diário'];
    data.roomId = 'sala-mandos';

    const response = scureUse(itemName, data, scure);

    expect(response.data.usages['sala-mandos-diario']).to.equal(1);
  });

  it('uses items that are in two different rooms, but chooses the right one depending on current roomId', () => {
    const itemName = ['diario'];
    data.roomId = 'habitacion-108';

    const response = scureUse(itemName, data, scure);

    expect(response.sentence).to.contains('Son las primeras');
  });

  it('uses item from the inventory', () => {
    const itemName = ['cartera'];
    data.roomId = 'sala-mandos';
    data.picked = ['comedor-cartera'];
    data.inventory = ['comedor-cartera'];

    const response = scureUse(itemName, data, scure);

    expect(response.data.usages['comedor-cartera']).to.equal(1);
  });

  it('provides - picks items if is a pickable action and disposes old one', () => {
    const itemName = ['cartera'];
    data.roomId = 'pasillo-norte';
    data.picked = ['comedor-cartera'];
    data.inventory = ['comedor-cartera'];

    const response = scureUse(itemName, data, scure);

    expect(response.sentence).to.contains('Veo que');
    expect(response.data.picked).to.contains('comedor-cartera');
    expect(response.data.picked).to.contains('combinacion-4815');
    expect(response.data.inventory).to.not.contains('comedor-cartera');
    expect(response.data.inventory).to.contains('combinacion-4815');
  });

  it('provides - picks items if a pickable action even if I dont have it but im in the place', () => {
    const itemName = ['cartera'];
    data.roomId = 'comedor';
    data.usages = { 'comedor-cartera': 1 };

    const response = scureUse(itemName, data, scure);

    expect(response.sentence).to.contains('Ya utilicé ese objeto. No puedo usarlo otra vez.');
  });

  it('uses items if they are not attached to a room (null location)', () => {
    const itemName = ['robot'];
    data.roomId = 'habitacion-108';

    const response = scureUse(itemName, data, scure);

    expect(response.sentence).to.contains('Ya me estás usando');
  });

  it('uses items only once if marked as onlyOnce to true', () => {
    const itemName = ['cartera'];
    data.roomId = 'comedor';

    const response = scureUse(itemName, data, scure);

    expect(response.sentence).to.contains('Veo que');
    expect(response.data.picked).to.contains('comedor-cartera');
    expect(response.data.picked).to.contains('combinacion-4815');
    expect(response.data.inventory).to.not.contains('comedor-cartera');
    expect(response.data.inventory).to.contains('combinacion-4815');
  });

  it('tries to use two items but fails if no usage for both', () => {
    const itemName = ['combinación', 'cartera'];
    data.roomId = 'habitacion-108';
    data.picked = ['comedor-cartera', 'combinacion-4815'];
    data.inventory = ['comedor-cartera', 'combinacion-4815'];

    const response = scureUse(itemName, data, scure);

    expect(response.sentence).to.contains('No puedo usar los objetos');
    expect(response.sentence).to.contains('cartera');
    expect(response.sentence).to.contains('combinación');
  });

  it('tries to use two items but fails if one not exists', () => {
    const itemName = ['noexiste', 'cartera'];
    data.roomId = 'habitacion-108';
    data.picked = ['comedor-cartera', 'combinacion-4815'];
    data.inventory = ['comedor-cartera', 'combinacion-4815'];

    const response = scureUse(itemName, data, scure);

    expect(response.sentence).to.contains('No puedo usar el objeto');
    expect(response.sentence).to.contains('noexiste');
  });

  it('fails to use two items if were used and onlyOnce', () => {
    const itemName = ['combinacion', 'caja fuerte'];
    data.roomId = 'habitacion-108';
    data.usages = { 'combinacion-4815-hab108-cajafuerte': 1 };
    data.picked = ['combinacion-4815'];
    data.inventory = ['combinacion-4815'];

    const response = scureUse(itemName, data, scure);

    expect(response.sentence).to.contains('Ya utilicé esos objetos.');
  });

  it('uses two items', () => {
    const itemName = ['combinacion', 'caja fuerte'];
    data.roomId = 'habitacion-108';
    data.picked = ['combinacion-4815'];
    data.inventory = ['combinacion-4815'];

    const response = scureUse(itemName, data, scure);

    expect(response.sentence).to.contains('la caja se ha abierto.');
    expect(response.data.inventory).to.not.contains('combinacion-4815');
    expect(response.data.usages['combinacion-4815-hab108-cajafuerte']).to.equal(1);
  });

  it('uses two items when one is in inventory but another one with same name is in other room', () => {
    const itemName = ['Objeto para testar que se pueda ser usado con el diario', 'diario'];
    data.roomId = 'habitacion-110';
    data.picked = ['hab108-diario'];
    data.inventory = ['hab108-diario'];

    const response = scureUse(itemName, data, scure);

    expect(response.sentence).to.contains('Ok, usado.');
  });

  describe('when conditional descriptions (ric + ordenador, for ex)', () => {
    it('works in case no condition', () => {
      const itemName = ['ric', 'ordenador'];
      data.roomId = 'sala-mandos';
      data.unlocked = [];

      const response = scureUse(itemName, data, scure);

      expect(response.sentence).to.contains('Mi programación no me deja');
    });

    it('works with unlocked condition', () => {
      const itemName = ['ric', 'ordenador'];
      data.roomId = 'sala-mandos';
      data.unlocked = ['ricmodified'];

      const response = scureUse(itemName, data, scure);

      expect(response.sentence.description).to.contains('he alterado');
    });

    describe('consumes the objects when consumesObjects = true and conditional', () => {
      it('does not consume the objects when consumesObjets = false', () => {
        const itemName = ['codigo', 'ric'];
        data.roomId = 'sala-mandos';
        data.inventory = ['codigo-1893'];
        data.unlocked = [];

        const response = scureUse(itemName, data, scure);

        expect(response.sentence).to.contains('Antes de introducir');
        expect(response.data.inventory).to.contains('codigo-1893');
      });

      it('consumes the objects when consumesObjets = true', () => {
        const itemName = ['codigo', 'ric'];
        data.roomId = 'sala-mandos';
        data.inventory = ['codigo-1893'];
        data.unlocked = ['ricpending'];

        const response = scureUse(itemName, data, scure);

        expect(response.sentence).to.contains('Hola, soy RIC, reestablecido a mis valores de fábrica. ');
        expect(response.data.inventory).to.not.contains('codigo-1893');
      });
    });
  });

  it('ends the game when is ending scene ', () => {
    const itemName = ['ric', 'ordenador'];
    data.roomId = 'sala-mandos';
    data.unlocked = ['ricmodified'];

    const response = scureUse(itemName, data, scure);

    expect(response.sentence.isEndingScene).to.equal(true);
    expect(response.sentence.description).to.contains('he alterado');
  });

  it('saves last used command item', () => {
    const itemName = ['diario'];
    data.roomId = 'sala-mandos';

    scureUse(itemName, data, scure);

    expect(data['lastItem']).equals('sala-mandos-diario');
  });
});
