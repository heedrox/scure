const { isEmptyArg } = require('../lib/common');
const { aResponse } = require('../scure-response');
const { getPossibleDestinationsSentence } = require('../scure-commons');
const { getDescription } = require('../scure-commons');

const getDestinationUnknownSentence = (arg, scure, data) => {
  const destinationsSentence = getPossibleDestinationsSentence(scure, data);
  const unknownPlaceSentence = scure.sentences.get('destination-unknown', { destination: arg });
  return `${unknownPlaceSentence} ${destinationsSentence}`
};

const getNotAlowedSentence = (arg, scure, data) => {
  const isLocked = scure.rooms.isDestinationLocked(arg, data.roomId, data.unlocked);
  const lockedDestinationSentence = scure.rooms.getDestinationLockedSentence(arg, data.roomId);
  return (isLocked && lockedDestinationSentence) ?
    lockedDestinationSentence : getDestinationUnknownSentence(arg, scure, data);
};

const scureWalk = (arg, data, scure) => {
  if (isEmptyArg(arg)) {
    return aResponse(getPossibleDestinationsSentence(scure, data), data);
  }
  const newRoom = scure.rooms.getRoomByName(arg);
  if (!newRoom) {
    return aResponse(getDestinationUnknownSentence(arg, scure, data), data);
  }
  const isAllowed = scure.rooms.isAllowedDestination(arg, data.roomId, data.unlocked);
  if (!isAllowed) {
    return aResponse(getNotAlowedSentence(arg, scure, data), data);
  }
  data.roomId = newRoom.id;
  return aResponse(getDescription(newRoom.description, data, scure), data);
};

exports.scureWalk = scureWalk;
