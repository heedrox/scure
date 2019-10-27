const { aRoom } = require('../../src/dsl');
const { ScureRooms } = require('../../src/model/scure-rooms-model');

const room = id => aRoom(id, id, [], id);
const ALL_ROOMS = [
  room('room1'), room('room2'), room('room3'), room('room4'), room('room5'), room('room6'),
];

describe('Ric Escape - scure.rooms can find jumpable rooms', () => {
  it('cannot jump when empty room', () => {
    const scureRooms = new ScureRooms([], { room1: ['room1A'] });

    const canJump = scureRooms.isDestinationJumpableFrom('room2', 'room1');

    expect(canJump).to.equal(false);
  });

  it('cannot jump when empty map', () => {
    const scureRooms = new ScureRooms(ALL_ROOMS, {});

    const canJump = scureRooms.isDestinationJumpableFrom('room2', 'room1');

    expect(canJump).to.equal(false);
  });

  it('can jump from one room to another one', () => {
    const scureRooms = new ScureRooms(ALL_ROOMS, { room1: ['room2'] });

    const canJump = scureRooms.isDestinationJumpableFrom('room2', 'room1', []);

    expect(canJump).to.equal(true);
  });

  it('can jump from one room to another one even if not direct', () => {
    const scureRooms = new ScureRooms(ALL_ROOMS, { room1: ['room2'], room2: ['room3'] });

    const canJump = scureRooms.isDestinationJumpableFrom('room3', 'room1', []);

    expect(canJump).to.equal(true);
  });

  it('can jump from one room to another one even if not direct at any level', () => {
    const scureRooms = new ScureRooms(ALL_ROOMS, { room1: ['room2'], room2: ['room3'], room3: ['room4'], room4: ['room5'] });

    const canJump = scureRooms.isDestinationJumpableFrom('room5', 'room1', []);

    expect(canJump).to.equal(true);
  });

  it('can jump from one room to another one even if not direct at any level with redundants room', () => {
    const scureRooms = new ScureRooms(ALL_ROOMS, { room1: ['room2', 'room5'], room2: ['room1', 'room3'], room4: ['room5', 'room3'], room5: ['room1', 'room4'] });

    const canJump = scureRooms.isDestinationJumpableFrom('room3', 'room5', []);

    expect(canJump).to.equal(true);
  });

  it('cannot jump from one room to another one when not direct at any level with redundants room', () => {
    const scureRooms = new ScureRooms(ALL_ROOMS, { room1: ['room2', 'room5'], room2: ['room1', 'room3'], room4: ['room5', 'room3'], room5: ['room1', 'room4'] });

    const canJump = scureRooms.isDestinationJumpableFrom('room6', 'room5', []);

    expect(canJump).to.equal(false);
  });
});
