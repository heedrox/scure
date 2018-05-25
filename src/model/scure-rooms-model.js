const { isTextEqual } = require('../scure-commons');
const { joinMultipleStrings } = require('../scure-commons');
const { isSynonym } = require('../scure-commons');

const isUnlocked = (unlocked, destination) => (unlocked && unlocked.indexOf(destination.lock) >= 0);
const getUnlockedIds = unlocked => (destination) => {
  if (!destination.isLockedDestination) return destination;
  if (isUnlocked(unlocked, destination)) return destination.roomId;
  return null;
};

class ScureRoomsModel {
  constructor(rooms, map) {
    this.rooms = rooms;
    this.map = map;
  }

  getRoom(id) {
    return this.rooms.find(r => r.id === id);
  }

  getRoomByName(name) {
    return this.rooms.find(r => isTextEqual(r.name, name) || isSynonym(r.synonyms, name));
  }

  getUnlockedDestinationsIds(fromId, unlocked) {
    return this.map[fromId].map(getUnlockedIds(unlocked)).filter(d => d !== null);
  }

  isAllowedDestination(destinationName, id, unlocked) {
    const room = this.getRoomByName(destinationName);
    if (!room) return false;
    const destIds = this.getUnlockedDestinationsIds(id, unlocked);
    return destIds.indexOf(room.id) >= 0;
  }

  getPossibleDestinationNamesFrom(id, unlocked) {
    const unlockedIds = this.getUnlockedDestinationsIds(id, unlocked);
    const destNames = unlockedIds.map(rId => this.getRoom(rId).name);
    return joinMultipleStrings(destNames);
  }
}

exports.ScureRooms = ScureRoomsModel;
