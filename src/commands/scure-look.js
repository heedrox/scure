const { isEmptyArg } = require('../lib/common');
const { aResponse } = require('../scure-response');
const { getPossibleDestinationsSentence } = require('../scure-commons');
const { getDescription } = require('../scure-commons');

const ROOM_SYNS = ['habitación', 'habitacion', 'lugar', 'lugares', 'room', 'rooms', 'space', 'place'];

const lookRoomResponse = (scure, data, roomId) => {
  const room = scure.rooms.getRoom(roomId);
  return aResponse(`${getDescription(room.description, data, scure)} ${getPossibleDestinationsSentence(scure, data)}`);
};

const isInInventory = (scure, item, data) => scure.items.isInInventory(item.id, data.inventory);
const isInLocation = (item, roomId) =>
  (item.location === null) || (roomId === item.location && item.location !== null);

const itemIsNotFound = (scure, data, roomId, item) =>
  !item || (!isInInventory(scure, item, data) && !isInLocation(item, roomId));

const itemNotFoundResponse = (scure) => aResponse(scure.sentences.get('item-not-in-location'));
const itemDescriptionResponse = (scure, data, item) => aResponse(getDescription(item.description, data, scure));

const currentRoom = (data) => data.roomId;

const itemIsTheRoom = (itemName) => (ROOM_SYNS.indexOf(itemName) >= 0);

const scureLook = (itemName, data, scure) => {
  const roomId = currentRoom(data);
  const item = scure.items.getBestItem(itemName, roomId, scure);
  if (isEmptyArg(itemName) || itemIsTheRoom(itemName)) {
    return lookRoomResponse(scure, data, roomId);
  }
  if (itemIsNotFound(scure, data, roomId, item)) {
    return itemNotFoundResponse(scure);
  }
  return itemDescriptionResponse(scure, data, item);
};

exports.scureLook = scureLook;
