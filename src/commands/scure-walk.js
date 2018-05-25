const { isEmptyArg } = require('../lib/common');
const { aResponse } = require('../scure-response');
const { getPossibleDestinationsSentence } = require('../scure-commons');
const { getDescription } = require('../scure-commons');

const scureWalk = (arg, data, scure) => {
  if (isEmptyArg(arg)) {
    return aResponse(getPossibleDestinationsSentence(scure, data));
  }
  const newRoom = scure.rooms.getRoomByName(arg);
  const isAllowed = scure.rooms.isAllowedDestination(arg, data.roomId, data.unlocked);
  if (!newRoom || !isAllowed) {
    const destinationsSentence = getPossibleDestinationsSentence(scure, data);
    const unknownPlaceSentence = scure.sentences.get('destination-unknown', { destination: arg });
    return aResponse(`${unknownPlaceSentence} ${destinationsSentence}`);
  }
  data.roomId = newRoom.id;
  return aResponse(getDescription(newRoom.description, data, scure), data);
};

exports.scureWalk = scureWalk;
