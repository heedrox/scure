const scure = buildTestScure();

describe('Ric Escape - room extended getByName', () => {
  it('gets a room name without stop words', () => {
    const room = scure.rooms.getRoomByName('sala mandos');

    expect(room.id).to.eql('sala-mandos');
  });

  it('gets a room name with plurals', () => {
    const room = scure.rooms.getRoomByName('sala mando');

    expect(room.id).to.eql('sala-mandos');
  });
});
