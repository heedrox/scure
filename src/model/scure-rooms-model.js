const { isTextEqual } = require('../scure-commons');
const { joinMultipleStrings } = require('../scure-commons');
const { isSynonym } = require('../scure-commons');

const isUnlocked = (unlocked, destination) =>
  (unlocked && unlocked.indexOf(destination.lockCondition) >= 0);
const getUnlockedIds = unlocked => (destination) => {
  if (!destination.isLockedDestination) return destination;
  if (isUnlocked(unlocked, destination)) return destination.roomId;
  return null;
};
const getLockedIds = unlocked => destination =>
  ((destination.isLockedDestination && !isUnlocked(unlocked, destination)) ?
    destination.roomId : null);
const notNull = d => d !== null;
const getUnlockedDestinationsIds = (theMap, fromId, unlocked) =>
  theMap[fromId].map(getUnlockedIds(unlocked)).filter(notNull);
const getLockedDestinationIds = (theMap, fromId, unlocked) =>
  theMap[fromId].map(getLockedIds(unlocked)).filter(notNull);
const roomById = id => r =>
  (r.isLockedDestination && r.roomId === id) || (!r.isLockedDestination && r === id);
const byLockedDestinationAndId = roomId => r => r.isLockedDestination && r.roomId === roomId;
const isADestination = (theMap, fromId, roomId) => theMap[fromId].find(roomById(roomId));
const isALockedDestination = (theMap, fromId, roomId, unlocked) =>
  getLockedDestinationIds(theMap, fromId, unlocked).indexOf(roomId) >= 0;

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

  isAllowedDestination(destinationName, fromRoomId, unlocked) {
    const room = this.getRoomByName(destinationName);
    const destIds = getUnlockedDestinationsIds(this.map, fromRoomId, unlocked);
    return destIds.indexOf(room.id) >= 0;
  }

  isDestinationLocked(destinationName, fromRoomId, unlocked) {
    const room = this.getRoomByName(destinationName);
    const isAPossibleDestination = isADestination(this.map, fromRoomId, room.id);
    const isLocked = isALockedDestination(this.map, fromRoomId, room.id, unlocked);
    return isAPossibleDestination && isLocked;
  }

  getDestinationLockedSentence(destinationName, fromRoomId) {
    const room = this.getRoomByName(destinationName);
    const theLockedDestination = this.map[fromRoomId].find(byLockedDestinationAndId(room.id));
    return theLockedDestination ? theLockedDestination.sentence : null;
  }

  getPossibleDestinationNamesFrom(id, unlocked) {
    const unlockedIds = getUnlockedDestinationsIds(this.map, id, unlocked);
    const destNames = unlockedIds.map(rId => this.getRoom(rId).name);
    return unlockedIds.length > 1 ? joinMultipleStrings(destNames) : destNames;
  }
}

exports.ScureRooms = ScureRoomsModel;
