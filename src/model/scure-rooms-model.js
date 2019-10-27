const { isTextEqual } = require('../scure-commons');
const { joinMultipleStrings } = require('../scure-commons');
const { isSynonym } = require('../scure-commons');

const isUnlocked = (unlocked, destination) => {
  if (typeof destination.lockCondition === 'undefined') return true;
  return (destination && unlocked && unlocked.indexOf(destination.lockCondition) >= 0);
};

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
const isADestinationInMap = (theMap, fromId, roomId) => theMap[fromId].find(roomById(roomId));
const isALockedDestination = (theMap, fromId, roomId, unlocked) =>
  getLockedDestinationIds(theMap, fromId, unlocked).indexOf(roomId) >= 0;

const checkFromRoomId = (sourceRoomId, destinationId, unlocked, map) => {
  if (!map[sourceRoomId]) return false;
  const destIds = getUnlockedDestinationsIds(map, sourceRoomId, unlocked);
  return destIds && destIds.indexOf(destinationId) >= 0;
};

const checkRecursiveFromRoomId = (sourceRoomId, destId, unlocked, map, alreadyChecked) => {
  if (!map[sourceRoomId]) return false;
  if (alreadyChecked[sourceRoomId]) return false;
  const destIds = getUnlockedDestinationsIds(map, sourceRoomId, unlocked);
  alreadyChecked[sourceRoomId] = 1;
  if (!destIds) return false;
  for (let idx = 0; idx < destIds.length; idx += 1) {
    const found = checkFromRoomId(destIds[idx], destId, unlocked, map);
    if (found) return true;
  }
  for (let idx = 0; idx < destIds.length; idx += 1) {
    const found = checkRecursiveFromRoomId(destIds[idx], destId, unlocked, map, alreadyChecked);
    alreadyChecked[destIds[idx]] = 1;
    if (found) return true;
  }

  return false;
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

  getRoomsByName(name) {
    return this.rooms.filter(r => isTextEqual(r.name, name) || isSynonym(r.synonyms, name));
  }

  isAllowedDestinationId(destinationId, fromRoomId, unlocked) {
    const destIds = getUnlockedDestinationsIds(this.map, fromRoomId, unlocked);
    return destIds.indexOf(destinationId) >= 0;
  }

  isDestinationJumpableFrom(destinationId, fromRoomId, unlocked) {
    if (!this.map[fromRoomId]) return false;
    const destination = this.getRoom(destinationId);
    if (!destination) return false;

    const canIGo = checkFromRoomId(fromRoomId, destinationId, unlocked, this.map);
    if (canIGo) return true;

    return checkRecursiveFromRoomId(fromRoomId, destinationId, unlocked, this.map, []);
  }

  isDestinationLockedAndInMap(destinationName, fromRoomId, unlocked) {
    const room = this.getRoomByName(destinationName);
    const isAPossibleDestination = isADestinationInMap(this.map, fromRoomId, room.id);
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
