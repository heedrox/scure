const { isEmptyArg } = require('../lib/common');
const { aResponse } = require('../scure-response');
const { getPossibleDestinationsSentence } = require('../scure-commons');
const { getDescription } = require('../scure-commons');

const getPlacesToGo = (scure, data) => {
  const possibleDestinations = getPossibleDestinationsSentence(scure, data);
  return possibleDestinations !== '' ? possibleDestinations : scure.sentences.get('walk-nowhere');
};
const getDestinationUnknownSentence = (arg, scure, data) => {
  const destinationsSentence = getPossibleDestinationsSentence(scure, data);
  const unknownPlaceSentence = scure.sentences.get('destination-unknown', { destination: arg });
  return `${unknownPlaceSentence} ${destinationsSentence}`;
};

const getNotAlowedSentence = (arg, scure, data) => {
  const isLocked = scure.rooms.isDestinationLocked(arg, data.roomId, data.unlocked);
  const lockedDestinationSentence = scure.rooms.getDestinationLockedSentence(arg, data.roomId);
  return (isLocked && lockedDestinationSentence) ?
    lockedDestinationSentence : getDestinationUnknownSentence(arg, scure, data);
};
const byAllowedDestination = (rooms, currentRoomId, unlocked) =>
  nr => rooms.isAllowedDestinationId(nr.id, currentRoomId, unlocked);

const scureWalk = (arg, data, scure) => {
  if (isEmptyArg(arg)) {
    const response = getPlacesToGo(scure, data);
    return aResponse(response, data);
  }
  const newRooms = scure.rooms.getRoomsByName(arg);
  if (!newRooms || newRooms.length === 0) {
    return aResponse(getDestinationUnknownSentence(arg, scure, data), data);
  }
  const newRoom = newRooms.find(byAllowedDestination(scure.rooms, data.roomId, data.unlocked));
  if (!newRoom) {
    return aResponse(getNotAlowedSentence(arg, scure, data), data);
  }
  data.roomId = newRoom.id;
  return aResponse(getDescription(newRoom.description, data, scure), data);
};

exports.scureWalk = scureWalk;
